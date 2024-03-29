import React from 'react';
import '../App.css';

import layingTiles from '../assets/layingTiles.jpg';
import delivery from '../assets/contactlessDelivery.webp';
import houseCleaning from '../assets/houseCleaning.jpg';
import paints from '../assets/paints.jpg';
import peeledPaints from '../assets/peeledPaint.jpg';

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
          animation: 'x 3s',
          animationName: Radium.keyframes(hinge, 'hinge')
        }
    }

    const showHingedImg = () => {
        return (

            <StyleRoot style={{width: '25%', 
                                position: 'absolute', right: '11%', top: '15%' }} >
                <div style={stylesSlow.hinge}>
                    <img alt="room requiring work" id="hingedImg" src={peeledPaints} className="border border-white" style={{width: '100%',  
                                                position: 'absolute', right: 0, top: '15%', 
                                                borderRadius: 10 }}  />
                </div>

                <div>
                    <img alt="cans of paints" id="paintsImg" src={paints} className="border border-white" style={{width: '100%',  
                                                position: 'absolute', right: 0, top: '15%', 
                                                borderRadius: 10 }}  />
                </div>
            </StyleRoot>
            
        )
    }

    const showText1 = () => {
        return (
            <StyleRoot style={{width: '23%', 
                                position: 'absolute', left: '11%', top: '21%' }} >
                <div style={stylesFast.bounceInDown}>
                    <p className="border border-white" style={{width: '100%', fontSize: '1.3vw',
                                backgroundColor: 'grey', opacity: 0.8, color: 'white' }} >
                            Contactless Service: Pickup & Delivery at Your Schedule
                    </p>
                </div>
            </StyleRoot>
        )
    }

    const showText2 = () => {
        return (
            <StyleRoot style={{width: '28%', 
                                position: 'absolute', right: '30%', top: '23%' }} >
                <div style={stylesFast.bounceInDown}>
                    <p className="border border-white" style={{width: '100%',  fontSize: '1.6vw',
                                backgroundColor: 'grey', opacity: 0.8, color: 'white' }}>
                            Routine Housework: We help you to Complete Tasks in a Snap
                    </p>
                </div>
            </StyleRoot>
        )
    }

    const showText3 = () => {
        return (

            <StyleRoot style={{width: '30%', 
                                position: 'absolute', right: '20%', top: '38%' }} >
                <div style={stylesSlow.bounceInDown}>
                    <p className="border border-white" style={{width: '100%',  fontSize: '1.7vw',
                                backgroundColor: 'grey', opacity: 0.8, color: 'white' }}>
                            Large and Small Projects: We are Here, so You Don't have to Worry
                    </p>
                </div>
            </StyleRoot>
        )
    }

    return (  //display already rendered in App.js
        <div id='slide-container' style={{display: 'relative'}} >

            <img alt="hands laying tiles" src={layingTiles} style={{width: '80%'}} />
            
            <img alt="handing goods to receiver" src={delivery} className="border border-white" 
                                    style={{width: '20%', 
                                        position: 'absolute', left: '11%', top: '18%',
                                        borderRadius: 10 }}  />
            <img alt="house cleaning" src={houseCleaning} className="border border-white" style={{width: '20%',  
                                        position: 'absolute', left: '35%', top: '13%', 
                                        borderRadius: 10 }}  />

            
            {showHingedImg()}
            {showText1()}
            {showText2()}
            {showText3()}
        </div>
    )
}
