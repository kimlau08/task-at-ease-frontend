import React from 'react';
import '../App.css';
import { Col, Row } from "react-bootstrap"
import { Container } from 'react-bootstrap';

import genericImg from '../assets/generic_person.png';
import updateIcon from '../assets/update_icon.png';
import deleteIcon from '../assets/delete_icon.png';

const notApplicable = "N/A";
const imgSvrDNS = process.env.REACT_APP_HEROKU_EXPRESS_SVR;
const displaySampleTaskCard = (task) => {
    return (
        <div key={task.id}>
            <div class="card p_3 ml-3 mb-3" style={{flex: 1, width: "200px", height: "250px" } } >
                <img class="card-img-top" style={{height: "150px" }} src={task.img} alt={task.desc} />
                <div class="card-body">
                    <h6 class="card-title">{task.desc}</h6>
                    <p class="card-text">Ave cost: {task.cost}</p>
                </div>
            </div>
        </div>
    )
}

const displayDetailedTask = (task, props) => {


    const handleUpdateTask = (event) => {

        props.handleUpdateTaskCallback(task);
    }

    let skillRequired = "";
    
    skillRequired = skillRequired.concat( (task.skill1 !== notApplicable ? task.skill1 : "") );
    skillRequired = skillRequired.concat( (task.skill2 !== notApplicable ? ", "+task.skill2 : "") );
    skillRequired = skillRequired.concat( (task.skill3 !== notApplicable ? ", "+task.skill3 : "") );

    //lookup partner info. A partner can be a worker or a task owner
    let userObj = {};
    let idx = -1;
    switch (props.position) {
        case "Owner": //look for owner info from partnerList

            idx = props.partnerList.findIndex( p => p.id === task.owner )
            if (idx >= 0) {
                userObj = props.partnerList[idx];
            }

            break;
        case "Worker": //look for worker info from partnerList

            idx = props.partnerList.findIndex( p => p.id === task.worker )
            if (idx >= 0) {
                userObj = props.partnerList[idx];
            }

            break;
        default:
            console.log(`Unknown position: ${props.position}`)
    }

    let userImg = (idx >= 0) ? imgSvrDNS + userObj.photo : genericImg;
    let userName = (idx >= 0) ? userObj.name : "TBD";

    let disableUpdate = props.handleUpdateTaskCallback === undefined;
    let disableDelete = props.handleDeleteTaskCallback === undefined;

    return (
        <Container>
            <Row style={{height: 40, display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>

                {/* Disable update button if no handler */}

                {disableUpdate && <img className="buttomImg" id={task.id} src={updateIcon} 
                            style={{opacity: 0.3, width: 20, height: 20, marginRight: 10}}
                            onClick={handleUpdateTask} disabled/>}
                {!disableUpdate && <img className="buttomImg" id={task.id} src={updateIcon} 
                            style={{width: 20, height: 20, marginRight: 10}}
                            onClick={handleUpdateTask}/>}

                {/* Disable delete button if no handler */}

                {disableDelete && <img className="buttomImg" id={task.id} src={deleteIcon}    
                            style={{opacity: 0.3, width: 20, height: 20, marginRight: 10}}
                            onClick={props.handleDeleteTaskCallback} disabled/>}
                {!disableDelete && <img className="buttomImg" id={task.id} src={deleteIcon}  
                            style={{width: 20, height: 20, marginRight: 10}}
                            onClick={props.handleDeleteTaskCallback} />}

            </Row>
            <Row key={task.id}>
                <Col><h6 >{task.details}</h6></Col>
            </Row>
            <Row>
                <Col>
                    <img src={userImg} style={{width: 80, height: 80, borderRadius: '50%' }} />
                    <p>{props.position} name: {userName} </p>
                </Col>
                <Col>
                    <p >Skills: {skillRequired}</p>
                    <p >Type: {task.kind}</p>
                </Col>
                <Col>
                    <p >Status: {task.status}</p>
                    <p >Hours: {task.hours}</p>
                </Col>
            </Row>
        </Container>
    )
}

export default function TasksCardList(props) {
    
    if (Object.keys(props).length === 0 && props.constructor === Object) {
        return <div></div>  //props is empty
    }
    if (props.cardList.length === 0) {
        return <div></div>  //empty array
    }

    let tasks = props.cardList;
    let samples = (props.cardListType === "samples");

    return (
        <div className="card-list">

            { samples && <div class="card-group w-100" style={{display: 'flex', flexDirection: 'row'}} >
                { tasks.map( task => displaySampleTaskCard(task) ) }
            </div> }
      
            { !samples && tasks.map( task => displayDetailedTask(task, props) ) }


        </div>
    )
}
