import React, { Component } from 'react';
import axios from 'axios';

import { Form, FormControl, InputGroup, Button } from 'react-bootstrap';
import { Col, Row } from "react-bootstrap";
import Container from 'react-bootstrap/Container'; 

import UserCard from '../UserCard';

const defaultTaskId = -1; 
const defaultWorkerId = 0;
const selectedWorkerNameAreaId = "selected-worker-name";
const distanceInfoAreaId = "radius-distance-msg";
const dbDNS = process.env.REACT_APP_HEROKU_POSTGRES_DB;

const taskTypeOptionList = ( itemList ) => {

    return (
        itemList.map( item => <option  key={item.id}  value={item.skill} >
                                {`${item.skill}`}
                            </option> )
    )
}
const taskStatusOptionList = () => {
    const statusList = [ "open", "accepted", "closed" ];

    return (
        statusList.map( s => <option  key={s}  value={s} >
                                    {`${s}`}
                             </option> )
    )
}

export default class TaskForm extends Component  {
    constructor(props) {
        super(props);

        this.state = {

            allSkills: [],  //list of all skills from db-for building skill list
            user: {},       //user after login
            skillListByWorker: [],  //array of worker id and skill list

            availableUsers: [], //list of free users from db
            matchedWorkers: [],
            selectedWorkerId: defaultWorkerId, 
            selectedTaskId: defaultTaskId,
            
            //filters - start with default
            skill1: "N/A",
            skill2: "N/A",
            skill3: "N/A",
        }

        this.getSkills = this.getSkills.bind(this);
        this.getWorkerSkills = this.getWorkerSkills.bind(this);

        this.checkUserLogin = this.checkUserLogin.bind(this);
        this.addNewTask = this.addNewTask.bind(this);
        this.updateTaskById = this.updateTaskById.bind(this);
        this.showBoardMsg = this.showBoardMsg.bind(this);
        this.clearSelectedTask = this.clearSelectedTask.bind(this);
        this.clearForm = this.clearForm.bind(this);
        this.findSkillsByWorker = this.findSkillsByWorker.bind(this);

        //handler for filter changes
        this.handleCardClick = this.handleCardClick.bind(this);
        this.handleSkill1Change = this.handleSkill1Change.bind(this);
        this.handleSkill2Change = this.handleSkill2Change.bind(this);
        this.handleSkill3Change = this.handleSkill3Change.bind(this);

        //apply filter
        this.skillsMatched = this.skillsMatched.bind(this);

    }

    checkUserLogin(checkResultAreaId) {

        let user = this.state.user;

        if (Object.keys(user).length === 0 && user.constructor === Object) {
            //user is not set. tell user to login first
            document.getElementById(checkResultAreaId).innerHTML = "Please login first." ;

            return false;
        }

        return true;
    }

    showBoardMsg(msg) {
        document.getElementById(this.props.statusMsgAreaId).innerHTML = msg;
    }

    clearSelectedTask() {
        //de-select task item by resetting to default
        this.props.setSelectedTaskIdCallback(defaultTaskId);
        this.setState( {selectedTaskId: defaultTaskId} )

        //clear any task item update message in form area.
        this.showBoardMsg("");
    }

    findAvailableWorkers(userList, userObj) {

        this.setState(  {availableUsers: 
                    userList.filter(u => (u.free === "Y"  && u.id !== userObj.id) ) } )

        return userList.filter(u => (u.free === "Y"  && u.id !== userObj.id) ) ;
    }
    
    clearForm() {

        //re-initialize matched workers with no workers
        this.setState( {matchedWorkers: [] } );
        
        //clear any task item update message in form area.
        this.showBoardMsg("");

        //clear selected worker name display
        document.getElementById(selectedWorkerNameAreaId).innerHTML = "";

        //clear form fields by setting to default

        document.getElementById("field01").value = "N/A";           //Task Type
        document.getElementById("field02").value = 0;               //Hours
        document.getElementById("field03").value = "";              //Details
        document.getElementById("field04").value = "N/A";           //Skill1
        document.getElementById("field05").value = "N/A";           //Skill2
        document.getElementById("field06").value = "N/A";           //Skill3
        document.getElementById("field07").value = "open";          //Status
        document.getElementById("field08").value = 0;               //Worker Selected

    }

