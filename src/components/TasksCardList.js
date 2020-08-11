import React from 'react';
import '../App.css';

import TaskTable from './TaskTable';

import 'react-responsive-modal/styles.css';


const displaySampleTaskCard = (task) => {
    return (
        <div key={task.id}>
            <div className="card p_3 ml-3 mb-3" style={{flex: 1, width: "200px", height: "250px" } } >
                <img className="card-img-top" style={{height: "150px" }} src={task.img} alt={task.desc} />
                <div className="card-body">
                    <h6 className="card-title">{task.desc}</h6>
                    <p className="card-text">Ave cost: {task.cost}</p>
                </div>
            </div>
        </div>
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

            { samples && <div className="card-group w-100" style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}} >
                { tasks.map( task => displaySampleTaskCard(task) ) }
            </div> }

            { !samples && <TaskTable {...props} /> }

        </div>
    )
}
