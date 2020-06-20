import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

import UserCard from '../UserCard';
import WorkerTaskCard from '../WorkerTaskCard';
import WorkerTaskCard1 from '../WorkerTaskCard1';

const dbDNS = process.env.REACT_APP_HEROKU_POSTGRES_DB;
const workerTaskListMax = 3;
export default class OurWorkers extends Component {
    constructor(props) {
        super(props);

        this.state= {

            users: [],
            workerTaskPhotos: [],  //array of object containing userId, his tasks, and task details
            
            taskPhotos: [],        //query response for task photos by a worker user
            task: {},              //query response for a task

            photoTaskUser: [],     //query response joining tables of taskphoto, task and user 
            photoTaskByUser: [],   //array of objects containing userId, and his task details

            redirectToHome: false
        }

        this.getTaskPhotoByWorker = this.getTaskPhotoByWorker.bind(this);
        this.getTaskById = this.getTaskById.bind(this);
        this.concatPhotosForWorker = this.concatPhotosForWorker.bind(this);
        this.updateTaskDetailsForWorker = this.updateTaskDetailsForWorker.bind(this);

        this.joinPhotoTaskUser = this.joinPhotoTaskUser.bind(this);
        this.groupPhotoTaskByUser = this.groupPhotoTaskByUser.bind(this);
        this.displayWorkerAndTask = this.displayWorkerAndTask.bind(this);
    }

    async joinPhotoTaskUser() {

        try {
            const response=await axios.get(`${dbDNS}/tae_api/v1/photojointaskjoinuser`);
            console.log("joinPhotoTaskUser response:", response.data);
  
            this.setState( {photoTaskUser : response.data} );
  
            //update worker-task-photo table
            this.groupPhotoTaskByUser(response.data);
  
          } catch (e) {
            console.error(e);
          }
    }

    groupPhotoTaskByUser(photoTaskUserList) {  // parm is join result of taskphoto, tasks, users

        //create a list of worker id that are present in photoTaskUserList
        let photoTaskByUser = [];
        photoTaskUserList.map( r => {

            let idx = photoTaskByUser.findIndex( obj => (obj.worker === r.worker))
            //add a new object if the worker is not in photoTaskByUser
            if ( idx < 0 ) {
                photoTaskByUser.push( { worker: r.worker, photoTaskUserList: [ r ] } );
            } else {

                //add to the task details for the worker if he is already in photoTaskByUser
                photoTaskByUser[idx].photoTaskUserList.push(r);
            }
        })

        this.setState( {photoTaskByUser : photoTaskByUser} );
    }

    async getTaskPhotoByWorker(workerId) {
    
        try {
          const response=await axios.get(`${dbDNS}/tae_api/v1/taskphoto/${workerId}`);
          console.log("getTaskPhotoByWorker response:", response.data);

          this.setState( {taskPhotos : response.data} );

          //update worker-task-photo table
          this.concatPhotosForWorker(workerId, response.data);

          //query the task details by task id
          response.data.map( p => this.getTaskById(workerId, p.task) );

        } catch (e) {
          console.error(e);
        }
    }

    async getTaskById(workerId, taskId) {
    
        try {
          const response=await axios.get(`${dbDNS}/tae_api/v1/taskbyid/${taskId}`);
          console.log(`getTaskById (id:${taskId}) response:`, response.data);

          this.setState( {task : response.data} );

          this.updateTaskDetailsForWorker(workerId, response.data); 

        } catch (e) {
          console.error(e);
        }
    }

    componentDidMount() {

        if (this.props.location.getUserListCallback === undefined) {
            return;
        } 

        this.joinPhotoTaskUser();
        


        let users = this.props.location.getUserListCallback();
        this.state.users = users;
        
        //query photos of tasks worked by ther user
        users.map( user => this.getTaskPhotoByWorker(user.id) );

    }

    concatPhotosForWorker(workerId, photos ) {

        //initialize task details array, with same size as photo array, each elem having same task id
        let tasks = new Array(photos.length);
        tasks = photos.map( p => { return { id: p.task } } );

        let workerTaskPhotObj = { worker: workerId, 
                                  photos: photos,
                                  tasks: tasks }

        //look up the worker by id

        let workerTaskPhotoList = this.state.workerTaskPhotos;
        let idx = workerTaskPhotoList.findIndex( elem => elem.worker === workerId );
        if (idx < 0) {

            //worker is not yet in the table. add as new elem
            workerTaskPhotoList = this.state.workerTaskPhotos.concat( [ workerTaskPhotObj ] );

            this.setState( {workerTaskPhotos : workerTaskPhotoList } );

            return;

        } 
        
        //worker is in table. merge the 2 task arrays

        let taskPhotoList = workerTaskPhotoList[idx].photos;  
        taskPhotoList = taskPhotoList.concat( photos )        //merge task photo arrays
        workerTaskPhotObj.photos = taskPhotoList;             //put merged array in object

        let taskDetailsList = workerTaskPhotoList[idx].tasks; 
        taskDetailsList = taskDetailsList.concat( workerTaskPhotObj.tasks )  //merge task details arrays
        workerTaskPhotObj.tasks = taskDetailsList;            //put merged array in object

        //replace with the object having the the merged array
        workerTaskPhotoList.splice( idx, 1, workerTaskPhotObj );

        this.setState( {workerTaskPhotos : workerTaskPhotoList } );
    }

