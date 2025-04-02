import './App.css'
import ModelViewer from './components/ModelViewer'
import Menu from './components/Menu'
import { extend } from '@react-three/fiber'
import * as THREE from 'three'
import MobileMenu from './components/MobileMenu'

extend(THREE)

function App() {

  return (
    <main className='flex flex-col lg:flex-row w-[100dvw] h-[100dvh] justify-end'>
      <ModelViewer />
      <MobileMenu />
      <Menu/>
    </main>
  )
}

export default App
