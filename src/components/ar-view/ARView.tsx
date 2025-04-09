import { Link } from 'react-router-dom'
import { Suspense, useRef } from 'react'
import { useModelViewerStates } from '../../store/modelViewerContext'
// import LoaderJson from '@utils/Loader.json'
import ARCustomModelViewer from './ARCustomModelViewer'
import './ar-view.css'
import { ModelViewerElement } from '@google/model-viewer'


const View = () => {
  const modelRef = useRef<ModelViewerElement>(null)

  const { states } = useModelViewerStates()

  const activateAr = () => {
    const modelViewer = modelRef.current
    if (modelViewer) {
      if (modelViewer.canActivateAR) {
        modelViewer.activateAR()
      }
    }
  }
  // const windowUrl = `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}`
  return (
    <div className='container'>
      <Link
        to={states.siteURL}
        style={{position:'absolute',top:20, left:20, borderWidth:'2px', borderRadius:'10px', padding:'10px'}}
      >
        {"<-"} Go back
      </Link>
      <div style={{height:"100dvh",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",gap:16}}>
        <div style={{aspectRatio:1,width:"90dvw",}}>
          <ARCustomModelViewer {...states} modelRef={modelRef} />
        </div>
        <h1>
          Your Model is ready for AR
        </h1>
        <button className='ar-button' onClick={activateAr}>
          Launch AR {"->"}
        </button>
      </div>
      
    </div>
  )
}

export default function ARView() {
  return (
    // <Suspense fallback={<LoaderLottie />}>
    <Suspense>
      <View />
    </Suspense>
  )
}

// export default ARView;
