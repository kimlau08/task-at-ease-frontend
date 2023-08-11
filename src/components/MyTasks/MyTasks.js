import React, { Component } from 'react';
import axios from 'axios';

import { Redirect } from 'react-router-dom';
import {Modal} from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';

import TasksCardList from '../TasksCardList';
import TaskForm from './TaskForm';
import './MyTasks.css';

import {Card} from 'react-bootstrap';


const statusMsgAreaId = "status-msg-area";
const defaultTaskId = -1; 
const dbDNS = process.env.REACT_APP_HEROKU_POSTGRES_DB || 'http://localhost:8888';

export default class MyTasks extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedTaskId: defaultTaskId,
            selectedTaskObj: {},
            user: {},        //user logged in

            taskOwnerListForWorker: [], //result of inner join from task to worker for a owner
            taskWorkerListForOwner: [], //result of left join from task to owner for a worker. A task may not have been assigned a worker yet.

            openModal: false,   //to open/close the modal form for creating/updating a task
            panelActiveKey: 2   //default to open the "task you opened" Accordion panel
        }


        this.showStatusMsg = this.showStatusMsg.bind(this);

        this.updateLocalTaskList = this.updateLocalTaskList.bind(this);
        
        this.handleUpdateTask = this.handleUpdateTask.bind(this);
        this.handleDeleteTask = this.handleDeleteTask.bind(this);
        this.handleCreateTask = this.handleCreateTask.bind(this);
        this.getSelectedTaskId = this.getSelectedTaskId.bind(this);
        this.getSelectedTaskObj = this.getSelectedTaskObj.bind(this);
        this.setSelectedTaskId = this.setSelectedTaskId.bind(this);

        this.deleteTaskById = this.deleteTaskById.bind(this);
    }

    async joinTaskWorkerForOwner(userId) {

        try {
            const response=await axios.get(`${dbDNS}/tae_api/v1/taskjoinworkerforowner/${userId}`);
            console.log(`joinTaskWorkerForOwner owner:${userId} response:`, response.data);
  
            this.setState( {taskWorkerListForOwner : response.data} );
  
          } catch (e) {
            console.error(e);
          }
        
    }
    async joinTaskOwnerForWorker(userId) {

        try {
            const response=await axios.get(`${dbDNS}/tae_api/v1/taskjoinownerforworker/${userId}`);
            console.log(`joinTaskOwnerForWorker worker:${userId}  response:`, response.data);
  
            this.setState( {taskOwnerListForWorker : response.data} );
  
          } catch (e) {
            console.error(e);
          }
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

    updateLocalTaskList(taskObj) {

        
        this.setState({ openModal: false }) //close the modal task form

        if (this.state.user.id === taskObj.owner) {

            this.joinTaskWorkerForOwner(taskObj.owner)
        }
        if (this.state.user.id === taskObj.worker) {

            this.joinTaskOwnerForWorker(taskObj.worker)
        }
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

        this.setState({user : userObj});

        if (userId === undefined) {
            this.showStatusMsg("Please login first.")   
            return;  //no user logged in
        }


        //query tasks worked 
        this.joinTaskOwnerForWorker(userId);

        //query tasks owned (opened by user)
        this.joinTaskWorkerForOwner(userId);

    }
    
    async deleteTaskById(taskObj) {
                
        let taskId = taskObj.id;

        try {
            const response=await axios.delete(`${dbDNS}/tae_api/v1/task/${taskId}`);
            console.log("deleteTaskById response:", response.data);

            //refresh owner and worker tasks
            this.updateLocalTaskList(taskObj);

            //update any open tasks
            this.props.location.updateOpenTasksCallback();
    
            } catch (e) {
            console.error(e);
            }
    }

    handleDeleteTask(taskObj) {

        //clear any prior status msg
        this.showStatusMsg("")

        //delete in db
        this.deleteTaskById(taskObj);
    }

    handleUpdateTask(taskObj) {

        //set selected task locally
        this.setState( {selectedTaskId: taskObj.id} )
        this.setState( {selectedTaskObj: taskObj});

        this.setState({ openModal: true }) //open the modal form
    }

    handleCreateTask() {

        this.setState({ openModal: true }) //open the modal form
    }

    displayTaskSections(ownedTasks, workedTasks) {

        return (

                <Card>
                    <Card.Body>

                        <h5 style={{color: 'green', fontSize: '16px', marginTop: 30, marginBottom: 30}} >Tasks Opened By You</h5>
                    
                        <TasksCardList cardList={ ownedTasks } 
                                            cardListType="details"
                                            handleUpdateTaskCallback = {this.handleUpdateTask}
                                            handleDeleteTaskCallback = {this.handleDeleteTask}
                                            handleCreateTaskCallback = {this.handleCreateTask}
                                            mytasksContainerId='mytasks-container'
                                            position="Worker"  />


                        <h5 style={{color: 'grey', fontSize: '16px', marginTop: 30, marginBottom: 30 }} >Tasks Worked By You</h5>

                        <TasksCardList cardList={ workedTasks } 
                                            cardListType="details"
                                            handleUpdateTaskCallback = {this.handleUpdateTask}
                                            handleCreateTaskCallback = {this.handleCreateTask}
                                            mytasksContainerId='mytasks-container'
                                            position="Owner"  />

                    </Card.Body>
                </Card>
        )

    }

    HandleOpenModal() {
        this.setState({ openModal: true })
    }
    HandleCloseModal() {
        this.setState({ openModal: false })
    }
    displayModalForm() {
        const {openModal} = this.state;
        return (
            <Modal center onClose={this.HandleCloseModal.bind(this)} open={openModal} 
            >
                <h1 id='task-form-header' >&nbsp;&nbsp;</h1>
                <h2 style={{marginTop: '100px', marginBottom: '30px'}}>Please fill in task info</h2>

                <TaskForm getUserCallback = {this.props.location.getUserCallback}
                                updateOpenTasksCallback = {this.props.location.updateOpenTasksCallback}
                                getSelectedTaskIdCallback = {this.getSelectedTaskId}
                                getSelectedTaskObjCallback = {this.getSelectedTaskObj}
                                setSelectedTaskIdCallback = {this.setSelectedTaskId}
                                updateLocalTasksCallback = {this.updateLocalTaskList}
                                showZipRadiusCallback = {this.props.location.showZipRadiusCallback}
                                statusMsgAreaId = {statusMsgAreaId}
                />
            </Modal>
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
                {/* route back to root (App component) depending on state */}
                 <Redirect to='/Home' />    

                </div>)
        }

        return (
            <div id={toContainerId}>

                <h1>&nbsp;&nbsp;</h1>
                <h5 id={statusMsgAreaId} style={{ color: 'red',  marginTop: 50, marginBottom: 50 }} > </h5>

                {this.displayModalForm()}

                {this.displayTaskSections(this.state.taskWorkerListForOwner, this.state.taskOwnerListForWorker)}

            </div>
        )
    }
}