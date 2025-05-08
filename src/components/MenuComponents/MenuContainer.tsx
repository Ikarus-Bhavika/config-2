import useDataStore from "../../store/store";
import MenuItemsContainer from "./MenuItemsContainer";

export default function MenuContainer() {
  const store = useDataStore();

  function handleClick(id: string) {
    // if(id!=store.expandedComponent){
    if (id.length > 0) {
      console.log("==>");
      store.setExpandedComponent(id);
      if (id == "menu3") {
        store.setAllowHotspots({
          for: "comfort",
          active: store.allowHotspots.active,
          activeMenuItemId: "",
          activeData: [],
        });
      } else if (id == "menu4") {
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
      <div
        key={"menu.id"}
        className={`cursor-pointer flex flex-col gap-2`}
      >
        <div
          onClick={() => handleClick("")}
          className="flex justify-between items-center cursor-pointer"
        >
          <div className=" font-medium">Standard builds</div>
        </div>
        <div className="overflow-x-auto flex h-24 overflow-y-hidden gap-5 w-full px-2">
            {store.preconfiguredMenu.map((menu)=>(
                <div key={menu.label} onClick={()=>store.setPreset(menu.preset)} className="min-w-16 min-h-18 max-w-16 max-h-16 rounded">
                  <img src={menu.icon} className="w-full h-16 rounded"/>
                  <div className="text-[12px]">{menu.label}</div>
                </div>
            ))}
        </div>
      </div>
      {store.menu.map((menu, index) => {
        // console.log(index<data.length-1)
        return (
          <div
            onClick={() =>
              store.expandedComponent != menu.id && handleClick(menu.id)
            }
            key={menu.id}
            className={`cursor-pointer ${
              store.expandModel ? "" : "opacity-30"
            }  flex flex-col gap-2 pb-4 ${
              index < store.menu.length - 1 &&
              "border-b border-[#aaa7a72e] pb-3"
            } `}
          >
            <div
              onClick={() => handleClick("")}
              className="flex justify-between items-center cursor-pointer"
            >
              <div className=" font-medium">{menu.label}</div>
              <div>
                <img
                  src={"/images/arrow.png"}
                  alt={"down arrow"}
                  className={`w-4 h-4 ${
                    store.expandedComponent == menu.id
                      ? "rotate-180"
                      : "rotate-0"
                  }`}
                />
              </div>
            </div>
            <MenuItemsContainer
              isHotspotMenu={false}
              menuId={menu.id}
              menuOptions={menu.options}
              menuType={menu.type}
            />
          </div>
        );
      })}
      {/* <div className='absolute top-0 left-0 bg-black z-10'></div> */}
    </div>
  );
}
