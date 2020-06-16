import React, { Component } from 'react';
import axios from 'axios';

import { Redirect } from 'react-router-dom';

import TasksCardList from '../TasksCardList';
import TaskForm from './TaskForm';
import './MyTasks.css';

import Accordion from 'react-bootstrap/Accordion';
import {Card} from 'react-bootstrap';

const statusMsgAreaId = "status-msg-area";
const defaultTaskId = -1; 
const dbDNS = process.env.REACT_APP_HEROKU_POSTGRES_DB;
let closedTasks = [];
let openTasks = [];
let acceptedTasks = [];
let uncompletedTasks = [];
export default class MyTasks extends Component {
    constructor(props) {
        super(props);

        this.state = {

            tasksWorked: [], //list of tasks worked by user
            tasksOwned: [],  //list of tasks opened by user
            myWorkers: [],
            myOwners: [],

            selectedTaskId: defaultTaskId,
            selectedTaskObj: {},
            user: {},        //user logged in
        }

        this.getTaskByWorker = this.getTaskByWorker.bind(this);
        this.getTaskByOwner = this.getTaskByOwner.bind(this);
        this.getUserById = this.getUserById.bind(this);

        this.showStatusMsg = this.showStatusMsg.bind(this);

        this.deleteOwnerTask = this.deleteOwnerTask.bind(this);
        this.addOwnerTask = this.addOwnerTask.bind(this);
        this.addMyWorkers = this.addMyWorkers.bind(this);
        this.addMyOwners = this.addMyOwners.bind(this);
        this.updateOwnerTask = this.updateOwnerTask.bind(this);
        this.updateWorkerTask = this.updateWorkerTask.bind(this);
        
        this.handleUpdateTask = this.handleUpdateTask.bind(this);
        this.handleDeleteTask = this.handleDeleteTask.bind(this);
        this.getSelectedTaskId = this.getSelectedTaskId.bind(this);
        this.getSelectedTaskObj = this.getSelectedTaskObj.bind(this);
        this.setSelectedTaskId = this.setSelectedTaskId.bind(this);

        this.deleteTaskById = this.deleteTaskById.bind(this);
    }

    showStatusMsg(msg) {
        document.getElementById(statusMsgAreaId).innerHTML = msg;
    }

    getSelectedTaskId() {
        return this.state.selectedTaskId;
    }

    getSelectedTaskObj() {
        return this.state.selectedTaskObj;
    }

    setSelectedTaskId(taskId) {
        this.setState( {selectedTaskId: taskId} );
        if ( taskId === defaultTaskId ) {
            //we trying to clear selected task.
            this.setState( {selectedTaskObj : {} } );
        }
    }
    deleteOwnerTask(taskId) {  //delete task locally

        //look up task
        let taskList = this.state.tasksOwned;
        let idx = taskList.findIndex( t => t.id === taskId )
        if (idx >= 0) {

            //delete task
            taskList.splice(idx, 1);
            this.setState( {tasksOwned: taskList }  )
        }
    }

    addOwnerTask(taskObj) {

        this.setState( { tasksOwned: this.state.tasksOwned.concat( [ taskObj ] ) } );
        this.addMyOwners(taskObj.owner);
        this.addMyWorkers(taskObj.worker);
    }

    addMyWorkers( workerId ) {

        if (workerId === this.state.user.id) {  //same as login user
            return;
        }
        
        let idx = this.state.myWorkers.findIndex( u => workerId === u.id );
        if (idx >= 0) {
            return;  //worker already on the list
        }

        //find worker info
        let userList = this.props.location.getUserListCallback();
        idx = userList.findIndex(  u => workerId === u.id );

        //add worker info
        let myWorkerList = this.state.myWorkers;
        if (idx >= 0) {
            myWorkerList.push( userList[idx] );
        }
        this.setState( { myWorkers : myWorkerList } );
    }

    addMyOwners( ownerId ) {

        if (ownerId === this.state.user.id) {  //same as login user
            return;
        }

        let idx = this.state.myOwners.findIndex( u => ownerId === u.id );
        if (idx >= 0) {
            return;  //owner already on the list
        }

        //find owner info
        let userList = this.props.location.getUserListCallback();
        idx = userList.findIndex(  u => ownerId === u.id );

        //add owner info
        let myOwnerList = this.state.myOwners;
        if (idx >= 0) {
            myOwnerList.push( userList[idx] );
        }
        this.setState( { myOwners : myOwnerList } )
    }

    updateOwnerTask(taskObj) {

        let taskList = this.state.tasksOwned.map( t => ( t.id === taskObj.id ? taskObj : t ) )
        this.setState( {tasksOwned: taskList} )
    }

