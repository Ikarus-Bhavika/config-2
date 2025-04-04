export type modelMaterialType = {
    id:string,
    name:string,
    price:number,
    roughness:number,
    roughnessMap:string | null,
    metalness:number,
    metalnessMap:string | null,
    normalMap:string | null,
    reflectivity:number,
    opacity:number,
    emissive:string,
    emissiveIntensity:number,
    tiling:{x:number,y:number},
    doubleSide:boolean,
    baseMap:string,
    hexCode:string,
}

export type configModelPartType = {
    name:string,
    target:string[],
    materialGroups:string[],
    materials: {[key:string]:modelMaterialType}
}

export type configModelItemType = {
    name:string,
    modelSrc:string,
    parts:{[key:string]:configModelPartType},
    animations:string[],
    price:number
}

export type menuItemBaseMapType = {
    id:string,
    label:string,
    icon:string
    hexCode?:string,
    target?:string
}

export type menuItemOptionType = {
    label:string,
    baseMaps:menuItemBaseMapType[]
}

export type menuTargetType = {
    model:string,
    part:string
}

export type menuItemType = {
    id:string,
    label:string,
    type:string,
    target?:menuTargetType[],
    options: menuItemOptionType[],
}

export interface modelConfigInterface {
    [key:string] : configModelItemType
}

export type productDetailsType = {
    title:string,
    description: string
}

export type configType = {
    models: modelConfigInterface,
    menu: menuItemType[],
    productDetails: productDetailsType
}

export type menuHotSpotType = {
    [key:string]:(
        menuItemOptionType & {target:menuTargetType[]}
    )[]
}
export type activeHotspots = {
    for:string,
    active: boolean,
    activeMenuItemId:string,
    activeData:(menuItemOptionType & {
        target: menuTargetType[];
    })[],
}