    handleCardClick = (event) => {

        let userObj = JSON.parse(event.target.name);

        //display user's name
        document.getElementById(selectedWorkerNameAreaId).innerHTML = `name: ${userObj.name}`;
        
        //display worker's distance from user's current location determined by IP and geocodes
        this.props.showZipRadiusCallback(userObj.zip, distanceInfoAreaId)

        //set worker info in card
        document.getElementById("field08").value = parseInt(event.target.id);
        this.setState(  {selectedWorkerId : parseInt(event.target.id)} );
    }
    handleSkill1Change = (event) => {
        this.setState ( { skill1: event.target.value });
    }
     
    handleSkill2Change = (event) => {
        this.setState ( { skill2: event.target.value });
    }

    handleSkill3Change = (event) => {
        this.setState ( { skill3: event.target.value });
    }

    skillsMatched(userSkillList) {
        
        //return true of any one of criteria matches.  "N/A" is wildcard and is ignored
        let matched = false;

        matched = (this.state.skill1 !== "N/A" && 
                        userSkillList.includes(this.state.skill1)) ? true: matched ;
        matched = (this.state.skill2 !== "N/A" && 
                        userSkillList.includes(this.state.skill2)) ? true: matched ;
        matched = (this.state.skill3 !== "N/A" && 
                        userSkillList.includes(this.state.skill3)) ? true: matched ;

        //special case: all skills are kept as "N/A", set to true
        matched = ( this.state.skill1 === "N/A" && 
                    this.state.skill2 === "N/A" &&
                    this.state.skill3 === "N/A" ) ? true: matched ;

        return matched;
    }

    handleClickSubmit = (event) => {
        
        let tForm = document.getElementById("task-form");

        if (! this.checkUserLogin(this.props.statusMsgAreaId) ) {
            return  //user is not logged in
        }

        //collect form field value in newTaskObj
        let newTaskObj={};
        for (let i=0; i< tForm.elements.length; i++) {
            let elem=tForm.elements[i];
            //distance is an extra value for filtering
            if (elem.name === "distance" || (elem.type !== "select-one" && elem.type !== "textarea" && 
                elem.type !== "text" && elem.type !== "number" ) ) {   
                continue;
            }

            let keyValue= elem.type === "number" ? { [elem.name]: parseInt(elem.value) } : 
                                                        { [elem.name]: elem.value } ;
            //merge key:value pair to wineObj
            Object.assign(newTaskObj, keyValue);
        }


        let selectedTaskId = this.props.getSelectedTaskIdCallback();
        this.state.selectedTaskId = selectedTaskId;

        if (selectedTaskId === defaultTaskId) {

            //no task has been selected. Proceed to add new task

            //add owner info to task. owner is the logged in user
            let taskPeople ={ owner:  parseInt(this.state.user.id),
                                ownername:  this.state.user.name,
                                owneremail: this.state.user.email };  //worker id comes from the form 

            Object.assign(newTaskObj, taskPeople); 

            //add new task
            this.addNewTask(newTaskObj);
            return;
        }
        
        let selectedTaskObj = this.props.getSelectedTaskObjCallback();

        //add owner info to task. owner for existing task does not change
        let taskPeople ={ owner:  selectedTaskObj.owner,  
                            ownername:  selectedTaskObj.ownername,
                            owneremail: selectedTaskObj.owneremail }; //worker may change. id comes from the form

        Object.assign(newTaskObj, taskPeople); 

        //a task list item has been selected. Proceed to update

        //update task in backend database
        this.updateTaskById(newTaskObj);

    }

