import { useEffect, useRef, useState } from "react";
import useDataStore from "../../store/store";
import { menuItemOptionType } from "../../types/configTypes";
import updateModelInPreset from "../../utils/updateModelInPreset";
import updateMaterialInPreset from "../../utils/updateMaterialInPreset";

export default function MenuItemsContainer(
    {
        menuId,
        isHotspotMenu = false,
        menuType = "material",
        menuOptions,
    }:{
    menuId:string,
    isHotspotMenu:boolean, 
    menuType?:string, 
    menuOptions:menuItemOptionType[]
}) {
    const store = useDataStore();
    const menuItemRef = useRef<HTMLDivElement>(null);
    const [selectedIndex,setSelectedIndex] = useState(0);
    useEffect(()=>{
      setSelectedIndex(0);
    },[]);
    
  return (
    <div
      className={`flex gap-4 flex-col w-full transition-all duration-400 ease-in-out overflow-hidden cursor-default
        ${
            (store.expandedComponent === menuId || isHotspotMenu)
            ? "opacity-100 border-t-4 border-[#65646412] bg-[#FAFAFA]"
            : "opacity-0"
            }
        `}
      style={
        (store.expandedComponent === menuId || isHotspotMenu)
          ? { maxHeight: menuItemRef.current?.clientHeight }
          : { maxHeight: 0 }
      }
    >
      <div ref={menuItemRef} className="p-2">
        {menuOptions.length>1 && <div className="flex gap-4 xl:gap-6 border-b border-[#aaa7a72e]">
          {!isHotspotMenu && menuOptions.map((option,index)=>(
            <div key={option.label+"KEYFORMENUITEM"} className={`text-[12px] xl:text-[14px] py-1 cursor-pointer ${index==selectedIndex?'text-black':'text-gray-500'}`} onClick={()=>setSelectedIndex(index)}>{option.label}</div>
          ))}
        </div>}
        {!isHotspotMenu && (
          <div key={menuOptions[selectedIndex].label} className="flex flex-col gap-[2px] lg:pb-6">
            <div className={`py-1 text-[13px] xl:text-[15px]`}>{menuOptions[selectedIndex].label}</div>
            {/* overflow not working in this */}
            <div className="flex gap-4 overflow-x-auto w-full">
              {menuOptions[selectedIndex].baseMaps.map((material) => (
                <div
                  onClick={() => {
                    if (menuType == "model" && material.target)
                      store.setPreset(
                        updateModelInPreset(
                          material.target,
                          menuOptions[selectedIndex].baseMaps,
                          store.preset
                        )
                      );
                    else if (menuType == "material" && menuOptions[selectedIndex].target)
                      store.setPreset(
                        updateMaterialInPreset(
                          menuOptions[selectedIndex].target,
                          material.label,
                          material.id,
                          store.preset
                        )
                      );
                  }}
                  key={material.id}
                  className="w-14 h-14 cursor-pointer shrink-0"
                >
                  <img
                    src={material.icon}
                    alt={material.label}
                    className="w-14 h-14 rounded"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        {isHotspotMenu && menuOptions.map((option) => (
        <div key={option.label} className="flex flex-col gap-[2px] lg:pb-6">
            <div className={`py-1 text-[13px] xl:text-[15px]`}>{option.label}</div>
            <div className="flex gap-4 overflow-x-auto">
              {option.baseMaps.map((material) => (
                <div
                  onClick={() => {
                    if (menuType == "model" && material.target)
                      store.setPreset(
                        updateModelInPreset(
                          material.target,
                          option.baseMaps,
                          store.preset
                        )
                      );
                    else if (menuType == "material" && option.target)
                      store.setPreset(
                        updateMaterialInPreset(
                          option.target,
                          material.label,
                          material.id,
                          store.preset
                        )
                      );
                  }}
                  key={material.id}
                  className="flex cursor-pointer shrink-0"
                >
                  <img
                    src={material.icon}
                    alt={material.label}
                    className="w-10 h-10 rounded"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
