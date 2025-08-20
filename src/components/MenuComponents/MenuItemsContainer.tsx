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
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(null);
  const [selectedMaterialLeft, setSelectedMaterialLeft] = useState<string | null>(null);
const [selectedMaterialRight, setSelectedMaterialRight] = useState<string | null>(null);
// Menu 3 specific selection states
const [menu3SelectedLeft, setMenu3SelectedLeft] = useState<string | null>(null);
const [menu3SelectedRight, setMenu3SelectedRight] = useState<string | null>(null);


  // useEffect(() => {
  //   setSelectedIndex(0);
  //   // Set initial selected material for menu1 and menu2
  //   if ((menuId === "menu1" || menuId === "menu2") && menuOptions[0]?.baseMaps?.[0]) {
  //     setSelectedMaterialId(menuOptions[0].baseMaps[0].id);
  //   }
    
  // }, [menuId, menuOptions]);



// useEffect(() => {
//   if ((menuId === "menu1" || menuId === "menu2") && menuOptions[0]?.baseMaps?.[0]) {
//     const configuration = store.preset?.configuration || store.preset;

//     let matched = false;

//     if (configuration) {
//       console.log("🔍 Checking preset config for", menuId, configuration);

//       menuOptions.forEach((option, index) => {
//         option.baseMaps?.forEach((material) => {
//           option.target?.forEach((targetPart) => {
//             console.log("➡️ Checking target", targetPart);

//             const modelConfig = configuration[targetPart.model];
//             const selectedPart = modelConfig?.parts?.[targetPart.part];
//             console.log("🎯 Found part", selectedPart, "for material", material.id);

//             if (selectedPart?.id === material.id) {
//               console.log("✅ Match found for menu", menuId, "→", material.label);
//               setSelectedMaterialId(material.id);
//               setSelectedIndex(index);
//               matched = true;
//             }
//           });
//         });
//       });
//     }

//     if (!matched) {
//       console.log("⚠️ No match found → defaulting to 0th");
//       setSelectedIndex(0);
//       setSelectedMaterialId(menuOptions[0].baseMaps[0].id);
//     }
//   }
// }, [store.preset, menuId, menuOptions]);



// useEffect(() => {
//   if (!menuOptions?.[0]?.baseMaps?.[0]) return;
//   const configuration = store.preset?.configuration || store.preset;
//   if (!configuration) return;

//   let matched = false;
//   console.log("🔍 Checking preset config for", menuId, configuration);

//   menuOptions.forEach((option, index) => {
//     option.baseMaps?.forEach((material) => {
//       // ----------------------
//       // CASE 1: Menu1 (model)
//       // ----------------------
//       if (menuId === "menu1") {
//         const targetModel = material.target as string; // "Cover22"
//         const modelConfig = configuration[targetModel];

//         if (modelConfig?.visible) {
//           console.log("✅ Match found for Menu1 →", material.label);
//           setSelectedMaterialId(material.id);
//           setSelectedIndex(index);
//           matched = true;
//         }
//       }

//       // ----------------------
//       // CASE 2: Menu2 (material)
//       // ----------------------
//       if (menuId === "menu2") {
//         option.target?.forEach((targetPart) => {
//           const modelConfig = configuration[targetPart.model];
//           const selectedPart = modelConfig?.parts?.[targetPart.part];

//           if (selectedPart?.id === material.id) {
//             console.log("✅ Match found for Menu2 →", material.label);
//             setSelectedMaterialId(material.id);
//             setSelectedIndex(index);
//             matched = true;
//           }
//         });
//       }
//     });
//   });

//   // ----------------------
//   // fallback logic
//   // ----------------------
//   if (!matched) {
//     if (menuId === "menu1" && menuOptions[0]?.baseMaps?.[1]) {
//       console.log("⚠️ No match found → fallback to index 1 (Menu1)");
//       setSelectedIndex(1);
//       setSelectedMaterialId(menuOptions[0].baseMaps[1].id);
//     } else {
//       console.log("⚠️ No match found → fallback to index 0");
//       setSelectedIndex(0);
//       setSelectedMaterialId(menuOptions[0].baseMaps[0].id);
//     }
//   }
// }, [store.preset, menuId, menuOptions]);