    async getFreeUsers() {
    
        try {
          const response=await axios.get(`${dbDNS}/tae_api/v1/useravailable/Y`);
          console.log(`getFreeUsers response:`, response.data);

          this.setState( {availableUsers : response.data} );

          this.findAvailableWorkers(response.data, this.state.user);

        } catch (e) {
          console.error(e);
        }
    }
    
    async updateTaskById (newTaskObj) {

        if (this.state.selectedTaskId === defaultTaskId) {
            console.log('ERROR::No selected task to update');
            return;
        }
        
        try {
            const response=await axios.put(`${dbDNS}/tae_api/v1/task/${this.state.selectedTaskId}`,   newTaskObj);
            console.log("updateTaskById:", response.data);

            //Successful update. update local task list item to indicate ack  
            let taskObj = response.data;

            this.props.updateLocalTasksCallback(taskObj);
            this.props.updateOpenTasksCallback();

            //clear task form 
            this.clearForm();

            //de-select task item
            this.clearSelectedTask();

            this.showBoardMsg("Task updated");

            } catch (e) {
            console.error(e);
            }
    }
    
    async addNewTask(newTaskObj) {
        
        try {
            const response=await axios.post(`${dbDNS}/tae_api/v1/task`,   newTaskObj);
            console.log("addNewTask response:", response.data);
            //Successful create. The response has the new record with new id. 
            //Add it to local list            
            let taskObj = response.data;

            this.props.updateLocalTasksCallback(taskObj);
            this.props.updateOpenTasksCallback(taskObj);

            //clear task form 
            this.clearForm();

            //de-select task item
            this.clearSelectedTask();

            this.showBoardMsg("New task added")
    
            } catch (e) {
            console.error(e);
            }
    }


    async getSkills() {
    
        try {
          const response=await axios.get(`${dbDNS}/tae_api/v1/skill`);
          console.log(`getSkills response:`, response.data);

          this.setState( {allSkills : response.data} );

        } catch (e) {
          console.error(e);
        }
    }

    async getWorkerSkills() {
    
        try {
          const response=await axios.get(`${dbDNS}/tae_api/v1/workerskill`);
          console.log(`getWorkerSkills response:`, response.data);

          this.setState( {workerSkills : response.data} );

          this.findSkillsByWorker(response.data);

        } catch (e) {
          console.error(e);
        }
    }
    
    findSkillsByWorker(workerSkills) { 

        //initialize with user id and skills. to be filled with skillList found for each worker

        let skillListByWorker = this.state.availableUsers.map( u => 
            ( { worker: u.id, 
                skillList : []} )  );


        //create list of skills by each worker
        for (let i=0; i<workerSkills.length; i++) {  //list of known skills for workers
            let idx = skillListByWorker.findIndex( s => s.worker === workerSkills[i].worker ) //list of workers. each to be associated with their skill lists
            if (idx >= 0) {
                skillListByWorker[idx].skillList.push( workerSkills[i].skill )  //build the skill list
            }
        }

        this.setState( {skillListByWorker : skillListByWorker} );
    }

    componentDidMount() {

        if (Object.keys(this.props).length === 0 && this.props.constructor === Object) {
            return  //props is empty
        }
        
        if (this.props.getUserCallback === undefined) {
            return  //no callback to get user info
        }

        this.getFreeUsers();

//query all skills to build option list
this.getSkills();

//query all user skills
this.getWorkerSkills();
    }

    displayUserCard( userObj ) {


        return (
            <UserCard key={userObj.id} user={userObj} role="worker" compact="true" clickCallback={this.handleCardClick} ></UserCard>
        )
    }

    displayMatchedWorkers () {
        return (
            <div>
                <h3 style={{marginTop: 80 }}>Available Workers</h3>
                <div class="card-group w-100" style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}} >

