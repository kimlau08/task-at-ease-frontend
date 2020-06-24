import React from 'react';
import '../App.css';
import { Col, Row, Table } from "react-bootstrap"
import { Container } from 'react-bootstrap';

import genericImg from '../assets/generic_person.png';
import updateIcon from '../assets/update_icon.png';
import deleteIcon from '../assets/delete_icon.png';

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter'; 


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

const testRBSTable = (props) => {
    
    if (Object.keys(props).length === 0 && props.constructor === Object) {
        return <div></div>  //props is empty
    }
    if (props.cardList.length === 0) {
        return <div></div>  //empty array
    }

    let tasks = props.cardList;
    let samples = (props.cardListType === "samples");


    const products = [ {id:0, name:'item name 0', price:2100},
                        {id:3, name:'item name 3', price:2103},
                       {id:2, name:'item name 2', price:2102},
                       {id:4, name:'item name 4', price:2104},
                       {id:1, name:'item name 1', price:2101} ];
    const columns = [{
        dataField: 'id',
        text: 'Product ID',
        sort: true
        }, {
        dataField: 'name',
        text: 'Product Name',
        sort: true,
        filter: textFilter()
        }, {
        dataField: 'price',
        text: 'Product Price',
        filter: textFilter()
    }];

    return (
        <BootstrapTable keyField='id' data={ products } columns={ columns } filter={ filterFactory() } />            
    )
}


const displayTaskTable = (props) => {

    let disableUpdate = props.handleUpdateTaskCallback === undefined;
    let disableDelete = props.handleDeleteTaskCallback === undefined;

    const photoFormatter = (cell, row) => {

        let userImg = (row.photo !== null) ? imgSvrDNS + row.photo : genericImg;
        return (<img style={{width: '30px'}} src={userImg} />)
    }

    const nameFormatter = (cell, row) => {

        let userName = (row.name !== null) ? row.name : "TBD";
        return userName;
    }

    const skillFormatter = (cell, row) => {
        let skillRequired = "";
        
        skillRequired = skillRequired.concat( (row.skill1 !== notApplicable ? row.skill1 : "") );
        skillRequired = skillRequired.concat( (row.skill2 !== notApplicable ? ", "+row.skill2 : "") );
        skillRequired = skillRequired.concat( (row.skill3 !== notApplicable ? ", "+row.skill3 : "") );

        return ( <p>{skillRequired}</p>)
    }

    const updateFormatter = (cell, row) => {

        const handleUpdateTask = (event) => {

            props.handleUpdateTaskCallback(row);
        }

        if (disableUpdate) {  //disable button and opague img
            return ( <button class="btn" onClick={handleUpdateTask} disabled>
                    <img style={{opacity: 0.6, width: '30px'}} id={row.id} src={updateIcon} />
                    </button>
                )
        } 

        return (  <button class="btn" onClick={handleUpdateTask} >
                <img style={{width: '30px'}} id={row.id} src={updateIcon} />
                  </button> 
            )

    }
    const deleteFormatter = (cell, row) => {

        if (disableDelete) { //disable button and opague img
            return ( 
                <button class="btn" onClick={props.handleDeleteTaskCallback} disabled>
                   <img style={{opacity: 0.6, width: '30px'}} id={row.id} src={deleteIcon} />
                </button>
                )
        }

        return ( 
            <button class="btn" onClick={props.handleDeleteTaskCallback}>
               <img style={{width: '30px'}} id={row.id} src={deleteIcon}/>
            </button>
            )
    }
    

    let tasks = props.cardList;
    let position = props.position;

    const columns = [{
            dataField: 'photo',
            text: position,
            formatter: photoFormatter   //render image
        }, {
            dataField: 'name',
            text: 'Name',
            sort: true,
            filter: textFilter(),
            formatter: nameFormatter
        }, {
            dataField: 'details',
            text: 'Desc',
            filter: textFilter()
        }, {
            dataField: 'skill1',
            text: 'Skills',
            sort: true,
            filter: textFilter(),
            formatter: skillFormatter  //consolidate skill fields
        }, {
            dataField: 'kind',
            text: 'Type',
            sort: true,
            filter: textFilter()
        }, {
            dataField: 'status',
            text: 'Status',
            sort: true,
            filter: textFilter()
        }, {
            dataField: 'hours',
            text: 'Hours',
            sort: true,
            filter: textFilter()
        }, {
            dataField: 'skill2',
            text: 'Update',
            formatter: updateFormatter //display the clickable icon
        }, {
            dataField: 'skill3',
            text: 'Delete',
            formatter: deleteFormatter //display the clickable icon
     }];

    return (
        <BootstrapTable keyField='id' data={ tasks } columns={ columns } 
            filter={ filterFactory() }  filterPosition="top" //filters in a different row
        />            
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

    let simplifiedVers = (props.partnerList === undefined);

    return (
        <div className="card-list">

            { samples && <div class="card-group w-100" style={{display: 'flex', flexDirection: 'row'}} >
                { tasks.map( task => displaySampleTaskCard(task) ) }
            </div> }
      
{/* {testRBSTable(props)} */}

            { !samples && simplifiedVers && displayTaskTable(props) }

            { !samples &&  !simplifiedVers && <div class="container">

                    {tasks.map( task => displayDetailedTask(task, props) ) }

                </div>
            }

        </div>
    )
}
