import React, { createElement, useEffect, useRef, useState } from 'react'
import '@google/model-viewer'
import BufferingLoader from '../BufferingLoader'
import './ar-view.css'


const ARCustomModelViewer = props => {
  const [loading, setloading] = useState<boolean>(false)

  useEffect(() => {
    setloading(true)
    const viewer = props.modelRef.current
    viewer.showPoster()
    viewer.addEventListener(
      'load',
      (e) => {
        console.log("ModelLoded",e)
        setloading(false)
        viewer.dismissPoster()
        // viewerRef.current.activateAR();
      },
      []
    )

  }, [props.url])

  console.log(props)

  return (
    <model-viewer
      ref={props.modelRef}
      src={props.url}
      // ios-src={props.iosURL}
      style={{ height: '100%', width: '100%', border:"solid 1px" }}
      ar
      ar-modes='quick-look webxr scene-viewer'
      reveal='auto'
      touch-action='pan-y pinch-zoom'
      tone-mapping='commerce'
      camera-controls
      scale='1 1 1'
    >
      <button slot='ar-button' />
      <div
        className={`loader ${loading ? '' : 'hidden'}`}
        id='progress-bar'
        slot='progress-bar'
      >
        <BufferingLoader />
      </div>
    </model-viewer>
  )
}

export default ARCustomModelViewer
