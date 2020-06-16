import React, { Component } from 'react';
import '../App.css';

const notApplicable = "N/A";
const imgSvrDNS = process.env.REACT_APP_HEROKU_EXPRESS_SVR;

export default class WorkerTaskCard extends Component {
    constructor(props) {
        super(props);

        this.state = {

            task: {}
        }
    }

    render() {

        if (Object.keys(this.props).length === 0 && this.props.constructor === Object) {
            return <div></div>  //props is empty
        }
    
        let taskObj = JSON.parse( this.props.taskStr );
        let taskPhotoObj = JSON.parse( this.props.taskPhotoStr );
        let taskImg = imgSvrDNS + taskPhotoObj.photo;  //located Expressjs server

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
                    {(!taskObjIsEmpty) && <img class="card-img-top" style={{height: "150px" }} src={taskImg} alt="a user" />}

                    { (!taskObjIsEmpty) && <div class="card-body">
                        <h6 class="card-title">Task Type: {taskObj.kind}</h6>
                        <p class="card-text">Description: {taskObj.details}</p>
                        <p class="card-text">Skills: {skillRequired}</p>
                     </div>
                      }      
                    { (!taskObjIsEmpty) && <div class="card-footer">
                        <small class="text-warning">Task Status: {taskObj.status}</small>
                    </div>}

                </div>
            </div>
        )

    }
}
