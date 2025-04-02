import React, { useEffect } from 'react';
import LoaderJson from './icon.json';
import "./icon.css"
import Lottie from 'react-lottie-player';

export default function LoaderLottie(){
  return (
    <div className="lottie-parent-container">
      <div className="lottie-child-container">
        <Lottie loop animationData={LoaderJson} play />
      </div>
    </div>
  );
};