                    { this.state.matchedWorkers.map( u => this.displayUserCard(u) ) }
                </div> 
            </div>
        )
    }

    render() {

        if (Object.keys(this.props).length === 0 && this.props.constructor === Object) {
            return <div></div>  //props is empty
        }

        this.state.selectedTaskId = this.props.getSelectedTaskIdCallback();

        let userObj = this.props.getUserCallback()
        this.state.user = userObj;

        //initialize matches to available workers
        this.state.matchedWorkers = this.state.availableUsers;
        
        let toContainerId = "mytasks-container";
    
        return (
            <div className={toContainerId}>

                <Container style={{width: 650}}>

                    <Form  id="task-form">
                        <Form.Row>
                            <Form.Group as={Col} sm="6" controlId="field01">
                                <Form.Label>Task Type</Form.Label>
                                <InputGroup>
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control
                                        name="kind"
                                        required
                                        type="text"
                                        as="select"
                                        defaultValue="N/A" 
                                    >    

                                        {taskTypeOptionList( this.state.allSkills )}

                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        Please select a task type.
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>

                            <Form.Group as={Col} sm="6" controlId="field02">
                                <Form.Label>Hours</Form.Label>
                                <InputGroup>
                                    <InputGroup.Prepend>
                                    <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control
                                        name="hours"
                                        type="number"
                                        placeholder="total hours"
                                        aria-describedby="inputGroupPrepend"
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please specify total hours expected.
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group as={Col} sm="12" controlId="field03">
                                <Form.Label>Details</Form.Label>
                                <Form.Control
                                    name="details"
                                    type="textarea"
                                    placeholder="Please describe task"
                                />
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group as={Col} sm="3" controlId="field04">
                                <Form.Label>Skill1</Form.Label>
                                <InputGroup>
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control
                                        name="skill1"
                                        required
                                        type="text"
                                        as="select"
                                        defaultValue="N/A" 
                                        onChange={this.handleSkill1Change} 
                                    >    

                                        {taskTypeOptionList( this.state.allSkills )}

                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        Please select a skill.
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>

                            <Form.Group as={Col} sm="3" controlId="field05">
                                <Form.Label>Skill2</Form.Label>
                                    <Form.Control
                                        name="skill2"
                                        type="text"
                                        as="select"
                                        defaultValue="N/A" 
                                        onChange={this.handleSkill2Change} 
                                    >    

                                        {taskTypeOptionList( this.state.allSkills )}

                                    </Form.Control>
                            </Form.Group>

                            <Form.Group as={Col} sm="3" controlId="field06">
                                <Form.Label>Skill3</Form.Label>
                                    <Form.Control
                                        name="skill3"
                                        type="text"
                                        as="select"
                                        defaultValue="N/A" 
                                        onChange={this.handleSkill3Change} 
                                    >    

                                        {taskTypeOptionList( this.state.allSkills )}

                                    </Form.Control>
                            </Form.Group>

                            
                            <Form.Group as={Col} sm="3" controlId="field07">
                                <Form.Label>Status</Form.Label>
                                    <Form.Control
                                        name="status"
                                        type="text"
                                        as="select"
                                        defaultValue="open" 
                                    >    

                                        {taskStatusOptionList()}

                                    </Form.Control>
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group as={Col} sm="3" controlId="field08">
                                <Form.Label>Worker Selected</Form.Label>
                                    <Form.Control
                                        name="worker"
                                        type="number"
                                        defaultValue="0"                                     
                                        placeholder="click image to select"
                                    >    
                                    </Form.Control>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <p id={selectedWorkerNameAreaId} style={{height: 20}}></p>
                        </Form.Row>
                        <Form.Row>
                            <p id={distanceInfoAreaId} style={{height: 20}}></p>
                        </Form.Row>
                        <Button type="button" onClick={this.handleClickSubmit}>Submit form</Button>
                    </Form>
                </Container>

                
                <div>
                        {this.displayMatchedWorkers()}
                </div>
            </div>
        )
    }
}
