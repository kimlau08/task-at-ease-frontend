import React, { Component } from 'react';
import '../App.css';

import genericProjectImg from '../assets/FutureProject.png';

const notApplicable = "N/A";
const imgSvrDNS = process.env.REACT_APP_HEROKU_EXPRESS_SVR;

export default function WorkerTaskCard(props) {

    if (Object.keys(props).length === 0 && props.constructor === Object) {
        return <div></div>  //props is empty
    }

    let taskObj = JSON.parse( props.taskStr );
    let taskPhotoObj = JSON.parse( props.taskPhotoStr );
    let taskImg = imgSvrDNS + taskPhotoObj.tskphoto;  //located Expressjs server

    let taskObjIsEmpty = ( Object.keys(taskObj).length === 0 && taskObj.constructor === Object )
    
    let skillRequired = "";
    
    if (!taskObjIsEmpty) {   //taskObj is not empty

        skillRequired = skillRequired.concat( (taskObj.skill1 !== notApplicable ? taskObj.skill1 : "") );
        skillRequired = skillRequired.concat( (taskObj.skill2 !== notApplicable ? ", "+taskObj.skill2 : "") );
        skillRequired = skillRequired.concat( (taskObj.skill3 !== notApplicable ? ", "+taskObj.skill3 : "") );
    } 

    return (
        <div className="task-card">
            <div class="card p_3 ml-3 mb-3 bg-secondary text-white" style={{flex: 1, width: "200px", height: "350px", fontSize: "12px" } } >
                {/* For the case of a project found */}
                {(!taskObjIsEmpty) && <img class="card-img-top" style={{height: "150px" }} src={taskImg} alt="a completed project" />}

                { (!taskObjIsEmpty) && <div class="card-body">
                    <h6 class="card-title">Task Type: {taskObj.kind}</h6>
                    <p class="card-text">Description: {taskObj.details}</p>
                    <p class="card-text">Skills: {skillRequired}</p>
                    </div>
                    }      
                { (!taskObjIsEmpty) && <div class="card-footer">
                    <small class="text-warning">Task Status: {taskObj.status}</small>
                </div>}

                
                {/* For the case of a project is not found */}
                {(taskObjIsEmpty) && <img class="card-img-top" style={{height: "150px" }} src={genericProjectImg} alt="generic future project" />}

                { (taskObjIsEmpty) && <div class="card-body">
                    <h6 class="card-title">Task Type: To be provided</h6>
                    <p class="card-text">Description: To be provided in a future date</p>
                    <p class="card-text">Skills: To be provided</p>
                    </div>
                    }      

            </div>
        </div>
    )
}
