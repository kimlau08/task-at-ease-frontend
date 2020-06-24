import React from 'react';
import '../App.css';

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

const displayTaskTable = (props) => {

    let disableUpdate = props.handleUpdateTaskCallback === undefined;
    let disableDelete = props.handleDeleteTaskCallback === undefined;

    const photoFormatter = (cell, row) => {

        let userImg = (row.photo !== null) ? imgSvrDNS + row.photo : genericImg;
        return (<img style={{width: '30px', borderRadius: '50%' }} src={userImg} />)
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

        const handleDeleteTask = (event) => {

            props.handleDeleteTaskCallback(row);
        }


        if (disableDelete) { //disable button and opague img
            return ( 
                <button class="btn" onClick={handleDeleteTask} disabled>
                   <img style={{opacity: 0.6, width: '30px'}} id={row.id} src={deleteIcon} />
                </button>
                )
        }

        return ( 
            <button class="btn" onClick={handleDeleteTask}>
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

    return (
        <div className="card-list">

            { samples && <div class="card-group w-100" style={{display: 'flex', flexDirection: 'row'}} >
                { tasks.map( task => displaySampleTaskCard(task) ) }
            </div> }

            { !samples && displayTaskTable(props) }

        </div>
    )
}