useEffect(() => {
  if (!menuOptions?.[0]?.baseMaps?.[0]) return;

  // ----------------------
  // Only handle menu1 & menu2 via configuration matching
  // ----------------------
  if (menuId === "menu1" || menuId === "menu2") {
    const configuration = store.preset?.configuration || store.preset;
    if (!configuration) return;

    let matched = false;
    menuOptions.forEach((option, index) => {
      option.baseMaps?.forEach((material) => {
        if (menuId === "menu1") {
          const targetModel = material.target as string;
          const modelConfig = configuration[targetModel];
          if (modelConfig?.visible) {
            setSelectedMaterialId(material.id);
            setSelectedIndex(index);
            matched = true;
          }
        }

        if (menuId === "menu2") {
          option.target?.forEach((targetPart) => {
            const modelConfig = configuration[targetPart.model];
            const selectedPart = modelConfig?.parts?.[targetPart.part];
            if (selectedPart?.id === material.id) {
              setSelectedMaterialId(material.id);
              setSelectedIndex(index);
              matched = true;
            }
          });
        }
      });
    });

    // fallback for menu1 & 2
    if (!matched) {
      if (menuId === "menu1" && menuOptions[0]?.baseMaps?.[1]) {
        setSelectedIndex(1);
        setSelectedMaterialId(menuOptions[0].baseMaps[1].id);
      } else {
        setSelectedIndex(0);
        setSelectedMaterialId(menuOptions[0].baseMaps[0].id);
      }
    }

    return; // important: exit useEffect here for menu1 & 2
  }

  // ----------------------
  // Menu3 & Menu4 default selections
  // ----------------------
if (menuId === "menu3" && menuOptions[0]?.baseMaps?.[0]) {
  const defaultLeft = menuOptions[0].baseMaps[0].id;
  const defaultRight = menuOptions[0].baseMaps[1]?.id || defaultLeft;

  setMenu3SelectedLeft(defaultLeft);
  setMenu3SelectedRight(defaultRight);
}

  else if (menuId === "menu4" && menuOptions[0]?.baseMaps?.[1]) {
  const defaultId = menuOptions[0].baseMaps[1].id;

  setSelectedMaterialLeft(defaultId);
  setSelectedMaterialRight(defaultId);
}

}, [store.preset, menuId, menuOptions]);











  // Function to check if a material is currently selected/active
  const isMaterialSelected = (materialId: string) => {
    if (menuId !== "menu1" && menuId !== "menu2") return false;
    return selectedMaterialId === materialId;
  };

  // Function to calculate tooltip position based on item's position relative to container center
  const getTooltipTransform = (itemIndex: number, totalItems: number) => {
    const containerWidth = menuItemRef.current?.clientWidth || 0;
    const itemWidth = 72; // Fixed width of each item
    const gap = 16; // Gap between items (gap-4 = 1rem = 16px)
    
    // Calculate the total width of all items including gaps
    const totalItemsWidth = (totalItems * itemWidth) + ((totalItems - 1) * gap);
    
    // Calculate the starting position (left edge of first item)
    const startX = (containerWidth - totalItemsWidth) / 2;
    
    // Calculate the center position of the current item
    const itemCenterX = startX + (itemIndex * (itemWidth + gap)) + (itemWidth / 2);
    
    // Calculate the container center
    const containerCenterX = containerWidth / 2;
    
    // Calculate the relative position from container center
    const relativePosition = itemCenterX - containerCenterX;
    
    // Determine transform based on position
    if (relativePosition < -50) {
      // Item is significantly left of center - show tooltip to the right
      return "translateX(-17%)";
    } else if (relativePosition > 50) {
      // Item is significantly right of center - show tooltip to the left
      return "translateX(-53%)";
    } else {
      // Item is near center - show tooltip centered
      return "translateX(-50%)";
    }
  };

  // const handleMaterialClick = (material: any) => {
  //   // Set selected material for menu1 and menu2
  //   if (menuId === "menu1" || menuId === "menu2") {
  //     setSelectedMaterialId(material.id);
  //   }

  //   // Execute the original click logic
  //   if (menuType === "model" && material.target) {
  //     store.setPreset(
  //       updateModelInPreset(
  //         material.target,
  //         menuOptions[selectedIndex].baseMaps,
  //         store.preset
  //       )
  //     );
  //   } else if (
  //     menuType === "material" &&
  //     menuOptions[selectedIndex].target
  //   ) {
  //     store.setPreset(
  //       updateMaterialInPreset(
  //         menuOptions[selectedIndex].target,
  //         material.materialkey || material.key||material.label,

  //         material.id,
  //         store.preset
  //       )
  //     );
  //   }
  // };