    updateWorkerTask(taskObj) {

        let taskList = this.state.tasksWorked.map( t => ( t.id === taskObj.id ? taskObj : t ) )
        this.setState( {tasksWorked: taskList} )
    }

    componentDidMount() {

        if (Object.keys(this.props).length === 0 && this.props.constructor === Object) {
            return  //props is empty
        }
        if (this.props.location.getUserCallback === undefined) {
            return  //no callback to get user info
        }

        let userObj = this.props.location.getUserCallback(); 
        let userId = userObj.id;

        this.state.user = userObj;

        if (userId === undefined) {
            this.showStatusMsg("Please login first.")   
            return;  //no user logged in
        }

        //query tasks by worker
        this.getTaskByWorker(userId);

        //query tasks by owner
        this.getTaskByOwner(userId);
    }

    async getTaskByWorker(workerId) {
    
        try {
          const response=await axios.get(`${dbDNS}/tae_api/v1/taskbyworker/${workerId}`);
          console.log(`getTaskByWorker (worker:${workerId}) response:`, response.data);

          this.setState( {tasksWorked : response.data} );

          //look up owner info, if it is not found
          response.data.map( taskObj => {
              let idx = this.state.myOwners.findIndex( o => ( o.id === taskObj.owner ) )
              if (idx < 0) {
                  this.getUserById( taskObj.owner, "owner" )
              }
          } ); 

        } catch (e) {
          console.error(e);
        }
    }

    async getTaskByOwner(ownerId) {
    
        try {
          const response=await axios.get(`${dbDNS}/tae_api/v1/task/${ownerId}`);
          console.log(`getTaskByWorker (worker:${ownerId}) response:`, response.data);

          this.setState( {tasksOwned : response.data} );

        //look up worker info, if it is not found, and a worker has been picked, i.e worker > 0
        response.data.map( taskObj => {
            let idx = this.state.myWorkers.findIndex( w => ( w.id === taskObj.worker ) )
            if (idx < 0 && taskObj.worker > 0) {
                this.getUserById( taskObj.worker, "worker" )
            }
        } ); 

        } catch (e) {
          console.error(e);
        }
    }

    async getUserById(userId, position) {
    
        try {
          const response=await axios.get(`${dbDNS}/tae_api/v1/userbyid/${userId}`);
          console.log(`getUserById (user:${userId}) response:`, response.data);

          switch (position) {

            case "owner":   //we got an owner's info. update myOwners state

                this.setState( {myOwners: this.state.myOwners.concat( [ response.data ] )} );
                break;

            case "worker":  //we got a worker's info. update myWorkers state

                this.setState( {myWorkers: this.state.myWorkers.concat( [ response.data ] )} );
                break;

            default:
                console.log(`**Unknown position in getUserById. position: ${position}`)
          }

        } catch (e) {
          console.log(`getUserById error response (user:${userId}. position: ${position})`)
          console.error(e);
        }
    }

    
    async deleteTaskById(taskId) {
                
        try {
            const response=await axios.delete(`${dbDNS}/tae_api/v1/task/${taskId}`);
            console.log("deleteTaskById response:", response.data);

            //refresh owner tasks
            this.getTaskByOwner(this.state.user.id);
    
            } catch (e) {
            console.error(e);
            }
    }

    handleDeleteTask(event) {

        //delete locally
        this.deleteOwnerTask(event.target.id);

        //update any open tasks
        this.props.location.getOpenTasksCallback();

        //clear any prior status msg
        this.showStatusMsg("")

        //delete in db
        this.deleteTaskById(event.target.id);
    }

    handleUpdateTask(taskObj) {

        //set selected task locally
        this.setState( {selectedTaskId: taskObj.id} )
        this.setState( {selectedTaskObj: taskObj});

        this.showStatusMsg("Updating task with the following content")

        this.fillTaskForm(taskObj);
    }

    fillTaskForm(taskObj) {

        document.getElementById("field01").value = taskObj.kind;
        document.getElementById("field02").value = taskObj.hours;
        document.getElementById("field03").value = taskObj.details;
        document.getElementById("field04").value = taskObj.skill1;
        document.getElementById("field05").value = taskObj.skill2;
        document.getElementById("field06").value = taskObj.skill3;
        document.getElementById("field07").value = taskObj.status;
        document.getElementById("field08").value = taskObj.worker;

    }

    categorizeTasks(taskList) {

        //group together completed tasks. for uncompleted tasks, put open tasks ahead of accepted tasks

        closedTasks = [];
        openTasks = [];
        acceptedTasks = [];
        uncompletedTasks = [];

        taskList.map( t => {
            switch (t.status) {

            case "closed":
                closedTasks.push(t);
                break;

            case "accepted":
                acceptedTasks.push(t);
                break;

            case "open":
                openTasks.push(t);
                break;
            default: 
            }
        });

        uncompletedTasks = acceptedTasks.concat( openTasks );
    }

