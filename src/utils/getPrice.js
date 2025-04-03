export default function getPrice(models, preset, discount) {
  let total = 0
  let originalPrice = 0
  if (!models || !preset || models == null || preset == null) return 0

  Object.entries(preset).forEach(([key, value]) => {
    if (value?.visible && value.parts) {
      total += models[key]?.price || 0
      const parts = Object.entries(value.parts)
      parts.forEach(([part, { material }]) => {
        total += models[key]?.parts[part]?.materials[material]?.price || 0
      })
    }
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
