import React from 'react';
import '../App.css';

import ScrollIntoView from 'react-scroll-into-view'

const imgSvrDNS = process.env.REACT_APP_HEROKU_EXPRESS_SVR;

export default function UserCard(props) {
    
    if (Object.keys(props).length === 0 && props.constructor === Object) {
        return <div></div>  //props is empty
    }

    let userObj = props.user;
    let userStr = JSON.stringify(userObj);
    let userImg = imgSvrDNS + props.user.photo;  //located Expressjs server
    let role = props.role;

    let clickHandlerFound = (props.clickCallback !== undefined);
    let compactMode = props.compact;
    let HandleClick = props.clickCallback;

    return (
        <div className="user-card">
            <div class="card ml-3 mb-3 bg-info text-white" 
                style={ compactMode ? 
                    {display: 'flex', flexDirection: 'row', 
                    justifyContent: "space-evenly", width: "320px", height: "160px", fontSize: "12px" }
                :  {justifyContent: "center", width: "200px", height: "350px", fontSize: "12px" }} >
                { !clickHandlerFound && <img class="card-img-top" style={{width: "80px",height: "80px", margin: "50px auto", marginBottom: "20px" }} src={userImg} alt="a user" /> }

                { clickHandlerFound && <ScrollIntoView selector="#task-form-header"  >
                    <img class="card-img-top ml-3 mt-4" style={{width: "80px",height: "80px", margin: "50px auto", marginBottom: "20px" }} src={userImg} alt="a user" onClick={HandleClick} name={userStr} id={userObj.id} /> 
                    </ScrollIntoView>
                 }
                { !clickHandlerFound &&  <div class="card-body">
                    <h6 class="card-title">Name: {userObj.name}</h6>
                    <p class="card-text">Contact info: {userObj.email}</p>
                    <p class="card-text">City: {userObj.city}</p>
                    <p class="card-text">Zip: {userObj.st} {userObj.zip} </p>
                </div> }
                { clickHandlerFound &&  <div class="card-body" onClick={HandleClick} name={userStr} id={userObj.id} >
                    <h6 class="card-title">Name: {userObj.name}</h6>
                    <p class="card-text">Contact info: {userObj.email}</p>
                    <p class="card-text">City: {userObj.city}</p>
                    <p class="card-text">Zip: {userObj.st} {userObj.zip} </p>
                </div> }
                
                {!compactMode && role === "worker" && <div class="card-footer">
                    <small class="text-warning">Available: {userObj.free}</small>
                </div>}
            </div>
        </div>
    )
}
