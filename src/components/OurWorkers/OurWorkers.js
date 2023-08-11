import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

import UserCard from '../UserCard';
import WorkerTaskCard from '../WorkerTaskCard';

const dbDNS = process.env.REACT_APP_HEROKU_POSTGRES_DB || 'http://localhost:8888';
const workerTaskListMax = 3;
export default class OurWorkers extends Component {
    constructor(props) {
        super(props);

        this.state= {

            photoTaskUser: [],     //query response joining tables of taskphoto, task and user 
            photoTaskByUser: [],   //array of objects containing userId, and his task details

            redirectToHome: false
        }

        this.joinPhotoTaskUser = this.joinPhotoTaskUser.bind(this);
        this.groupPhotoTaskByUser = this.groupPhotoTaskByUser.bind(this);
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
        photoTaskUserList.foreach( r => {

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

    componentDidMount() {

        this.joinPhotoTaskUser();
    }

    padArrayWithEmptyObj(arr, max) {
        for (let i=arr.length; i<max; i++) {
            arr.push({});
        }
        return arr;
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
            <div>
                <div className="card-group w-100 d-flex justify-content-center" style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}} >

                    <UserCard key={userDetailObj.name} user={userDetailObj} role="worker" ></UserCard>

                    {/* display the list of task photos for this worker user */}
                    { tasksByUserObj.photoTaskUserList.map( (taskDetailObj) => {
                            return (
                                <WorkerTaskCard key={taskDetailObj.id} taskDetailStr={JSON.stringify(taskDetailObj)} />
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
                {/* route back to root (App component) depending on state */}
                 <Redirect to='/Home' />    

                </div>)
        }

        return (  
            <div id={toContainerId}>

                <p className="text-warning mb-0" style={{ height: 80, marginTop: 30, fontSize: 30, fontWeight: 'bold' }}>Our Workers and their Tasks</p>

                {this.state.photoTaskByUser.map( tasksByUserObj => this.displayTasksByWorker(tasksByUserObj) )}
            </div>
        )
    }
}
