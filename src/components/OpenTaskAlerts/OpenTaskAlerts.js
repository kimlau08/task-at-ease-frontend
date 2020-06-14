import React, { Component } from 'react';
import axios from 'axios';

const dbDNS = process.env.REACT_APP_HEROKU_POSTGRES_DB;

const notApplicable = "N/A"
const displayOpenTaskCard = (task) => {

    let skillRequired = "";
    skillRequired = skillRequired.concat( (task.skill1 !== notApplicable ? task.skill1 : "") );
    skillRequired = skillRequired.concat( (task.skill2 !== notApplicable ? ", "+task.skill2 : "") );
    skillRequired = skillRequired.concat( (task.skill3 !== notApplicable ? ", "+task.skill3 : "") );

    return (
        <div key={task.id}>
            <div class="card ml-3 mt-3 border border-warning" style={{flex: 1, width: "180px", height: "350px" }} >
                <div class="card-body">
                    <h6 class="card-title">{task.details}</h6>
                    <p class="card-text">Owner: {task.ownername}</p>
                    <p class="card-text">Hours: {task.hours}</p>
                    <p class="card-text">Skills: {skillRequired}</p>
                </div>
                <div class="card-footer">
                    <small class="text-muted">Contact info: {task.owneremail}</small>
                </div>
            </div>
        </div>
    )
}


export default class OpenTaskAlerts extends Component {
    constructor(props) {
        super(props);

        this.state= {

            openTasks: []
        }

        this.getTaskByStatus = this.getTaskByStatus.bind(this);
    }

    async getTaskByStatus(status) {
    
        try {
          const response=await axios.get(`${dbDNS}/tae_api/v1/taskbystatus/${status}`);
          console.log("getTaskByStatus response:", response.data);

          this.setState( {openTasks : response.data} );
        
        } catch (e) {
          console.error(e);
        }
    }

    componentDidMount() {
        this.getTaskByStatus("open")
    }
    
    render () {

        let toContainerId="open-tasks-container";

        return (  
            <div id={toContainerId}>

                <p class="text-warning mb-0" style={{ fontWeight: 'bold' }}>Open task Alerts</p>

                { (this.state.openTasks.length > 0) && <div class="card-group w-100" style={{display: 'flex', flexDirection: 'row'}} >
                    { this.state.openTasks.map( task => displayOpenTaskCard(task) ) }
                </div>}
            </div>
        )
    }
}
