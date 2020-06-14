import React from 'react';
import '../App.css'

import { useState } from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Toast from 'react-bootstrap/Toast';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

const TaskOfferedMsg = ({ children }) => {
    const [show, toggleShow] = useState(false);
  
    return (
      <>
        {!show && <Button onClick={() => toggleShow(true)}>Show Message</Button>}
        <Toast class="mx-auto"  show={show} onClose={() => toggleShow(false)}>
            <Toast.Header class="mx-auto"  >
                <strong className="mr-auto">You've got a task</strong>
            </Toast.Header>
            <Toast.Body class="mx-auto" >{children}</Toast.Body>
        </Toast>

      </>
    );
  };

export default function JumpotronMsg (props) {
    
    if (Object.keys(props).length === 0 && props.constructor === Object) {
        return <div></div>  //props is empty
    }

    return (
        <div className="jumbo-msg">
            <Container class="p-3">
                <Jumbotron >
                    { (props.large === "true") && <h2 class="header">Task Invite Alert!</h2>}
                    { (props.large !== "true") && <h6 class="header">Task Invite Alert!</h6>}
                    
                    <TaskOfferedMsg>
                        {props.msg}
                        <span role="img" aria-label="tada">
                        🎉
                        </span>
                    </TaskOfferedMsg>
                </Jumbotron>
            </Container>
        </div>
    )
}
