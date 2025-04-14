export default function getPrice(models, preset, discount) {
  let total = 0
  let originalPrice = 0
  if (!models || !preset || models == null || preset == null) return 0

  Object.entries(preset).forEach(([key, value]) => {
    let tempTotal = 0;
    if(value.visible){
      tempTotal += models[key]?.price || 0
      if ( value.parts) {
        const parts = Object.entries(value.parts)
        parts.forEach(([part, { material }]) => {
          tempTotal += models[key]?.parts[part]?.materials[material]?.price || 0
        })
      }
    }
    // console.log("--->",key,tempTotal);
    total += tempTotal
  })
  originalPrice = total
  if (discount) {
    total -= total * (discount / 100)
  }
  return {
    price: total,
    originalPrice,
  }
}
