import React, { Component } from 'react';
import './App.css';
import {Route, Link, Switch, BrowserRouter as Router } from 'react-router-dom';

import axios from 'axios';

import Home from './components/Home/Home';
import Login from './components/Login/Login';
import MyTasks from './components/MyTasks/MyTasks';
import OurWorkers from './components/OurWorkers/OurWorkers';
import OpenTaskAlerts from './components/OpenTaskAlerts/OpenTaskAlerts';

import '../node_modules/bootstrap/dist/css/bootstrap.css';

import Slideshow from './components/Slideshow/Slideshow';
import TasksCardList from './components/TasksCardList';
import SampleTasks from './components/SampleTasks';
import JumbotronMsg from './components/JumbotronMsg';

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
      userList: [],  //users 
      authResult: "in_progress",
      taskOffered: false,
      taskOfferMsg: "",

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
    this.getTaskOffered=this.getTaskOffered.bind(this);
    this.setTaskOffered=this.setTaskOffered.bind(this);
    this.getZipRadius = this.getZipRadius.bind(this);
    this.showZipRadius = this.showZipRadius.bind(this);
    
    this.getMyIPAndZipcodesNearBy = this.getMyIPAndZipcodesNearBy.bind(this);
    this.getMyGeocode = this.getMyGeocode.bind(this);
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
  getTaskOffered() {
    return this.state.taskOffered;
  }
  setTaskOffered(offered, offerMsg) {
    this.setState( {taskOffered: offered} );
    this.setState(  {taskOfferMsg : offerMsg} );
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

  componentDidMount() {

    this.getUsers();

    this.getMyIPAndZipcodesNearBy()
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
      
    //Bootstrap display & slider needs explicity management
    if (toContainerId === "home-container") {
      document.getElementById("bootstrap-contents").style.display=""
      document.getElementById("slide-box").style.display=""
    }

    //Look for the container element to be swapped from
    let fromContainerId=this.state.containerOnDisplay;
    let fromContainerElem=null;
    if (fromContainerId !== ""  &&  fromContainerId !== toContainerId) {
        fromContainerElem = document.getElementById(fromContainerId);
        if (fromContainerElem !== null) {

            document.getElementById(fromContainerId).style.display="none";
        }

      //Bootstrap display & slider needs explicity management
      if (fromContainerId === "home-container") {
        document.getElementById("bootstrap-contents").style.display="none"
        document.getElementById("slide-box").style.display="none"
      }
    }
  }
  
  navBar() {
    return (
      <Router>
        <nav className="menu">
          <ul className="menu-bar">
              <li>
              <Link to={{
                      pathname: "/Home",
                      swapDisplayCallback: this.swapContainerOnDisplay
                    }}>Home</Link>
              </li>
              <li>
                  <Link to={{
                      pathname: "/OurWorkers",
                      swapDisplayCallback: this.swapContainerOnDisplay,
                      getUserCallback: this.getUser,
                      getOfferCallback : this.getTaskOffered,
                      getUserListCallback : this.getUserList
                    }}>Our Workers</Link>
              </li>
              <li>
                  <Link to={{
                      pathname: "/MyTasks",
                      swapDisplayCallback: this.swapContainerOnDisplay,
                      getUserCallback: this.getUser,
                      getOfferCallback : this.getTaskOffered,
                      getUserListCallback : this.getUserList,
                      showZipRadiusCallback : this.showZipRadius
                    }}>My Tasks</Link>
              </li>
              <li>
              <Link to={{
                      pathname: "/Login",
                      swapDisplayCallback: this.swapContainerOnDisplay,
                      setUserCallback: this.setUser,
                      getOfferCallback : this.getTaskOffered,
                      setOfferCallback : this.setTaskOffered
                    }}>Login</Link>
              </li>
          </ul>

          <p id={userNameId}></p>

        </nav>
        <Switch>
          <Route exact path="/Home" component={Home} />

          <Route exact path="/OurWorkers" component={OurWorkers} />

          <Route exact path="/MyTasks" component={MyTasks} />

          <Route exact path="/Login" component={Login} />
        </Switch>

      </Router>
    )
  }

  render() {

    let taskOffered = this.state.taskOffered;
    let offereMsg = this.state.taskOfferMsg;

    return (
      <div className="App">

        {this.navBar()}

        <Slideshow />

        <div id="bootstrap-contents">
            <br /><br />
            <Container>
              <Row>
                <Col sm={3}>
                  <div class="text-dark" >

                    {taskOffered && <JumbotronMsg msg={offereMsg}  />}

                    <OpenTaskAlerts />


                  </div>
                </Col>
                <Col sm={9}>
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

