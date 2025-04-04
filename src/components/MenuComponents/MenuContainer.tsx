import useDataStore from '../../store/store';
import { menuItemType } from '../../types/configTypes';
import MenuItemsContainer from './MenuItemsContainer';

export default function MenuContainer() {
    const store = useDataStore();

    function handleClick(menu:menuItemType){
        if(menu.id!=store.expandedComponent){
            store.setExpandedComponent(menu.id)
            store.setAllowHotspots({
                for:"comfort",
                active:store.allowHotspots.active,
                activeMenuItemId:"",
                activeData:[]
            })
        }
        else{
            store.setExpandedComponent('')
            store.setAllowHotspots({
                for:"",
                active:store.allowHotspots.active,
                activeMenuItemId:"",
                activeData:[]
            })
        }
    }

  return (
    <div className='p-4 bg-white flex flex-col gap-4 shadow-md lg:shadow-none rounded-md'>
        {store.menu.map((menu,index) => {
            // console.log(index<data.length-1)
            return (
                <div key={menu.id} className={`flex flex-col gap-2 pb-4 ${index<store.menu.length-1 && 'border-b border-[#aaa7a72e] pb-3'} `}>
                    <div onClick={()=>handleClick(menu)} className='flex justify-between items-center cursor-pointer'>
                        <div className=' font-medium'>{menu.label}</div>
                        <div>
                        <img src={'/images/arrow.png'} alt={'down arrow'} className={`w-4 h-4 ${store.expandedComponent==menu.id ? 'rotate-180': 'rotate-0'}`} />
                        </div>
                    </div>
                    {/* <div className={`flex gap-4 flex-col w-full transition-all duration-400 ease-in-out overflow-hidden
                        ${store.expandedComponent === menu.id ? 'opacity-100 border-t-4 border-[#65646412] bg-[#FAFAFA]' : 'opacity-0'}
                    `}
                        style={store.expandedComponent === menu.id ? { maxHeight: menuItemRef.current?.clientHeight } : { maxHeight: 0 } }
                    >
                        <div ref={menuItemRef} className='p-2'>
                            {menu.options.map((option) => (
                                <div key={option.label} className='flex flex-col gap-[2px] lg:pb-6'>
                                    <div className={`py-1 text-[14px]`}>{option.label}</div>
                                    <div className='flex gap-4 overflow-x-auto'>
                                        {option.baseMaps.map((material) => (
                                            <div onClick={()=>{
                                                if(menu.type=='model' && material.target) store.setPreset(updateModelInPreset(material.target,option.baseMaps,store.preset))
                                                else if(menu.type=='material' && menu.target) store.setPreset(updateMaterialInPreset(menu.target,material.label,material.id,store.preset))
                                            }} key={material.id} className='flex'>
                                                <img src={material.icon} alt={material.label} className='w-14 h-14 rounded' />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div> */}
                    <MenuItemsContainer isHotspotMenu={false} menuId={menu.id} menuOptions={menu.options} menuType={menu.type}/>
                </div>
            )})
        }
    </div>
  )
}
