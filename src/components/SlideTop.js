import React from 'react';
import '../App.css';

import layingTiles from '../assets/layingTiles.jpg';
import delivery from '../assets/contactlessDelivery.webp';
import houseCleaning from '../assets/houseCleaning.jpg';
import paints from '../assets/paints.jpg';

export default function SlideTop() {

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
            <img src={paints} class="border border-white" style={{width: '30%',  
                                        position: 'absolute', right: 0, top: '15%', 
                                        borderRadius: 10 }}  />
            <div style={{width: '28%', fontSize: '2vw',
                        position: 'absolute', left: '3%', top: '18%',
                        backgroundColor: 'grey', opacity: 0.8, color: 'white' }} >
                    Contactless Service: Pickup & Delivery at Your Schedule
            </div>
            <div style={{width: '35%',  fontSize: '2vw',
                        position: 'absolute', right: '20%', top: '18%', 
                        backgroundColor: 'grey', opacity: 0.8, color: 'white' }}>
                    Routine Housework: We help you to Complete Tasks in a Snap
            </div>
            <div style={{width: '35%',  fontSize: '2vw',
                        position: 'absolute', right: '25%', top: '45%', 
                        backgroundColor: 'grey', opacity: 0.8, color: 'white' }}>
                    Large and Small Projects: We are Here, so You Don't have to Worry
            </div>
        </div>
    )
}