    displayTaskSections(ownerTasks, workingTasks, completedTasks) {

        let myWorkers = this.state.myWorkers;
        let myOwners = this.state.myOwners;

        return ( 

        <div>

            <Accordion defaultActiveKey={3} >
                <Card>
                    <Accordion.Toggle style={{height: 50, backgroundColor: 'grey', color: 'white', marginBottom: 50}} as={Card.Header} eventKey="0">
                        Create a Task
                    </Accordion.Toggle>

                    <Accordion.Collapse eventKey="0">
                    <Card.Body>

                        {/* Form to create a task */}
                        <TaskForm getUserCallback = {this.props.location.getUserCallback}
                                  getUserListCallback = {this.props.location.getUserListCallback}
                                  updateOpenTasksCallback = {this.props.location.updateOpenTasksCallback}
                                  getAvailableUsersCallback = {this.props.location.getAvailableUsersCallback}
                                  getSelectedTaskIdCallback = {this.getSelectedTaskId}
                                  getSelectedTaskObjCallback = {this.getSelectedTaskObj}
                                  setSelectedTaskIdCallback = {this.setSelectedTaskId}
                                  addOwnerTaskCallBack = {this.addOwnerTask}
                                  updateOwnerTaskCallback = {this.updateOwnerTask}
                                  updateWorkerTaskCallback = {this.updateWorkerTask}
                                  showZipRadiusCallback = {this.props.location.showZipRadiusCallback}
                                  statusMsgAreaId = {statusMsgAreaId}
                                    ownerTasks = {ownerTasks} 
                                    workingTasks = {workingTasks}  />

                    </Card.Body>
                    </Accordion.Collapse>
                </Card>

                <Card>
                    <Accordion.Toggle style={{color: 'green', marginBottom: 50}} as={Card.Header} eventKey="1">
                        View Tasks you opened
                    </Accordion.Toggle>

                    <Accordion.Collapse eventKey="1">
                    <Card.Body>

                        {/* display owned tasks */}

                        <TasksCardList cardList={ ownerTasks } 
                                    cardListType="details"
                                    handleUpdateTaskCallback = {this.handleUpdateTask}
                                    handleDeleteTaskCallback = {this.handleDeleteTask}
                                    position="Worker" partnerList={myWorkers} />

                    </Card.Body>
                    </Accordion.Collapse>
                </Card>
                
                <Card>
                    <Accordion.Toggle style={{color: 'orange', marginBottom: 50}} as={Card.Header} eventKey="2">
                        View Tasks you working on
                    </Accordion.Toggle>

                    <Accordion.Collapse eventKey="2">
                    <Card.Body>

                        {/* display working tasks */}

                        <TasksCardList cardList={ workingTasks } 
                                    cardListType="details"
                                    handleUpdateTaskCallback = {this.handleUpdateTask}
                                    position="Owner" partnerList={myOwners} />

                    </Card.Body>
                    </Accordion.Collapse>
                </Card>
                
                <Card>
                    <Accordion.Toggle style={{color: 'blue', marginBottom: 50 }} as={Card.Header} eventKey="3">
                        View Tasks you completed
                    </Accordion.Toggle>

                    <Accordion.Collapse eventKey="3">
                    <Card.Body>

                        {/* display completed tasks */}

                        <TasksCardList cardList={ completedTasks } 
                                        cardListType="details"
                                        position="Owner" partnerList={myOwners} />

                    </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        </div>
            
        )
    }

    render() {
        
        if (Object.keys(this.props).length === 0 && this.props.constructor === Object) {
            return <div></div>  //props is empty
        }

        let toContainerId="mytasks-container";
    
        if (this.props.location.swapDisplayCallback !== undefined) { 
            this.props.location.swapDisplayCallback(toContainerId, this.props);

        } else {
            return (<div>
                
                 <Redirect to='/Home' />    //route back to root (App component) depending on state

                </div>)
        }

        //catogrized worked tasks: group together completed tasks. for uncompleted tasks, put open tasks ahead of accepted tasks
        this.categorizeTasks(this.state.tasksWorked);
        let workingTasks = uncompletedTasks;
        let completedTasks = closedTasks;

        //catogrized owner tasks: put open tasks ahead of accepted tasks, and then the closed tasks
        this.categorizeTasks(this.state.tasksOwned);
        let ownerTasks = openTasks.concat( acceptedTasks ).concat( closedTasks );
    


        return (
            <div id={toContainerId}>

                <h5 id={statusMsgAreaId} style={{ color: 'red',  marginTop: 50, marginBottom: 50 }} ></h5>

                {this.displayTaskSections(ownerTasks, workingTasks, completedTasks)}

            </div>
        )
    }
}
