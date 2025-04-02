import './App.css'
import ModelViewer from './components/ModelViewer'
import Menu from './components/Menu'
import { extend } from '@react-three/fiber'
import * as THREE from 'three'

extend(THREE)

function App() {

  return (
    <main className='flex flex-col w-[100dvw] h-[100dvh] bg-[#E4E4E4] justify-end'>
      <ModelViewer />
      <Menu />
    </main>
  )
}

export default App
