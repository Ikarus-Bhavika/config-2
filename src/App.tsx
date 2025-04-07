import './App.css'
// import ModelViewer from './components/ModelViewer'
// import Menu from './components/Menu'
import { extend } from '@react-three/fiber'
import * as THREE from 'three'
// import MobileMenu from './components/MobileMenu'
import useDataStore from './store/store'
import { useEffect } from 'react'
import data from './data.json'
// import intializePreset from './utils/intializePreset'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Main from './components/Main'
import ARView from './components/ar-view/ARView'
import ModelViewerContextProvider from './store/modelViewerContext'

extend(THREE)

function App() {
  const store = useDataStore();
  useEffect(()=>{
    store.setModelConfig(data.models);
    store.setMenu(data.menu);
    store.setProductDetails(data.productDetails);
    store.setPreset(data.defaultPreset);
    store.setHotSpotMenu(data.hotspotMenuItems);
  },[])


  return (
    <ModelViewerContextProvider>
      <BrowserRouter>

        <Routes>
          <Route path='/' element={<Main/>}/>
          <Route path='/shared' element={<Main/>}/>
          <Route path='/ar-view' element={<ARView />}/>
        </Routes>
      </BrowserRouter>
    </ModelViewerContextProvider>
  )
}

export default App
