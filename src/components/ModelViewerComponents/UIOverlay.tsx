import React from 'react'

export default function UIOverlay({
    toggleDimension,
    getScreenShot,
    toggleFullScreen,
    toggleAR,

    isFullScreen=false,
}:{
    toggleDimension:()=>void
    getScreenShot:()=>void,
    toggleFullScreen:()=>void,
    toggleAR:()=>void,

    isFullScreen:boolean,
}) {

    return (
        <div className='absolute bottom-6 left-6 z-[1] flex flex-col gap-4'>
            <button onClick={toggleAR} className='rounded-full p-3 bg-gray-300 cursor-pointer shadow'>
                <img height={30} width={30} src='icons/ARV4.png' alt='Ar Icon'/>
            </button>
            <button onClick={getScreenShot} className='rounded-full p-3 bg-gray-300 cursor-pointer shadow'>
                <img height={30} width={30} src='icons/ScreenshotV4.png' alt='Ar Icon'/>
            </button>
            <button onClick={toggleFullScreen} className='rounded-full p-3 bg-gray-300 cursor-pointer shadow'>
                {isFullScreen
                    ?<img height={30} width={30} src='icons/Minimize.png' alt='Ar Icon'/>
                    :<img height={30} width={30} src='icons/ExpandV4.png' alt='Ar Icon'/>
                }
            </button>
            <button onClick={toggleDimension} className='rounded-full p-3 bg-gray-300 cursor-pointer shadow'>
                <img height={30} width={30} src='icons/MeasurementV4.png' alt='Ar Icon'/>
            </button>
        </div>
    )
}
