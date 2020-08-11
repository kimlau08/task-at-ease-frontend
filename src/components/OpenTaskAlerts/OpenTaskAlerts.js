import React from 'react';

const notApplicable = "N/A"
const displayOpenTaskCard = (task) => {

    let skillRequired = "";
    skillRequired = skillRequired.concat( (task.skill1 !== notApplicable ? task.skill1 : "") );
    skillRequired = skillRequired.concat( (task.skill2 !== notApplicable ? ", "+task.skill2 : "") );
    skillRequired = skillRequired.concat( (task.skill3 !== notApplicable ? ", "+task.skill3 : "") );

    return (
        <div key={task.id}>
            <div className="card ml-3 mt-3 border border-warning" style={{width: "180px", height: "350px"}} >
                <div className="card-body">
                    <h6 className="card-title">{task.details}</h6>
                    <p className="card-text">Owner: {task.ownername}</p>
                    <p className="card-text">Hours: {task.hours}</p>
                    <p className="card-text">Skills: {skillRequired}</p>
                </div>
                <div className="card-footer">
                    <small className="text-muted">Contact info: {task.owneremail}</small>
                </div>
            </div>
        </div>
    )
}

export default function OpenTaskAlerts(props) {     
    
    if (Object.keys(props).length === 0 && props.constructor === Object) {
        return <div></div>  //props is empty
    }
    if (props.openTasks.length === 0) {
        return <div></div>  //empty array
    }   

    let openTasks = props.openTasks;

    let toContainerId="open-tasks-container";

    return (  
        <div id={toContainerId}>

            <p className="text-warning mb-0" style={{ fontWeight: 'bold' }}>Open task Alerts</p>

            { (openTasks.length > 0) && <div className="card-group w-100" style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }} >
                { openTasks.map( task => displayOpenTaskCard(task) ) }
            </div>}
        </div>
    )
}
