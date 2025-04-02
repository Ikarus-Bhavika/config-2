
export default function getTotalModelAndMaterialsToLoad(currentProduct) {
    let totalModels = 0;
    let totalMaterials = 0;
    currentProduct && Object.keys(currentProduct).forEach((key)=>{
        const visible = currentProduct[key].visible
        const parts = currentProduct[key].parts;
        if(visible){
            totalModels++;
        }
        visible && parts && Object.keys(parts).forEach((partKey)=>{
            if(parts[partKey].material || parts[partKey].id){
                totalMaterials++;
            }
        })

    })

    return {totalModels,totalMaterials}
}
