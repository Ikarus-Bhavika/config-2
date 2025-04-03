import './App.css'
import ModelViewer from './components/ModelViewer'
import Menu from './components/Menu'
import { extend } from '@react-three/fiber'
import * as THREE from 'three'
import MobileMenu from './components/MobileMenu'
import useDataStore from './store/store'
import { useEffect } from 'react'
import data from './data.json'
import intializePreset from './utils/intializePreset'
extend(THREE)

function App() {
  const store = useDataStore();
  useEffect(()=>{
    console.log(data);
    store.setModelConfig(data.models);
    store.setMenu(data.menu);
    store.setProductDetails(data.productDetails);
    store.setPreset(intializePreset(data.models));
  },[])

  console.log(store.preset);

  return (
    <main className='flex flex-col lg:flex-row w-[100dvw] h-[100dvh] justify-end'>
      <ModelViewer />
      <MobileMenu />
      <Menu/>
    </main>
  )
}

export default App
