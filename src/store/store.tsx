import { create } from "zustand";
import { menuHotSpotType, menuItemType, modelConfigInterface, productDetailsType } from "../types/configTypes";
import { presetType } from "../types/presetTypes";

type DataStoreType = {
    modelConfig: modelConfigInterface,
    setModelConfig: (config: modelConfigInterface) => void,

    preset:presetType,
    setPreset: (preset:presetType) => void,

    menu: menuItemType[],
    setMenu: (value:menuItemType[]) => void,

    productDetails:productDetailsType,
    setProductDetails: (value:productDetailsType) => void

    expandedComponent:string,
    setExpandedComponent: (value:string) => void,

    hotspotMenu: menuHotSpotType | null,
    setHotSpotMenu: (value:menuHotSpotType | null) => void,
}

const useDataStore = create<DataStoreType>((set)=>({
    modelConfig: {} as modelConfigInterface,
    setModelConfig: (modelConfig) => set({modelConfig}),

    preset: {} as presetType,
    setPreset: (preset) => set({preset}),

    menu: [],
    setMenu: (menu) => set({menu}),

    productDetails: {} as productDetailsType,
    setProductDetails: (productDetails) => set({productDetails}),

    expandedComponent: "",
    setExpandedComponent: (expandedComponent) => set({expandedComponent}),

    hotspotMenu: null,
    setHotSpotMenu: (hotspotMenu) => set({hotspotMenu})
}))

export default useDataStore;