import { modelConfigInterface } from "../types/configTypes";

export default function intializePreset(modelConfig:modelConfigInterface) {
    // creating preset with default all items visible true
   return Object.entries(modelConfig).reduce(
    (aggr, [modelName, modelDetails]) => {
      const parts = Object.keys(modelDetails.parts).length > 0 
        ? Object.entries(modelDetails.parts).reduce((aggr, [partName, partDetails]) => {
            if (Object.keys(partDetails.materials).length > 0) {
              return {
                ...aggr,
                [partName]: {
                  material: Object.keys(partDetails.materials)[0],
                  id: modelDetails.parts[partName].materials[
                    Object.keys(partDetails.materials)?.[0]
                  ]?.id,
                },
              };
            }
            return aggr;
          }, {})
        : {};
  
      // Only include non-empty parts
      return {
        ...aggr,
        [modelName]: {
          visible: true,
          ...(Object.keys(parts).length > 0 ? { parts } : {}),
        },
      };
    },
    {}
  );
}