// const handleMaterialClick = (material: any) => {
//   // Set selected material for menu1, menu2, menu3, menu4
//   if (["menu1", "menu2", "menu3", "menu4"].includes(menuId)) {
//     setSelectedMaterialId(material.id);
//   }

//   // Execute the original click logic
//   if (menuType === "model" && material.target) {
//     store.setPreset(
//       updateModelInPreset(
//         material.target,
//         menuOptions[selectedIndex].baseMaps,
//         store.preset
//       )
//     );
//   } else if (
//     menuType === "material" &&
//     menuOptions[selectedIndex].target
//   ) {
//     store.setPreset(
//       updateMaterialInPreset(
//         menuOptions[selectedIndex].target,
//         material.materialkey || material.key || material.label,
//         material.id,
//         store.preset
//       )
//     );
//   }
// };
const handleMaterialClick = (material: any) => {
  // Menu 1 & 2
  if (["menu1", "menu2"].includes(menuId)) {
    setSelectedMaterialId(material.id);
  }

  // Menu 3 left/right
  if (menuId === "menu3") {
    const activeLabel = menuOptions[selectedIndex].label.toLowerCase();
    if (activeLabel.includes("left")) {
      setMenu3SelectedLeft(material.id);
    } else if (activeLabel.includes("right")) {
      setMenu3SelectedRight(material.id);
    }
  }

  // Menu 4 left/right
  if (menuId === "menu4") {
    const activeLabel = menuOptions[selectedIndex].label.toLowerCase();
    if (activeLabel.includes("left")) {
      setSelectedMaterialLeft(material.id);
    } else if (activeLabel.includes("right")) {
      setSelectedMaterialRight(material.id);
    }
  }

  // Original preset update logic
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
        material.materialkey || material.key || material.label,
        material.id,
        store.preset
      )
    );
  }
};
  return (
    <div
      className={`flex gap-4 flex-col w-full transition-all duration-400 ease-in-out overflow-visible relative z-[0] cursor-default
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
      // ======== MENU 3 (Contour Design) ========
      <div className="flex flex-col gap-6 pt-3 lg:pb-6">
        {[0, 3].map((startIdx, groupIdx) => (
          <div key={`menu3-group-${groupIdx}`} className="flex flex-col gap-2">
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-black">
                {groupIdx === 0 ? "Naturals Latex Foam:" : "Performance Latex Foam:"}
              </span>
              <span className="text-xs text-gray-600">
                {groupIdx === 0
                  ? "Naturals Latex: Great for those seeking a responsive, feel made from natural materials. Great for those seeking a traditional feel."
                  : "Performance Latex: For those seeking pressure-relief, memory foam is designed to relieve pressure from sensitive areas of the body."}
              </span>
            </div>
            <div className="relative overflow-visible z-10">
              <div className="flex gap-4 flex-wrap">
                {menuOptions[selectedIndex].baseMaps
                  .slice(startIdx, startIdx + 3)
                  .map((material, materialIndex) => (
                    <div
                      key={material.id}
                      onClick={() => handleMaterialClick(material)}
                      className="flex flex-col items-center gap-1 cursor-pointer w-20"
                    >
                      <div
  className={`relative group rounded-xl border ${
    (menuOptions[selectedIndex]?.label.toLowerCase().includes("left") &&
      menu3SelectedLeft === material.id) ||
    (menuOptions[selectedIndex]?.label.toLowerCase().includes("right") &&
      menu3SelectedRight === material.id)
      ? "bg-gray-200 border-gray-400 border"
      : "border border-transparent"
  } transition-all p-2 text-center`}
  style={{ width: "72px", boxSizing: "border-box" }}
>


                        <img
                          src={material.icon}
                          alt={material.label}
                          className="w-14 h-14 object-contain"
                        />
                        {material.description && (
                          <div
                            className="absolute bottom-full mb-2 w-64 z-50 bg-gray-200 text-gray-800 text-xs rounded-lg px-3 py-2 shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 text-justify"
                            style={{
                              left: `50%`,
                              transform: getTooltipTransform(materialIndex, 3)
                            }}
                          >
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
      // ======== MENU 4 (Support Layer) ========
      <div className="flex flex-col gap-6 pt-3 lg:pb-6">
        <div className="grid grid-cols-4 gap-4">
          {menuOptions[selectedIndex].baseMaps.map((material) => (
            <div
  key={material.id}
  onClick={() => {
    if (menuOptions[selectedIndex]?.label?.toLowerCase().includes("left")) {
      setSelectedMaterialLeft(material.id);
    } else if (menuOptions[selectedIndex]?.label?.toLowerCase().includes("right")) {
      setSelectedMaterialRight(material.id);
    }
    handleMaterialClick(material);
  }}
  className="flex flex-col items-center gap-1 cursor-pointer w-20"
>
  <div
    className={`rounded-xl border ${
      (menuOptions[selectedIndex]?.label?.toLowerCase().includes("left") && selectedMaterialLeft === material.id) ||
      (menuOptions[selectedIndex]?.label?.toLowerCase().includes("right") && selectedMaterialRight === material.id)
        ? "bg-gray-200 border-gray-400 border"
        : "border border-transparent"
    } transition-all p-2 text-center`}
    style={{ width: "72px", boxSizing: "border-box" }}
  >
    <img
      src={material.icon}
      alt={material.label}
      className="w-14 h-14 object-contain"
    />
    <div className="text-xs font-medium mt-1 w-full text-center">
      {material.label}
    </div>
  </div>
</div>

          ))}
        </div>

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
    ) : (
      // ======== MENU 1 & 2 ========
      <div
        key={menuOptions[selectedIndex].label}
        className="flex flex-col gap-4 pt-3 lg:pb-6"
      >
        {menuOptions[selectedIndex].baseMaps.map((material) => (
          <div
            key={material.id}
            onClick={() => handleMaterialClick(material)}
            className="flex items-start gap-4 cursor-pointer"
          >
            <div
              className={`rounded-xl transition-all p-2 text-center shrink-0 ${
                isMaterialSelected(material.id)
                  ? "bg-gray-200 border-gray-400 border"
                  : "border border-transparent"
              }`}
              style={{ width: "90px", boxSizing: "border-box" }}
            >
              <img
                src={material.icon}
                alt={material.label}
                className="w-14 h-14 object-contain ml-[9px] mt-[4px]"
              />
              <div className="text-xs font-medium mt-1">
                {material.label}
              </div>
            </div>
            <div className="text-sm text-black leading-snug">
              <span className="font-semibold">{material.label}:</span>{" "}
              <span className="text-gray-600">{material.description || "No description available."}</span>
            </div>
          </div>
        ))}
      </div>
    )}
  </>
)}


{isHotspotMenu &&
  menuOptions.map((option, optionIdx) => (
    <div key={option.label + "-hotspot"} className="flex flex-col gap-6 pt-3 lg:pb-6">
      {[0, 3].map((startIdx, groupIdx) => (
        <div key={`hotspot-group-${optionIdx}-${groupIdx}`} className="flex flex-col gap-2">
          <div className="grid grid-cols-3 gap-4">
            {option.baseMaps.slice(startIdx, startIdx + 3).map((material) => (
              <div
                key={material.id}
                onClick={() => handleMaterialClick(material)}
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
                  <div className="text-xs font-medium mt-1">{material.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ))}

      </div>
    </div>
  );
}