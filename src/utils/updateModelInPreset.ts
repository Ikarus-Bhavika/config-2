import { menuItemBaseMapType } from '../types/configTypes'
import { presetType } from '../types/presetTypes'

export default function updateModelInPreset(
    selectedModel:string,
    options:menuItemBaseMapType[],
    preset:presetType
) {
  const tempPreset = preset;
  const optionModelNames = options.map((option)=>option.target)
  Object.keys(tempPreset).map((modelName)=>{
    if(optionModelNames.includes(modelName) && modelName!=selectedModel){
        tempPreset[modelName].visible = false;
    }else if(optionModelNames.includes(modelName) && modelName==selectedModel){
        tempPreset[modelName].visible = true;
    }
  })
  return tempPreset;
}
