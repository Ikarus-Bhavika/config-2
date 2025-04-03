import React, { useRef, useState } from 'react'
import CustomModelViewer from './ModelViewerComponents/CustomModelViewer'
import { Group, Object3DEventMap } from 'three'

export default function ModelViewer() {
    
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [modelRef,setModelRef] = useState<React.RefObject<Group<Object3DEventMap>>>(useRef(new Group()))
  
    return (
        <div className='h-[55%] lg:h-[100dvh] lg:w-3/5 xl:w-[75%] bg-white'>
        <CustomModelViewer
            canvasRef={canvasRef}
            setModelRef={setModelRef}
        />
        </div>
    )
}
