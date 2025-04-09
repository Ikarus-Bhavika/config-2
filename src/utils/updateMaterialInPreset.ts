import { presetType } from "../types/presetTypes";

export default function updateMaterialInPreset(
    target:{model:string,part:string}[],
    material:string,
    id:string,
    preset:presetType
) {
    const tempPreset = preset;
    target.map(({model,part})=>{
        if (tempPreset[model] && tempPreset[model].parts && tempPreset[model].parts[part]) {
            tempPreset[model].parts[part].material = material;
            tempPreset[model].parts[part].id = id;
        }
    })
    return tempPreset;
}
