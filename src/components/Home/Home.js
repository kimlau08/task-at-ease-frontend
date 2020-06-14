import React from 'react';

export default function Home(props) {

    if (Object.keys(props).length === 0 && props.constructor === Object) {
        return <div></div>  //props is empty
    }

    if (props.location.swapDisplayCallback !== undefined) {
        props.location.swapDisplayCallback("home-container", props);
    }

    return (  //display already rendered in App.js
        <div>
        </div>
    )
}
