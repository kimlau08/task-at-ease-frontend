import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

import { Form, Button } from 'react-bootstrap';

import './Login.css';

const authResultMsgId = "auth-result-msg-id";
const dbDNS = process.env.REACT_APP_HEROKU_POSTGRES_DB && 'http://localhost:8888';
let authResult = "";
export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state= {

            name: "",
            email: "",
            password: "",

            user: {},
            redirectToHome: false
        }

        this.handleLogin=this.handleLogin.bind(this);
        this.closeForm=this.closeForm.bind(this);
        this.authenticateUser=this.authenticateUser.bind(this);
        this.authResultReady=this.authResultReady.bind(this);
    }

    authResultReady(authResult) {

        switch (authResult) {

            case "pass":

                console.log(`Successful authentication for email: ${this.state.email}`);
                this.props.location.setUserCallback(this.state.user);  //elevate user object to App.js

                this.closeForm();  //redirect to home
    
                break;

            case "fail":

                console.log(`Fail to authenticate with email: ${this.state.email}`);
                document.getElementById(authResultMsgId).innerHTML = "Incorrect email or password";

                break;

            default: 
                console.log(`Error authenticating user with email: ${this.state.email}`);
                 if (document.getElementById(authResultMsgId) !== null) {
                    document.getElementById(authResultMsgId).innerHTML = "Incorrect email or password";
                 }
        }
    }

    async authenticateUser(email, password, authResultReady) {

        this.state.authResult = "in_progress"; 
    
        try {
          const response=await axios.get(`${dbDNS}/tae_api/v1/user/${email}`);
          console.log("authenticateUser response:", response.data);
          
          let authResult = ( password === response.data.password ? "pass" : "fail" )
          this.setState( {user : response.data} );
    
          authResultReady(authResult);
    
        } catch (e) {
        console.error(e);
        authResultReady(authResult);
        }
    }
    

    async getTasksByWorker(workerId) {
        
    try {
        const response=await axios.get(`${dbDNS}/tae_api/v1/taskbyworker/${workerId}`);
        console.log("getTasksByWorker:", response.data);

        let openTask = response.data.filter( t => (t.status === "open")); 

        if (openTask > 0) {
            this.props.location.setOfferCallback(true, `There are ${openTask.length} open task invite for you`);
        }

        } catch (e) {
            console.error(e);
        }
    }


    handleLogin(event) {

        event.preventDefault();  //do not close the form as default
 
        let email = event.target.elements[0].value;
        let password = event.target.elements[1].value;

        if (email === "" || password === "") {
            
            document.getElementById(authResultMsgId).innerHTML = "Please email and password";
            return;
        }

        this.setState( {
            email: email,
            password: password
                } )

        this.authenticateUser(email, password, this.authResultReady );
    }

    closeForm() {

        if (this.props.location.swapDisplayCallback === undefined) {
            return;
        }
        //Redirect back to root (App component)
        this.setState( { redirectToHome: true } ); 
        //swap back to the Home component display before redirect
        this.props.location.swapDisplayCallback("home-container", this.props);
    }

    render () {

        if (Object.keys(this.props).length === 0 && this.props.constructor === Object) {
            return <div></div>   //props is empty
        }

        let toContainerId="login-container";
    
        if (this.props.location.swapDisplayCallback !== undefined) { 
            this.props.location.swapDisplayCallback(toContainerId, this.props);

        } else {
            return (<div>
                {/*  route back to root (App component) depending on state */}
                 <Redirect to='/Home' />   

                </div>)
        }
   
        return (  
            <div id={toContainerId}>
                {/* route back to root (App component) depending on state */}
                {this.state.redirectToHome &&
                    <Redirect to='/Home' />    
                }

                <br/><br/><br/><br/>
                <h2 className="text-muted">Let us share your burden today</h2>
                <br/><br/>

                <Form onSubmit={this.handleLogin} style={{ width: 300  }}>

                    <p id={authResultMsgId}></p>
                    <br/><br/>
                    <Form.Group controlId="emailField">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" />
                    </Form.Group>

                    <Form.Group controlId="passwordField">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" />
                    </Form.Group><br/><br/>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>

            </div>
        )
    }
}
