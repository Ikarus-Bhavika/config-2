import { useRef } from "react";
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
        menuTarget,
    }:{
    menuId:string,
    isHotspotMenu:boolean, 
    menuType:string, 
    menuOptions:menuItemOptionType[],
    menuTarget:{
        model: string;
        part: string;
    }[]
}) {
    const store = useDataStore();
    const menuItemRef = useRef<HTMLDivElement>(null);
  return (
    <div
      className={`flex gap-4 flex-col w-full transition-all duration-400 ease-in-out overflow-hidden
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
        {menuOptions.map((option) => (
          <div key={option.label} className="flex flex-col gap-[2px] lg:pb-6">
            <div className={`py-1 text-[14px]`}>{option.label}</div>
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
                    else if (menuType == "material" && menuTarget)
                      store.setPreset(
                        updateMaterialInPreset(
                          menuTarget,
                          material.label,
                          material.id,
                          store.preset
                        )
                      );
                  }}
                  key={material.id}
                  className="flex"
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
        ))}
      </div>
    </div>
  );
}
