import React from 'react';
import '../App.css';

import layingTiles from '../assets/layingTiles.jpg';
import delivery from '../assets/contactlessDelivery.webp';
import houseCleaning from '../assets/houseCleaning.jpg';
import paints from '../assets/paints.jpg';

import { bounceInDown } from 'react-animations';
import { hinge } from 'react-animations';
import Radium, {StyleRoot} from 'radium';


export default function SlideTop() {

    const stylesFast = {
        bounceInDown: {
          animation: 'x 1.5s',
          animationName: Radium.keyframes(bounceInDown, 'bounceInDown')
        }
    }
    const stylesSlow = {
        bounceInDown: {
        animation: 'x 2s',
        animationName: Radium.keyframes(bounceInDown, 'bounceInDown')
        },
        hinge: {
          animation: 'x 5s',
          animationName: Radium.keyframes(hinge, 'hinge')
        }
    }

    const showHingedImg = () => {
        return (

            <StyleRoot style={{width: '30%', 
                                position: 'absolute', right: 0, top: '15%' }} >
                <div style={stylesSlow.hinge}>
                    <img src={paints} class="border border-white" style={{width: '100%',  
                                                position: 'absolute', right: 0, top: '15%', 
                                                borderRadius: 10 }}  />
                </div>
            </StyleRoot>
        )
    }

    const showText1 = () => {
        return (
            <StyleRoot style={{width: '28%', 
                                position: 'absolute', left: '3%', top: '23%' }} >
                <div style={stylesFast.bounceInDown}>
                    <p class="border border-white" style={{width: '100%', fontSize: '2vw',
                                backgroundColor: 'grey', opacity: 0.8, color: 'white' }} >
                            Contactless Service: Pickup & Delivery at Your Schedule
                    </p>
                </div>
            </StyleRoot>
        )
    }

    const showText2 = () => {
        return (
            <StyleRoot style={{width: '35%', 
                                position: 'absolute', right: '20%', top: '23%' }} >
                <div style={stylesFast.bounceInDown}>
                    <p class="border border-white" style={{width: '100%',  fontSize: '2vw',
                                backgroundColor: 'grey', opacity: 0.8, color: 'white' }}>
                            Routine Housework: We help you to Complete Tasks in a Snap
                    </p>
                </div>
            </StyleRoot>
        )
    }

    const showText3 = () => {
        return (

            <StyleRoot style={{width: '35%', 
                                position: 'absolute', right: '25%', top: '45%' }} >
                <div style={stylesSlow.bounceInDown}>
                    <p class="border border-white" style={{width: '100%',  fontSize: '2vw',
                                backgroundColor: 'grey', opacity: 0.8, color: 'white' }}>
                            Large and Small Projects: We are Here, so You Don't have to Worry
                    </p>
                </div>
            </StyleRoot>
        )
    }

    return (  //display already rendered in App.js
        <div id='slide-container' style={{display: 'relative'}} >

            <img src={layingTiles} style={{width: '100%'}} />
            
            <img src={delivery} class="border border-white" 
                                    style={{width: '28%', 
                                        position: 'absolute', left: 0, top: '15%',
                                        borderRadius: 10 }}  />
            <img src={houseCleaning} class="border border-white" style={{width: '28%',  
                                        position: 'absolute', left: '35%', top: '10%', 
                                        borderRadius: 10 }}  />

            
            {showHingedImg()}
            {showText1()}
            {showText2()}
            {showText3()}
        </div>
    )
}
