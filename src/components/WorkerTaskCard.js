import React, { Component } from 'react';
import '../App.css';

import genericProjectImg from '../assets/FutureProject.png';

const notApplicable = "N/A";
const imgSvrDNS = process.env.REACT_APP_HEROKU_EXPRESS_SVR;

export default function WorkerTaskCard1(props) {

    if (Object.keys(props).length === 0 && props.constructor === Object) {
        return <div></div>  //props is empty
    }

    let taskDetailObj = JSON.parse(props.taskDetailStr);
    let taskImg = imgSvrDNS + taskDetailObj.tskphoto;  //located Expressjs server

    let taskObjIsEmpty = ( Object.keys(taskDetailObj).length === 0 && taskDetailObj.constructor === Object )
    
    let subtasks = "";
    
    if (!taskObjIsEmpty) {   //taskObj is not empty

        subtasks = subtasks.concat( (taskDetailObj.skill1 !== notApplicable ? taskDetailObj.skill1 : "") );
        subtasks = subtasks.concat( (taskDetailObj.skill2 !== notApplicable ? ", "+taskDetailObj.skill2 : "") );
        subtasks = subtasks.concat( (taskDetailObj.skill3 !== notApplicable ? ", "+taskDetailObj.skill3 : "") );
    } 

    return (
        <div className="task-card">
            <div className="card p_3 ml-3 mb-3 bg-secondary text-white" style={{flex: 1, width: "200px", height: "350px", fontSize: "12px" } } >
                {/* For the case of a project found */}
                {(!taskObjIsEmpty) && <img className="card-img-top" style={{height: "150px" }} src={taskImg} alt="a completed project" />}

                { (!taskObjIsEmpty) && <div className="card-body">
                    <h6 className="card-title">Task Type: {taskDetailObj.kind}</h6>
                    <p className="card-text">Description: {taskDetailObj.details}</p>
                    <p className="card-text">Subtasks: {subtasks}</p>
                    </div>
                    }      
                { (!taskObjIsEmpty) && <div className="card-footer">
                    <small className="text-warning">Task Status: {taskDetailObj.status}</small>
                </div>}

                
                {/* For the case of a project is not found */}
                {(taskObjIsEmpty) && <img className="card-img-top" style={{height: "150px" }} src={genericProjectImg} alt="generic future project" />}

                { (taskObjIsEmpty) && <div className="card-body">
                    <h6 className="card-title">Task Type: To be provided</h6>
                    <p className="card-text">Description: To be provided in a future date</p>
                    </div>
                    }      

            </div>
        </div>
    )
}
