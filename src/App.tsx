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
extend(THREE)

function App() {
  const store = useDataStore();
  useEffect(()=>{
    console.log(data);
    store.setModelConfig(data.models);
    store.setMenu(data.menu);
    store.setProductDetails(data.productDetails);
    store.setPreset(data.defaultPreset);
  },[])

  console.log(store.preset);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Main/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
