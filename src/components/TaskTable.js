import React, {useState} from 'react';
import '../App.css';

import genericImg from '../assets/generic_person.png';
import updateIcon from '../assets/update_icon.png';
import deleteIcon from '../assets/delete_icon.png';
import createIcon from '../assets/createIcon.png';

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter'; 
import ScrollIntoView from 'react-scroll-into-view'
import {Modal} from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';


const notApplicable = "N/A";
const imgSvrDNS = process.env.REACT_APP_HEROKU_EXPRESS_SVR;
export default function TaskTable(props) {
    
    const [openModal, setOpenModel]  = useState(false); //to open/close modal dialogue box with confirm/message
    const [action, setAction]  = useState('none');      //action to be confirmed in the dialogue box
    const [row, setRow] = useState(null);

        const showModalDiag = (action, row) => {
            setAction(action);
            setRow(row);
            setOpenModel(true);
        }
        const handleConfirm = (event) => {
            setOpenModel(false);

            let action=event.target.name;
            switch (action) {
                case 'delete':         
                    props.handleDeleteTaskCallback(row);
                    break;

                case 'update':
                    props.handleUpdateTaskCallback(row);
                    break;

                case 'create':
                    props.handleCreateTaskCallback();
                    break;

                default: break;
            }
        }
        const handleCloseModalMsg = (action) => {
            setAction(action);
            setOpenModel(false);
        }
        const renderModalBox = () => {

            let deleting = (action === 'delete');
            let updating = (action === 'update');
            let creating = (action === 'create');
            
            return (
                <Modal center onClose={handleCloseModalMsg} showCloseIcon={false} open={openModal} >
                    
                    { deleting && <h3>Deleting task</h3>}

                    { updating && <h3>Updating task</h3>}

                    { creating && <h3>Creating task</h3>}

                    <h3>&nbsp;&nbsp;</h3>
                    <div style = {{width: '300px', display: 'flex', flexDirection: 'row', 
                                justifyContent: 'space-evenly' }}>
                        { <button style={{borderRadius: '5px'}} name={action} onClick={handleConfirm}>Confirm</button>}
                        <button style={{borderRadius: '5px'}} onClick={handleCloseModalMsg}>Cancel</button>
                    </div>
                </Modal>
            )
        }


    let disableUpdate = props.handleUpdateTaskCallback === undefined;
    let disableDelete = props.handleDeleteTaskCallback === undefined;

    const photoFormatter = (cell, row) => {

        let userImg = (row.photo !== null) ? imgSvrDNS + row.photo : genericImg;
        return (<img alt="a user" style={{width: '30px', borderRadius: '50%' }} src={userImg} />)
    }

    const nameFormatter = (cell, row) => {

        let userName = (row.name !== null) ? row.name : "TBD";
        return userName;
    }

    const subtasksFormatter = (cell, row) => {
        let subtasks = "";
        
        subtasks = subtasks.concat( (row.skill1 !== notApplicable ? row.skill1 : "") );
        subtasks = subtasks.concat( (row.skill2 !== notApplicable ? ", "+row.skill2 : "") );
        subtasks = subtasks.concat( (row.skill3 !== notApplicable ? ", "+row.skill3 : "") );

        return ( <p>{subtasks}</p>)
    }

    const updateFormatter = (cell, row) => {

        const handleUpdateTask = (event) => {

            showModalDiag('update', row);
        }

        if (disableUpdate) {  //disable button and opague img
            return ( <button className="btn" onClick={handleUpdateTask} disabled>
                    <img alt="update button" style={{opacity: 0.6, width: '30px'}} id={row.id} src={updateIcon} />
                    </button>
                )
        } 

        return (
            <ScrollIntoView selector={"#"+props.mytasksContainerId}  >
                <button className="btn" onClick={handleUpdateTask} >
                  <img alt="update button" style={{width: '30px'}} id={row.id} src={updateIcon} />
              </button> 
            </ScrollIntoView>
            )

    }
    const deleteFormatter = (cell, row) => {

        const handleDeleteTask = (event) => {

            showModalDiag('delete', row);
        }


        if (disableDelete) { //disable button and opague img
            return ( 
                    <button className="btn" onClick={handleDeleteTask} disabled>
                    <img alt="delete button" style={{opacity: 0.6, width: '30px'}} id={row.id} src={deleteIcon} />
                    </button>
                )
        }

        return ( 
            <ScrollIntoView selector={"#"+props.mytasksContainerId}  >
                <button className="btn" onClick={handleDeleteTask}>
                <img alt="delete button" style={{width: '30px'}} id={row.id} src={deleteIcon}/>
                </button>
            </ScrollIntoView>
            )
    }
    const createFormatter = (cell, row) => {

        const handleCreateTask = (event) => {

            showModalDiag('create', row);
        }

        return (
            <ScrollIntoView selector={"#"+props.mytasksContainerId}  >
                <button className="btn" onClick={handleCreateTask} >
                  <img alt="create button" style={{width: '30px'}} id={row.id} src={createIcon} />
              </button> 
            </ScrollIntoView>
            )

    }

    const selectStatusOptions = {
        open: 'open',
        accepted: 'accepted',
        closed: 'closed'
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
            sort: true,
            filter: textFilter()
        }, {
            dataField: 'skill1',
            text: 'Subtasks',
            sort: true,
            filter: textFilter(),
            formatter: subtasksFormatter  //consolidate skill fields
        }, {
            dataField: 'kind',
            text: 'Type',
            sort: true,
            filter: textFilter()
        }, {
            dataField: 'status',
            text: 'Status',
            sort: true,
            formatter: cell => selectStatusOptions[cell], 
            filter: selectFilter({
                options: selectStatusOptions
            })
        }, {
            dataField: 'hours',
            text: 'Hours',
            sort: true,
            filter: textFilter()
        }, {
            dataField: 'city',          //borrow field name for icon column
            text: 'Update',
            formatter: updateFormatter //display the clickable icon
        }, {
            dataField: 'st',            //borrow field name for icon column
            text: 'Delete',
            formatter: deleteFormatter //display the clickable icon
        }, {
            dataField: 'zip',           //borrow field name for icon column
            text: 'Create',
            formatter: createFormatter //display the clickable icon
     }];

    return (
        <div>
            {renderModalBox()}
            <BootstrapTable keyField='id' data={ tasks } columns={ columns } 
                filter={ filterFactory() }  filterPosition="top" //filters in a different row
            />            

        </div>
    )
}