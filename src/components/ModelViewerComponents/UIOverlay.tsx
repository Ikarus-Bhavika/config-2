import React, { useState } from 'react'
import useDataStore from '../../store/store';

export default function UIOverlay({
    toggleDimension,
    getScreenShot,
    toggleFullScreen,
    toggleAR,
    disableDimension,
    
    isFullScreen=false,
}:{
    toggleDimension:()=>void
    getScreenShot:()=>void,
    toggleFullScreen:()=>void,
    toggleAR:()=>void,
    disableDimension:()=>void,

    isFullScreen:boolean,
}) {

    const {
        expandModel,
        setExpandModel,
        setAllowHotspots,
        setExpandedComponent,
        enableButtons,
    } = useDataStore()

    function handleToggleExpand(){
        if(expandModel){
            setAllowHotspots({active:false,activeData:[], for:"",activeMenuItemId:""})
            setExpandedComponent("");
            setExpandModel(false)
        }else{
            setExpandModel(true)
            disableDimension()
        }
    }

    const iconSize=25

    return (
        <div className='absolute bottom-16 w-full z-[1] flex flex-col gap-4'>

            <div className={`flex gap-2 justify-center`}>
                <button onClick={handleToggleExpand} className='rounded-full p-2 px-3 border border-[#eaedf0] shadow bg-white cursor-pointer flex min-w-[15%] gap-2'>
                    {!expandModel
                        ?<img height={iconSize} width={iconSize} src='icons/Decompress.png' alt='toggle expand'/>
                        :<img height={iconSize} width={iconSize} src='icons/Compress.png' alt='toggle expand'/>
                    }
                    <div className='w-full'>
                        {!expandModel?"Expand":"Collapse"}
                    </div>
                </button>

                <button disabled={!enableButtons} onClick={toggleAR} className={`${expandModel?"opacity-15":""} rounded-full p-2 px-3 border border-[#eaedf0] shadow bg-white cursor-pointer flex min-w-[15%] gap-2`}>
                    <img height={iconSize} width={iconSize} src='icons/ARV4.png' alt='Ar Icon'/>
                    <div className='w-full'>
                        View in AR
                    </div>
                </button>
                <button disabled={!enableButtons} onClick={getScreenShot} className={`${expandModel?"opacity-15":""} rounded-full p-2 px-3 border border-[#eaedf0] shadow bg-white cursor-pointer flex min-w-[15%] gap-2`}>
                    <img height={iconSize} width={iconSize} src='icons/ScreenshotV4.png' alt='Screenshot icon'/>
                    <div className='w-full'>
                        Screenshot
                    </div>
                </button>
                {/* <button disabled={!enableButtons} onClick={toggleFullScreen} className={`${expandModel?"opacity-15":""} rounded-full p-2 px-3 border border-[#eaedf0] shadow bg-white cursor-pointer flex min-w-[15%] gap-2`}>
                    {!isFullScreen
                        ?<img height={iconSize} width={iconSize} src='icons/Minimize.png' alt='fullscreen Icon'/>
                        :<img height={iconSize} width={iconSize} src='icons/ExpandV4.png' alt='fullscreen Icon'/>
                    }
                    <div className='w-full'>
                        Fullscreen
                    </div>
                </button> */}
                <button disabled={!enableButtons} onClick={toggleDimension} className={`${expandModel?"opacity-15":""} rounded-full p-2 px-3 border border-[#eaedf0] shadow bg-white cursor-pointer flex min-w-[15%] gap-2`}>
                    <img height={iconSize} width={iconSize} src='icons/MeasurementV4.png' alt='Measurements Icon'/>
                    <div className='w-full'>
                        Measurements
                    </div>
                </button>
            </div>
        </div>
    )
}
