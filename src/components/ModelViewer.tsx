import React, { useRef, useState } from 'react'
import CustomModelViewer from './ModelViewerComponents/CustomModelViewer'
import { Group, Object3DEventMap } from 'three'

export default function ModelViewer() {
    
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [modelRef,setModelRef] = useState<React.RefObject<Group<Object3DEventMap>>>(useRef(new Group()))
  
    return (
        <div className='h-[35%] bg-white'>
        <CustomModelViewer
            canvasRef={canvasRef}
            setModelRef={setModelRef}
        />
        </div>
    )
}
