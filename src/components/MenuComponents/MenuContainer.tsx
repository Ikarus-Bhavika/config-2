import { useState } from "react";
import useDataStore from "../../store/store";
import MenuItemsContainer from "./MenuItemsContainer";
import { motion, AnimatePresence } from "framer-motion";

export default function MenuContainer() {
  const store = useDataStore();
  const [isPresetOpen, setIsPresetOpen] = useState(true);

  function handleClick(id: string) {
    if (id.length > 0) {
      store.setExpandedComponent(id);

      if (id === "menu3") {
        store.setAllowHotspots({
          for: "comfort",
          active: store.allowHotspots.active,
          activeMenuItemId: "",
          activeData: [],
        });
      } else if (id === "menu4") {
        store.setAllowHotspots({
          for: "coils",
          active: store.allowHotspots.active,
          activeMenuItemId: "",
          activeData: [],
        });
      } else {
        store.setAllowHotspots({
          for: "",
          active: store.allowHotspots.active,
          activeMenuItemId: "",
          activeData: [],
        });
      }
    } else {
      store.setExpandedComponent("");
      store.setAllowHotspots({
        for: "",
        active: store.allowHotspots.active,
        activeMenuItemId: "",
        activeData: [],
      });
    }
  }

  return (
    <div className="p-4 bg-white flex flex-col gap-4 shadow-md lg:shadow-none relative rounded-md">
      {/* TogetherBed Models Dropdown */}
      <div className="flex flex-col gap-2">
        <div
          onClick={() => setIsPresetOpen(!isPresetOpen)}
          className="flex justify-between items-center cursor-pointer"
        >
          <div className="font-medium">TogetherBed™ Models</div>
          <img
            src="/images/arrow.png"
            alt="Toggle"
            className={`w-4 h-4 transition-transform duration-200 ${
              isPresetOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>

        {isPresetOpen && (
          <>
            <p className="text-sm text-black-600">
              Design the perfect mattress for you and your sleeping partner here! Choose one of your standard builds, then customize the layers to your preference.
            </p>
            <div className="flex flex-col gap-4 px-2 pt-3 pb-3 border-b border-[#aaa7a72e]">
              {store.preconfiguredMenu.map((menu) => {
                const isSelected = store.preset === menu.preset;

                return (
                  <div
                    key={menu.label}
                    onClick={() => store.setPreset(menu.preset)}
                    className="flex items-start gap-4 cursor-pointer"
                  >
                    {/* LEFT: icon + label inside grey box */}
                    <div
                      className={`rounded-xl border transition-all shrink-0 ${
                        isSelected ? "bg-gray-200 border-gray-400" : "border-transparent"
                      }`}
                      style={{
                        width: "72px",
                        padding: "8px",
                        textAlign: "center",
                        boxSizing: "border-box",
                      }}
                    >
                      <div className="flex flex-col items-center justify-center">
                        <img
                          src={menu.icon}
                          className="w-14 h-14 object-contain"
                          alt={menu.label}
                        />
                        <div className="text-xs font-medium">{menu.label}</div>
                      </div>
                    </div>

                    {/* RIGHT: description text */}
                    <div className="text-sm text-black-700 leading-snug">
  <span className="font-semibold">{menu.label}:</span>{" "}
  <span>{menu.description}</span>
</div>

                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* ⬇️ Separator line */}
      <hr className="border-t border-[#aaa7a72e] my-2" />

      {/* Other Menus */}
      {store.menu.map((menu, index) => {
        const isOpen = store.expandedComponent === menu.id;

        return (
          <div
            key={menu.id}
            className="flex flex-col gap-1 pb-4 border-b border-[#aaa7a72e]"
          >
            {/* Heading area always visible & clickable */}
            <div
              onClick={() => handleClick(isOpen ? "" : menu.id)}
              className="w-full flex flex-col gap-1 cursor-pointer py-3"
            >
              <div className="flex justify-between items-start w-full">
                <div className="flex flex-col">
                  <div className="font-medium">{menu.label}</div>
                  {isOpen && menu.description && (
                    <p className="text-sm text-black-600 pt-1">{menu.description}</p>
                  )}
                </div>
                <img
                  src={"/images/arrow.png"}
                  alt={"down arrow"}
                  className={`w-4 h-4 mt-1 transition-transform duration-300 ease-in-out ${
                    isOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </div>
            </div>

            {/* Dropdown content with animation */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="menu-content"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <MenuItemsContainer
                    isHotspotMenu={false}
                    menuId={menu.id}
                    menuOptions={menu.options}
                    menuType={menu.type}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
