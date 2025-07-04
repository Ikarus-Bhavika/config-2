import { useEffect, useRef, useState } from "react";
import useDataStore from "../../store/store";
import { menuItemOptionType } from "../../types/configTypes";
import updateModelInPreset from "../../utils/updateModelInPreset";
import updateMaterialInPreset from "../../utils/updateMaterialInPreset";

export default function MenuItemsContainer({
  menuId,
  isHotspotMenu = false,
  menuType = "material",
  menuOptions,
  
}: {
  menuId: string;
  isHotspotMenu: boolean;
  menuType?: string;
  menuOptions: menuItemOptionType[];
}) {
  const store = useDataStore();
  const menuItemRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(0);
  }, []);

  return (
    <div
      className={`flex gap-4 flex-col w-full transition-all duration-400 ease-in-out overflow-visible relative z-0 cursor-default
      ${store.expandedComponent === menuId || isHotspotMenu ? "opacity-100 border-t-4 border-[#65646412] bg-[#FAFAFA]" : "opacity-0"}`}
      style={
        store.expandedComponent === menuId || isHotspotMenu
          ? { maxHeight: menuItemRef.current?.clientHeight }
          : { maxHeight: 0 }
      }
    >
      <div ref={menuItemRef} className="p-2">
        {menuOptions.length > 1 && (
          <div className="flex gap-4 xl:gap-6 border-b border-[#aaa7a72e]">
            {!isHotspotMenu &&
              menuOptions.map((option, index) => (
                <div
                  key={option.label + "KEYFORMENUITEM"}
                  className={`text-[12px] xl:text-[14px] py-1 cursor-pointer ${
                    index === selectedIndex ? "text-black" : "text-gray-500"
                  }`}
                  onClick={() => setSelectedIndex(index)}
                >
                  {option.label}
                </div>
              ))}
          </div>
        )}

        {!isHotspotMenu && (
          <>
            {menuId === "menu3" ? (
              <div className="flex flex-col gap-6 pt-3 lg:pb-6">
                {[0, 3].map((startIdx, groupIdx) => (
                  <div key={`menu3-group-${groupIdx}`} className="flex flex-col gap-2">
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm text-black">
                        {groupIdx === 0 ? "Natural Latex Foam:" : "Performance Latex Foam:"}
                      </span>
                      <span className="text-xs text-gray-600">
                        {groupIdx === 0
                          ? "Natural Latex: Great for those seeking a responsive, feel made from natural materials. Great for those seeking a traditional feel."
                          : "Performance Latex: Great for those seeking a responsive, feel made from natural materials. Great for those seeking a traditional feel."}
                      </span>
                    </div>
                    <div className="relative overflow-visible z-10">
                      <div className="flex gap-4 flex-wrap">
                        {menuOptions[selectedIndex].baseMaps
                          .slice(startIdx, startIdx + 3)
                          .map((material) => (
                            <div
                              key={material.id}
                              onClick={() => {
                                if (menuType === "model" && material.target) {
                                  store.setPreset(
                                    updateModelInPreset(
                                      material.target,
                                      menuOptions[selectedIndex].baseMaps,
                                      store.preset
                                    )
                                  );
                                } else if (
                                  menuType === "material" &&
                                  menuOptions[selectedIndex].target
                                ) {
                                  store.setPreset(
                                    updateMaterialInPreset(
                                      menuOptions[selectedIndex].target,
                                      material.label,
                                      material.id,
                                      store.preset
                                    )
                                  );
                                }
                              }}
                              className="flex flex-col items-center gap-1 cursor-pointer w-20"
                            >
                              <div
                                className="relative group rounded-xl border border-transparent transition-all p-2 text-center"
                                style={{ width: "72px", boxSizing: "border-box" }}
                              >
                                <img
                                  src={material.icon}
                                  alt={material.label}
                                  className="w-14 h-14 object-contain"
                                />
                                {material.description && (
                                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 z-50 bg-gray-200 text-gray-800 text-xs rounded-lg px-3 py-2 shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 text-justify">
                                    {material.label} - {material.description}
                                  </div>
                                )}
                                <div className="text-xs font-medium mt-1">
                                  {material.label}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                ))}
                {(menuOptions[selectedIndex]?.label?.toLowerCase().includes("left") ||
                  menuOptions[selectedIndex]?.label?.toLowerCase().includes("right")) && (
                  <button
                    onClick={() => {
                      const activeLabel = menuOptions[selectedIndex].label.toLowerCase();
                      const fromLabel = activeLabel.includes("left") ? "Left Side" : "Right Side";
                      const toLabel = activeLabel.includes("left") ? "Right Side" : "Left Side";

                      const fromOption = menuOptions.find((opt) => opt.label === fromLabel);
                      const toOption = menuOptions.find((opt) => opt.label === toLabel);

                      if (!fromOption?.target || !toOption?.target || fromOption.target.length === 0 || toOption.target.length === 0) {
                        console.warn("❌ Missing or empty target arrays in Left/Right options.");
                        return;
                      }

                      const configuration = store.preset.configuration || store.preset;
                      const firstSourcePart = fromOption.target[0];
                      const sourceModel = configuration[firstSourcePart.model];

                      if (!sourceModel?.parts?.[firstSourcePart.part]) {
                        console.warn("❌ No material found on source side to copy");
                        return;
                      }

                      const selectedMaterial = sourceModel.parts[firstSourcePart.part];
                      const newConfig = { ...configuration };

                      toOption.target.forEach((targetPart) => {
                        if (!newConfig[targetPart.model]?.parts?.[targetPart.part]) return;
                        newConfig[targetPart.model].parts[targetPart.part] = {
                          material: selectedMaterial.material,
                          id: selectedMaterial.id,
                        };
                      });

                      store.setPreset({
                        ...store.preset,
                        configuration: newConfig,
                      });

                      console.log("✅ Copied material", selectedMaterial.material, "to", toLabel);
                    }}
                    className="bg-transparent hover:bg-gray-100 text-black text-xs px-2 py-2 rounded-md mt-2 border border-gray-400 transition-colors duration-200 inline-block w-fit"
                  >
                    Copy to {menuOptions[selectedIndex]?.label?.toLowerCase().includes("right") ? "Left" : "Right"} Side
                  </button>
                )}
              </div>
            ) : menuId === "menu4" ? (
              <div className="grid grid-cols-4 gap-4 pt-3 lg:pb-6">
                {menuOptions[selectedIndex].baseMaps.map((material) => (
                  <div
                    key={material.id}
                    onClick={() => {
                      if (menuType === "model" && material.target) {
                        store.setPreset(
                          updateModelInPreset(
                            material.target,
                            menuOptions[selectedIndex].baseMaps,
                            store.preset
                          )
                        );
                      } else if (
                        menuType === "material" &&
                        menuOptions[selectedIndex].target
                      ) {
                        store.setPreset(
                          updateMaterialInPreset(
                            menuOptions[selectedIndex].target,
                            material.label,
                            material.id,
                            store.preset
                          )
                        );
                      }
                    }}
                    className="flex flex-col items-center gap-1 cursor-pointer w-20"
                  >
                    <div
                      className="rounded-xl border border-transparent transition-all p-2 text-center"
                      style={{ width: "72px", boxSizing: "border-box" }}
                    >
                      <img
                        src={material.icon}
                        alt={material.label}
                        className="w-14 h-14 object-contain"
                      />
                      <div className="text-xs font-medium mt-1">
                        {material.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                key={menuOptions[selectedIndex].label}
                className="flex flex-col gap-4 pt-3 lg:pb-6"
              >
                {menuOptions[selectedIndex].baseMaps.map((material) => (
                  <div
                    key={material.id}
                    onClick={() => {
                      if (menuType === "model" && material.target) {
                        store.setPreset(
                          updateModelInPreset(
                            material.target,
                            menuOptions[selectedIndex].baseMaps,
                            store.preset
                          )
                        );
                      } else if (
                        menuType === "material" &&
                        menuOptions[selectedIndex].target
                      ) {
                        store.setPreset(
                          updateMaterialInPreset(
                            menuOptions[selectedIndex].target,
                            material.label,
                            material.id,
                            store.preset
                          )
                        );
                      }
                    }}
                    className="flex items-start gap-4 cursor-pointer"
                  >
                    <div
                      className="rounded-xl border border-transparent transition-all p-2 text-center shrink-0"
                      style={{ width: "72px", boxSizing: "border-box" }}
                    >
                      <img
                        src={material.icon}
                        alt={material.label}
                        className="w-14 h-14 object-contain"
                      />
                      <div className="text-xs font-medium text-center">
                        {material.label}
                      </div>
                    </div>
                    <div className="flex flex-col text-sm text-black-700 leading-snug">
                      <span className="font-semibold">{material.label}:</span>
                      <span>
                        {material.description || "No description available."}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {isHotspotMenu &&
          menuOptions.map((option) => (
            <div key={option.label} className="flex flex-col gap-[6px] lg:pb-6">
              <div className="py-1 text-[13px] xl:text-[15px] font-semibold text-black">
                {option.label}
              </div>
              <div className="flex gap-4 overflow-x-auto">
                {option.baseMaps.map((material) => (
                  <div
                    onClick={() => {
                      if (menuType === "model" && material.target)
                        store.setPreset(
                          updateModelInPreset(
                            material.target,
                            option.baseMaps,
                            store.preset
                          )
                        );
                      else if (menuType === "material" && option.target)
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
                    className="flex flex-col items-center cursor-pointer shrink-0"
                  >
                    <img
                      src={material.icon}
                      alt={material.label}
                      className="w-10 h-10 rounded"
                    />
                    <span className="text-[10px] text-center mt-1">{material.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}