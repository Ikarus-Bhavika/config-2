import { updatedMappingItemType } from "../types/configTypes";
import * as THREE from 'three';
export default async function cacheTexture(updatedMapping: updatedMappingItemType[],textureCache: {[key:string]:THREE.Texture}) {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = "anonymous";

    const promiseMap = [];

    for (let i = 0; i < updatedMapping.length; i++) {
        const d = updatedMapping[i];

        if (d.baseMap && !textureCache[d.baseMap]) {
            const baseMapPromise = textureLoader.loadAsync(d.baseMap).then((texture) => {
                textureCache[d.baseMap] = texture;
                // console.log("baseMap loaded:", textureCache);
            });
            promiseMap.push(baseMapPromise);
        }

        if (d.normalMap && !textureCache[d.normalMap]) {
            const normalMapPromise = textureLoader.loadAsync(d.normalMap).then((texture) => {
                textureCache[d.normalMap] = texture;
                // console.log("normalMap loaded:", textureCache);
            });
            promiseMap.push(normalMapPromise);
        }

        if (d.roughnessMap && !textureCache[d.roughnessMap]) {
            const roughnessMapPromise = textureLoader.loadAsync(d.roughnessMap).then((texture) => {
                textureCache[d.roughnessMap] = texture;
                // console.log("roughnessMap loaded:", textureCache);
            });
            promiseMap.push(roughnessMapPromise);
        }

        if (d.metalnessMap && !textureCache[d.metalnessMap]) {
            const metalnessMapPromise = textureLoader.loadAsync(d.metalnessMap).then((texture) => {
                textureCache[d.metalnessMap] = texture;
                // console.log("metalnessMap loaded:", textureCache);
            });
            promiseMap.push(metalnessMapPromise);
        }
    }

    // Now wait for all textures to be loaded
    await Promise.all(promiseMap)
    // console.log("textureCache",textureCache);

    return textureCache;
}
