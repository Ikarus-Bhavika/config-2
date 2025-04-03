import { useEffect, useRef, useState } from 'react'

export default function MenuContainer() {
    const [expandedComponent, setExpandedComponent] = useState<string>();
    const menuItemRef = useRef<HTMLDivElement>(null);
    const data = [
        {
            id: 'menu1',
            title: 'Menu 1',
            options: [
                {
                    id: 'MaterialGroup1',
                    name:"MaterialGroup1",
                    materials: [
                        { id: 'option1', name: 'Option 1', img:'/images/tempImage.png' },
                        { id: 'option2', name: 'Option 2', img:'/images/tempImage.png' },
                    ]
                },
            ]
        },
        {
            id: 'menu2',
            title: 'Menu 2',
            options: [
                {
                    id: 'MaterialGroup1',
                    name:"MaterialGroup1",
                    materials: [
                        { id: 'option1', name: 'Option 1', img:'/images/tempImage.png' },
                        { id: 'option2', name: 'Option 2', img:'/images/tempImage.png' },
                    ]
                },
            ]
        },
        {
            id: 'menu3',
            title: 'Menu 3',
            options: [
                {
                    id: 'MaterialGroup1',
                    name:"MaterialGroup1",
                    materials: [
                        { id: 'option1', name: 'Option 1', img:'/images/tempImage.png' },
                        { id: 'option2', name: 'Option 2', img:'/images/tempImage.png' },
                    ]
                },
            ]
        },
        {
            id: 'menu4',
            title: 'Menu 4',
            options: [
                {
                    id: 'MaterialGroup1',
                    name:"MaterialGroup1",
                    materials: [
                        { id: 'option1', name: 'Option 1', img:'/images/tempImage.png' },
                        { id: 'option2', name: 'Option 2', img:'/images/tempImage.png' },
                    ]
                },
            ]
        },
    ]
    
  return (
    <div className='p-4 bg-white flex flex-col gap-4 shadow-md lg:shadow-none rounded-md'>
        {
            data.map((menu,index) => (
                <div key={menu.id} className={`flex flex-col gap-2 pb-4 ${index!=data.length-1 && 'border-b border-[#aaa7a72e]'} pb-3`}>
                    <div onClick={()=>menu.id!=expandedComponent ? setExpandedComponent(menu.id) : setExpandedComponent('')} className='flex justify-between items-center'>
                        <div className=' font-medium'>{menu.title}</div>
                        <div>
                        <img src={'/images/arrow.png'} alt={'down arrow'} className={`w-4 h-4 ${expandedComponent==menu.id ? 'rotate-180': 'rotate-0'}`} />
                        </div>
                    </div>
                    <div className={`flex gap-4 flex-col w-full transition-all duration-400 ease-in-out overflow-hidden
                        ${expandedComponent === menu.id ? 'opacity-100 border-t-4 border-[#65646412] bg-[#FAFAFA] lg:pb-6' : 'opacity-0'}
                    `}
                        style={expandedComponent === menu.id ? { maxHeight: menuItemRef.current?.clientHeight } : { maxHeight: 0 } }
                    >
                        <div ref={menuItemRef} className='p-2'>
                            {menu.options.map((option) => (
                                <div key={option.id} className='flex flex-col gap-[2px]'>
                                    <div className={`py-1 text-[14px]`}>{option.name}</div>
                                    <div className='flex gap-4 overflow-x-auto'>
                                        {option.materials.map((material) => (
                                            <div key={material.id} className='flex'>
                                                <img src={material.img} alt={material.name} className='w-14 h-14 rounded' />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))
        }
    </div>
  )
}
