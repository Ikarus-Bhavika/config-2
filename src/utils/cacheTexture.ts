// import { updatedMappingItemType } from "../types/configTypes";
// import * as THREE from 'three';
// export default async function cacheTexture(updatedMapping: updatedMappingItemType[],textureCache: {[key:string]:THREE.Texture}) {
//     const textureLoader = new THREE.TextureLoader();
//     textureLoader.crossOrigin = "anonymous";

//     const promiseMap = [];

//     for (let i = 0; i < updatedMapping.length; i++) {
//         const d = updatedMapping[i];

//         if (d.baseMap && !textureCache[d.baseMap]) {
//             const baseMapPromise = textureLoader.loadAsync(d.baseMap).then((texture) => {
//                 textureCache[d.baseMap] = texture;
//                 // console.log("baseMap loaded:", textureCache);
//             });
//             promiseMap.push(baseMapPromise);
//         }

//         if (d.normalMap && !textureCache[d.normalMap]) {
//             const normalMapPromise = textureLoader.loadAsync(d.normalMap).then((texture) => {
//                 textureCache[d.normalMap] = texture;
//                 // console.log("normalMap loaded:", textureCache);
//             });
//             promiseMap.push(normalMapPromise);
//         }

//         if (d.roughnessMap && !textureCache[d.roughnessMap]) {
//             const roughnessMapPromise = textureLoader.loadAsync(d.roughnessMap).then((texture) => {
//                 textureCache[d.roughnessMap] = texture;
//                 // console.log("roughnessMap loaded:", textureCache);
//             });
//             promiseMap.push(roughnessMapPromise);
//         }

//         if (d.metalnessMap && !textureCache[d.metalnessMap]) {
//             const metalnessMapPromise = textureLoader.loadAsync(d.metalnessMap).then((texture) => {
//                 textureCache[d.metalnessMap] = texture;
//                 // console.log("metalnessMap loaded:", textureCache);
//             });
//             promiseMap.push(metalnessMapPromise);
//         }
//     }

import { updatedMappingItemType } from "../types/configTypes";
import * as THREE from 'three';

export default async function cacheTexture(
  updatedMapping: (updatedMappingItemType | null | undefined)[],
  textureCache: { [key: string]: THREE.Texture }
) {
  const textureLoader = new THREE.TextureLoader();
  textureLoader.crossOrigin = "anonymous";

  const promiseMap: Promise<void>[] = [];

  for (let i = 0; i < updatedMapping.length; i++) {
    const d = updatedMapping[i];

    if (!d) {
      console.warn(`cacheTexture: Skipping null or undefined mapping at index ${i}`);
      continue;
    }

    // ✅ Load baseMap if not cached
    if (d.baseMap && !textureCache[d.baseMap]) {
      const baseMapPromise = textureLoader.loadAsync(d.baseMap).then((texture) => {
        textureCache[d.baseMap] = texture;
        // console.log("✅ baseMap loaded:", d.baseMap);
      }).catch((err) => {
        console.error(`❌ Failed to load baseMap: ${d.baseMap}`, err);
      });
      promiseMap.push(baseMapPromise);
    }

    // ✅ Load normalMap if not cached
    if (d.normalMap && !textureCache[d.normalMap]) {
      const normalMapPromise = textureLoader.loadAsync(d.normalMap).then((texture) => {
        textureCache[d.normalMap] = texture;
        // console.log("✅ normalMap loaded:", d.normalMap);
      }).catch((err) => {
        console.error(`❌ Failed to load normalMap: ${d.normalMap}`, err);
      });
      promiseMap.push(normalMapPromise);
    }

    // ✅ Load roughnessMap if not cached
    if (d.roughnessMap && !textureCache[d.roughnessMap]) {
      const roughnessMapPromise = textureLoader.loadAsync(d.roughnessMap).then((texture) => {
        textureCache[d.roughnessMap] = texture;
        // console.log("✅ roughnessMap loaded:", d.roughnessMap);
      }).catch((err) => {
        console.error(`❌ Failed to load roughnessMap: ${d.roughnessMap}`, err);
      });
      promiseMap.push(roughnessMapPromise);
    }

    // ✅ Load metalnessMap if not cached
    if (d.metalnessMap && !textureCache[d.metalnessMap]) {
      const metalnessMapPromise = textureLoader.loadAsync(d.metalnessMap).then((texture) => {
        textureCache[d.metalnessMap] = texture;
        // console.log("✅ metalnessMap loaded:", d.metalnessMap);
      }).catch((err) => {
        console.error(`❌ Failed to load metalnessMap: ${d.metalnessMap}`, err);
      });
      promiseMap.push(metalnessMapPromise);
    }
  }

  // 🕓 Wait for all textures to finish loading
  await Promise.all(promiseMap);

  return textureCache;
}