    updateTaskDetailsForWorker(workerId, task) {
        
        let workerTaskPhotoList = this.state.workerTaskPhotos;
        let idx = workerTaskPhotoList.findIndex( elem => elem.worker === workerId );
        if (idx < 0) {
            return;   //worker is not found
        }

        //update matching task in workerTaskPhotoList with details in task
        let taskList = workerTaskPhotoList[idx].tasks.map( (t ) => {   
                                            if (t.id === task.id) {
                                                return task;
                                            } else {
                                                return t;
                                            }
                                        } )

        //create object with task details for the worker
        let taskObj = {
            worker: workerTaskPhotoList[idx].worker,
            photos: workerTaskPhotoList[idx].photos,
            tasks: taskList
        }

        //replace with the object having the task details
        workerTaskPhotoList.splice( idx, 1, taskObj );

        this.setState( {workerTaskPhotos : workerTaskPhotoList } );
    }

    padArrayWithEmptyObj(arr, max) {
        for (let i=arr.length; i<max; i++) {
            arr.push({});
        }
        return arr;
    }

    displayWorkerAndTask(userObj) {

        let idx = this.state.workerTaskPhotos.findIndex( photoObj => photoObj.worker === userObj.id )
        if (idx < 0) {
            return <div key={userObj.id}></div>  //cannot find user
        } 

        //photos and tasks arrays have the same arity, each corresponding elem belong to the same task
        let photos = this.state.workerTaskPhotos[idx].photos.slice(0,workerTaskListMax); //use up to 3 past project photos and description 
        let tasks = this.state.workerTaskPhotos[idx].tasks.slice(0,workerTaskListMax);
        photos = this.padArrayWithEmptyObj(photos, workerTaskListMax);
        tasks = this.padArrayWithEmptyObj(tasks, workerTaskListMax);

        return (
            <div key={userObj.id}>
                { (this.state.users.length > 0) && <div class="card-group w-100 d-flex justify-content-center" style={{display: 'flex', flexDirection: 'row'}} >

                    <UserCard user={userObj} role="worker" ></UserCard>

                    {/* display the list of task photos for this worker user */}
                    { photos.map( (photoObj, idx) => {
                                    let photoObjStr = JSON.stringify( photoObj );
                                    let taskObjStr = JSON.stringify( tasks[idx] );
                                    return (
                                        <WorkerTaskCard taskStr={taskObjStr} taskPhotoStr={photoObjStr} />
                                    )
                                    
                                }  ) }
                </div>}
            </div>
        )
    }

    displayTasksByWorker(tasksByUserObj) {

        if (tasksByUserObj.photoTaskUserList.length <= 0) {
            return <div></div>;  //no task details
        }

        let photoTaskUserList = tasksByUserObj.photoTaskUserList;
        let userDetailObj = { name: photoTaskUserList[0].name,
                            email: photoTaskUserList[0].email,
                            city: photoTaskUserList[0].city,
                            st: photoTaskUserList[0].st,
                            zip: photoTaskUserList[0].zip,
                            photo: photoTaskUserList[0].photo }

        photoTaskUserList = this.padArrayWithEmptyObj(photoTaskUserList, workerTaskListMax);
        
        return (
            <div key={userDetailObj.name}>
                <div class="card-group w-100 d-flex justify-content-center" style={{display: 'flex', flexDirection: 'row'}} >

                    <UserCard user={userDetailObj} role="worker" ></UserCard>

                    {/* display the list of task photos for this worker user */}
                    { tasksByUserObj.photoTaskUserList.map( (taskDetailObj) => {
                            return (
                                <WorkerTaskCard1 taskDetailStr={JSON.stringify(taskDetailObj)} />
                            )
                                
                        }  ) }
                </div>
            </div>
        )

    }
    
    render () {
        
        if (Object.keys(this.props).length === 0 && this.props.constructor === Object) {
            return <div></div>   //props is empty
        }

        let toContainerId="our-workers-container";
    
        if (this.props.location.swapDisplayCallback !== undefined) { 
            this.props.location.swapDisplayCallback(toContainerId, this.props);

        } else {
            return (<div>
                
                 <Redirect to='/Home' />    //route back to root (App component) depending on state

                </div>)
        }

        return (  
            <div id={toContainerId}>

                <p class="text-warning mb-0" style={{ height: 80, marginTop: 30, fontSize: 30, fontWeight: 'bold' }}>Our Workers and their Tasks</p>

                {this.state.photoTaskByUser.map( tasksByUserObj => this.displayTasksByWorker(tasksByUserObj) )}
{/* { this.state.users.map( userObj => this.displayWorkerAndTask(userObj) ) } */}
            </div>
        )
    }
}
