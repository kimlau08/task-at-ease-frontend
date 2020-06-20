import React, { Component } from 'react';
import './App.css';
import {Route, Link, Switch, BrowserRouter as Router } from 'react-router-dom';

import { Navbar,Nav,NavDropdown,Form,FormControl,Button } from 'react-bootstrap'


import axios from 'axios';

import Home from './components/Home/Home';
import Login from './components/Login/Login';
import MyTasks from './components/MyTasks/MyTasks';
import OurWorkers from './components/OurWorkers/OurWorkers';
import OpenTaskAlerts from './components/OpenTaskAlerts/OpenTaskAlerts';

import '../node_modules/bootstrap/dist/css/bootstrap.css';

import SlideTop from './components/SlideTop';
import TasksCardList from './components/TasksCardList';
import SampleTasks from './components/SampleTasks';

import { Col, Row } from "react-bootstrap"
import Container from 'react-bootstrap/Container'; 

const userNameId = "user-name";
const dbDNS = process.env.REACT_APP_HEROKU_POSTGRES_DB;

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {

      containerOnDisplay: "home-container",
      
      user: {},      //currently logged in user
      userList: [],  //users in db
      openTasks: [], //open tasks in db
      authResult: "in_progress",

      myIP: "",
      myGeocode: {},
      ZipcodesIn10Miles: [],
      ZipcodesIn20Miles: [],
      ZipcodesIn50Miles: []
    }

    
    this.getUser = this.getUser.bind(this);
    this.setUser = this.setUser.bind(this);
    this.getUsers = this.getUsers.bind(this);    //get users from db
    this.getUserList = this.getUserList.bind(this);
    this.getZipRadius = this.getZipRadius.bind(this);
    this.getTaskByStatus = this.getTaskByStatus.bind(this);
    this.showZipRadius = this.showZipRadius.bind(this);
    
    this.getMyIPAndZipcodesNearBy = this.getMyIPAndZipcodesNearBy.bind(this);
    this.getMyGeocode = this.getMyGeocode.bind(this);
    this.updateOpenTasks = this.updateOpenTasks.bind(this);
    this.getZipcodesIn10Miles = this.getZipcodesIn10Miles.bind(this);
    this.getZipcodesIn20Miles = this.getZipcodesIn20Miles.bind(this);
    this.getZipcodesIn50Miles = this.getZipcodesIn50Miles.bind(this);

    this.navBar=this.navBar.bind(this);
    this.swapContainerOnDisplay=this.swapContainerOnDisplay.bind(this);
    this.setContainerOnDisplay=this.setContainerOnDisplay.bind(this);
  }

  getUser() {
    return this.state.user;
  }
  setUser(userObj) {
    this.setState( {user: userObj} );

    document.getElementById(userNameId).innerHTML = userObj.name;
  }
  getUserList() {
    return this.state.userList;
  }
  setAvailableUsers(availableUsers) {
    this.state.availableUsers = availableUsers;
  }
  updateOpenTasks() {
    this.getTaskByStatus('open');
  }
  getZipRadius(zip) {
    
    if (this.state.ZipcodesIn10Miles.includes(zip)) {
      return 10;
    }

    if (this.state.ZipcodesIn20Miles.includes(zip)) {
      return 20;
    }

    if (this.state.ZipcodesIn50Miles.includes(zip)) {
      return 50;
    }

    return -1
  }
  showZipRadius(zip, msgAreaId) {

    let r = this.getZipRadius(zip);
    let msg = r > 0 ? `Location: within ${r} miles from you` : `Location: more than 50 miles from you`
    document.getElementById(msgAreaId).innerHTML = msg;
  }
  
  async getZipcodesIn10Miles(geoCodes) {

    let dst = 10;  //10 mile radius
    let lat = geoCodes.latitude;
    let lng = geoCodes.longitude;

    let APIkey = process.env.REACT_APP_PROMAPTOOLS_1_MONTH_KEY;

    try {
      const response=await axios.get(`https://api.promaptools.com/service/us/zips-inside-radius/get/?radius=${dst}&lat=${lat}&lng=${lng}&key=${APIkey}`);
      console.log("getZipcodesIn10Miles response:", response.data);

      let zipCodes = response.data.output.map( z => z.zip );

      this.setState( { ZipcodesIn10Miles : zipCodes } );

    } catch (e) {
      console.error(e);
    }
  }
  

  async getZipcodesIn20Miles(geoCodes) {

    let dst = 20;  //20 mile radius
    let lat = geoCodes.latitude;
    let lng = geoCodes.longitude;

    let APIkey = process.env.REACT_APP_PROMAPTOOLS_1_MONTH_KEY;

    try {
      const response=await axios.get(`https://api.promaptools.com/service/us/zips-inside-radius/get/?radius=${dst}&lat=${lat}&lng=${lng}&key=${APIkey}`);
      console.log("getZipcodesIn20Miles response:", response.data);

      let zipCodes = response.data.output.map( z => z.zip );

      this.setState( { ZipcodesIn20Miles : zipCodes } );

    } catch (e) {
      console.error(e);
    }
  }


  async getZipcodesIn50Miles(geoCodes) {

    let dst = 50;  //50 mile radius
    let lat = geoCodes.latitude;
    let lng = geoCodes.longitude;

    let APIkey = process.env.REACT_APP_PROMAPTOOLS_1_MONTH_KEY;

    try {
      const response=await axios.get(`https://api.promaptools.com/service/us/zips-inside-radius/get/?radius=${dst}&lat=${lat}&lng=${lng}&key=${APIkey}`);
      console.log("getZipcodesIn50Miles response:", response.data);

      let zipCodes = response.data.output.map( z => z.zip );

      this.setState( { ZipcodesIn50Miles : zipCodes } );

    } catch (e) {
      console.error(e);
    }
  }

  async getMyGeocode(ip) {

    let APIkey = process.env.REACT_APP_IPCODELOCATION_KEY;

    try {
      const response=await axios.get(`https://api.ipgeolocation.io/ipgeo?apiKey=${APIkey}&ip=${ip}`);
      console.log("getMyGeocode response:", response.data);

      let geoCodes = { latitude: response.data.latitude,
                       longitude: response.data.longitude  }

      this.setState( {myGeocode : geoCodes } );

      this.getZipcodesIn10Miles(geoCodes);
      this.getZipcodesIn20Miles(geoCodes);
      this.getZipcodesIn50Miles(geoCodes);

    } catch (e) {
      console.error(e);
    }
  }
  
  async getMyIPAndZipcodesNearBy() {
    
    try {
      const response=await axios.get(`https://api.ipify.org/?format=json`);
      console.log("my IP response:", response.data);

      this.setState( {myIP : response.data.ip} );

      this.getMyGeocode(response.data.ip);

    } catch (e) {
      console.error(e);
    }
  }

  async getUsers() {
    
    try {
      const response=await axios.get(`${dbDNS}/tae_api/v1/user`);
      console.log("getUsers response:", response.data);

      this.setState( {userList : response.data} );

    } catch (e) {
      console.error(e);
    }
  }

  async getTaskByStatus(status) {
    
    try {
      const response=await axios.get(`${dbDNS}/tae_api/v1/taskbystatus/${status}`);
      console.log("getTaskByStatus response:", response.data);

      if (status === "open") {

        this.setState( {openTasks : response.data} );
      }
    
    } catch (e) {
      console.error(e);
    }
  }

  componentDidMount() {

    this.getTaskByStatus("open")

    this.getUsers();

    this.getMyIPAndZipcodesNearBy()

    //make the hinged image dissappear after 5 sec
    let hingedImage = document.getElementById("hingedImg");
    if (hingedImage !== undefined) {
      setTimeout(() => {
        hingedImage.style.display="none";

      }, 3000);
    }
    let paintsImg = document.getElementById("paintsImg");
    if (paintsImg !== undefined) {
      paintsImg.style.display="none";
      setTimeout(() => {
        paintsImg.style.display="";

      }, 3000);
    }
  }

  
  setContainerOnDisplay(container) {   //Do not cause render
    this.state.containerOnDisplay = container;   
  }
  
  swapContainerOnDisplay(toContainerId, inputProps) {   

    //turn off display of "from container" in props. display "to container" instead

    if (inputProps.location === undefined) { 
      //Came in from direct React component call instead of Router. No need to swap display

      this.setContainerOnDisplay(toContainerId); //just save the to container and return
      return;
    }

    if (document.getElementById(toContainerId) !== null) {
      document.getElementById(toContainerId).style.display="";
    }
      
    //Bootstrap display & slide needs explicity management
    if (toContainerId === "home-container") {
      document.getElementById("bootstrap-contents").style.display="";
      document.getElementById("slide-container").style.display="";
    }

    //Look for the container element to be swapped from
    let fromContainerId=this.state.containerOnDisplay;
    let fromContainerElem=null;
    if (fromContainerId !== ""  &&  fromContainerId !== toContainerId) {
        fromContainerElem = document.getElementById(fromContainerId);
        if (fromContainerElem !== null) {

            document.getElementById(fromContainerId).style.display="none";
        }

      //Bootstrap display & slide needs explicity management
      if (fromContainerId === "home-container") {
        document.getElementById("bootstrap-contents").style.display="none";
        document.getElementById("slide-container").style.display="none";
      }
    }
  }

  navBar() {
    return (
      <div>
          <div className="row">
              <div className="col-md-12">
                  <Router>
                      <Navbar bg="warning" variant="light" expand="md" sticky="top">
                          <Navbar.Brand>Task At Ease</Navbar.Brand>
                          <Navbar.Toggle aria-controls="basic-navbar-nav" />
                          <Navbar.Collapse id="basic-navbar-nav">
                              <Nav className="mr-auto">
                                <Link to={{
                                  pathname: "/Home",
                                  swapDisplayCallback: this.swapContainerOnDisplay
                                }}>&nbsp;&nbsp;Home&nbsp;&nbsp;</Link>
                                <Link  to={{
                                  pathname: "/OurWorkers",
                                  swapDisplayCallback: this.swapContainerOnDisplay,
                                }}>&nbsp;&nbsp;Our Workers&nbsp;&nbsp;</Link>

                                <Link to={{
                                    pathname: "/MyTasks",
                                    swapDisplayCallback: this.swapContainerOnDisplay,
                                    getUserCallback: this.getUser,
                                    getUserListCallback : this.getUserList,
                                    updateOpenTasksCallback : this.updateOpenTasks,
                                    showZipRadiusCallback : this.showZipRadius
                                  }}>&nbsp;&nbsp;My Tasks&nbsp;&nbsp;</Link>
                              
                                <Link to={{
                                  pathname: "/Login",
                                  swapDisplayCallback: this.swapContainerOnDisplay,
                                  setUserCallback: this.setUser,
                                }}>&nbsp;&nbsp;Login&nbsp;&nbsp;</Link>
                              </Nav>
                              <Form inline>
                                <p id={userNameId}></p>
                              </Form>
                          </Navbar.Collapse>
                      </Navbar>
                      <br />

                      <Switch>
                        <Route exact path="/Home" component={Home} />

                        <Route exact path="/OurWorkers" component={OurWorkers} />

                        <Route exact path="/MyTasks" component={MyTasks} />

                        <Route exact path="/Login" component={Login} />
                      </Switch>
                  </Router>

              </div>
          </div>
      </div>
    )  
  }

  render() {

    return (
      <div className="App">

        {this.navBar()}

        <SlideTop />

        <div id="bootstrap-contents">
            <br /><br />
            <Container>
              <Row>
                <Col md={3}>
                  <div class="text-dark" >

                    <OpenTaskAlerts openTasks={this.state.openTasks} />

                  </div>
                </Col>
                <Col md={9}>
                  <div class="p-3 mb-2 text-dark">

                    <TasksCardList cardList={SampleTasks} cardListType="samples" />

                  </div>
                </Col>
              </Row>
            </Container>
        </div>
      </div>
    );
  }
}

