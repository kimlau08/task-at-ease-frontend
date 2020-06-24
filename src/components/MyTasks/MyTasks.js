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

export default class MyTasks extends Component {
    constructor(props) {
        super(props);

        this.state = {

            selectedTaskId: defaultTaskId,
            selectedTaskObj: {},
            user: {},        //user logged in

            taskOwnerListForWorker: [], //result of inner join from task to worker for a owner
            taskWorkerListForOwner: [], //result of left join from task to owner for a worker. A task may not have been assigned a worker yet.

            panelActiveKey: 2 //default to open the "task you opened" Accordion panel
        }


        this.showStatusMsg = this.showStatusMsg.bind(this);

        this.updateLocalTaskList = this.updateLocalTaskList.bind(this);
        
        this.handleUpdateTask = this.handleUpdateTask.bind(this);
        this.handleDeleteTask = this.handleDeleteTask.bind(this);
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

        this.state.user = userObj;

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

        this.showStatusMsg("Open the following task to add update")

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

    displayTaskSections(ownedTasks, workedTasks) {

        return (
            <Accordion defaultActiveKey="1" >
                <Card>
                    <Accordion.Toggle style={{height: 50, backgroundColor: 'grey', color: 'white', marginBottom: 50}} as={Card.Header} eventKey="0">
                        Open a Task
                    </Accordion.Toggle>

                    <Accordion.Collapse eventKey="0">
                    <Card.Body>
                        {/* Form to create a task */}
                        <TaskForm getUserCallback = {this.props.location.getUserCallback}
                                  updateOpenTasksCallback = {this.props.location.updateOpenTasksCallback}
                                  getSelectedTaskIdCallback = {this.getSelectedTaskId}
                                  getSelectedTaskObjCallback = {this.getSelectedTaskObj}
                                  setSelectedTaskIdCallback = {this.setSelectedTaskId}
                                  updateLocalTasksCallback = {this.updateLocalTaskList}
                                  showZipRadiusCallback = {this.props.location.showZipRadiusCallback}
                                  statusMsgAreaId = {statusMsgAreaId}
                                      />

                    </Card.Body>
                    </Accordion.Collapse>
                </Card>

                <Card>
                    <Accordion.Toggle style={{color: 'blue', marginBottom: 50 }} as={Card.Header} eventKey="1">
                        View your tasks
                    </Accordion.Toggle>

                    <Accordion.Collapse eventKey="1">
                    <Card.Body>

                        <h5 style={{color: 'green', fontSize: '16px', marginTop: 30, marginBottom: 30}} >Tasks Opened By You</h5>
                    
                        <TasksCardList cardList={ ownedTasks } 
                                            cardListType="details"
                                            handleUpdateTaskCallback = {this.handleUpdateTask}
                                            handleDeleteTaskCallback = {this.handleDeleteTask}
                                            position="Worker"  />


                        <h5 style={{color: 'grey', fontSize: '16px', marginTop: 30, marginBottom: 30 }} >Tasks Worked By You</h5>

                        <TasksCardList cardList={ workedTasks } 
                                            cardListType="details"
                                            handleUpdateTaskCallback = {this.handleUpdateTask}
                                            position="Owner"  />

                    </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
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

        return (
            <div id={toContainerId}>

                <h5 id={statusMsgAreaId} style={{ color: 'red',  marginTop: 50, marginBottom: 50 }} ></h5>

                {this.displayTaskSections(this.state.taskWorkerListForOwner, this.state.taskOwnerListForWorker)}

            </div>
        )
    }
}
