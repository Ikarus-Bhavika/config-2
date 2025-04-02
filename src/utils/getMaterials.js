export function getMaterials(prod, material, key, partName) {
  const sections = [];

  for (const model in prod.models) {
    sections.push(model);
  }

  for (const section of sections) {
    const parts = prod.models[section].parts;
    for (const part in parts) {
      if (
        parts[part].materials[material] &&
        section === key &&
        part === partName[0]
      ) {
        // if(parts[part].materials[material].isFromModel){
        //     return {
        //         isFromModel:parts[part].materials[material].isFromModel,
        //         name: parts[part].materials[material].name,
        //         target: parts[part].target,
        //         index: parts[part].materials[material].materialIndex,
        //     }
        // }
        return {
          part: part,
          target: parts[part].target,
          ...parts[part].materials[material],
        };
      }
    }
  }

  return null;
}
