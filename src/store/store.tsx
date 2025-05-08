import { create } from "zustand";
import { menuHotSpotType, activeHotspots, menuItemType, modelConfigInterface, productDetailsType, preconfiguredMenuItemType } from "../types/configTypes";
import { presetType } from "../types/presetTypes";
import * as THREE from 'three';
import { MeshTranlationDataItemType } from "../types/viewerTypes";
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

    allowHotspots: activeHotspots, // coils | comfort
    setAllowHotspots:(value:activeHotspots)=> void,

    outLineObjects:THREE.Object3D<THREE.Object3DEventMap>[],
    setOutLineObjects: (value:THREE.Object3D<THREE.Object3DEventMap>[]) => void,

    expandModel:boolean,
    setExpandModel:(value:boolean)=>void,
    
    enableButtons:boolean,
    setEnableButtons:(value:boolean)=>void,
    
    initialAnimationCompleted:boolean,
    setInitialAnimationCompleted:(value:boolean)=>void,

    meshTranslationData: {[key:string]: MeshTranlationDataItemType}
    setMeshTranslationData: (value: {[key:string]: MeshTranlationDataItemType}) =>void,

    preconfiguredMenu:preconfiguredMenuItemType[],
    setPreconfiguredMenu: (value:preconfiguredMenuItemType[]) => void,
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
    setHotSpotMenu: (hotspotMenu) => set({hotspotMenu}),

    allowHotspots:{
        for:"",
        active:false,
        activeMenuItemId:"",
        activeData:[],
    },
    setAllowHotspots: (allowHotspots)=>set({allowHotspots}),

    outLineObjects:[],
    setOutLineObjects:(outLineObjects) =>set({outLineObjects}),

    expandModel:true,
    setExpandModel:(expandModel)=>set({expandModel}),
    
    enableButtons:false,
    setEnableButtons:(enableButtons)=>set({enableButtons}),

    initialAnimationCompleted:false,
    setInitialAnimationCompleted:(initialAnimationCompleted:boolean)=>set({initialAnimationCompleted}),

    meshTranslationData: {},
    setMeshTranslationData: (meshTranslationData:{[key:string]: MeshTranlationDataItemType}) => set({meshTranslationData}),

    preconfiguredMenu: [],
    setPreconfiguredMenu: (preconfiguredMenu:preconfiguredMenuItemType[]) => set({preconfiguredMenu})
}))

export default useDataStore;