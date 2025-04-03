export type presetPartType = {
    material:string,
    id:string
}

export type presetItemType = {
    visible:boolean,
    parts?: {[key:string]:presetPartType}
}

export type presetType = {
    [key:string]:presetItemType
}