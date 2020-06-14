import React from 'react';
import { Slide } from 'react-slideshow-image';

import './Slideshow.css';

import page1Img from '../../assets/neighborsHelp.jpg';
import page2Img from '../../assets/contactlessDelivery.webp';
import page3Img from '../../assets/porchHelp.jpg';

const slideImages = [
  page1Img,
  page2Img,
  page3Img
];
 
const properties = {
  duration: 3000,
  transitionDuration: 500,
  infinite: true,
  indicators: true,
  arrows: true,
  pauseOnHover: true,

}

export default function Slideshow() {

    return (  
      <div className="slide-container" id="slide-box">
        <Slide {...properties}>

          <div className="each-slide">
            <div style={{ 'backgroundImage': `url(${slideImages[0]})`}}>
              <span>We help you to Complete Housework in a Snap</span>
            </div>
          </div>

          <div className="each-slide">
            <div style={{ 'backgroundImage': `url(${slideImages[1]})`}}>
              <span>Contactless service: Pickup & Delivery at Your Schedule</span>
            </div>
          </div>

          <div className="each-slide">
            <div style={{ 'backgroundImage': `url(${slideImages[2]})`}}>
              <span>Large and small projects: We are Here, so You Don't have to Worry</span>
            </div>
          </div>
          
        </Slide>
      </div>
    )
}
