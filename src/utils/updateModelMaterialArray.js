import { useLoader } from "@react-three/fiber";
import { getMaterials } from "./getMaterials";
import * as THREE from "three";
import { sRGBEncoding } from "@react-three/drei/helpers/deprecated";

THREE.TextureLoader.prototype.crossOrigin = "anonymous";
const textureLoader = new THREE.TextureLoader();
textureLoader.crossOrigin = "anonymous";
const textureCache = {};

const applyTextureOnMaterial = (texture, material, type) => {
  material[type] = texture;
  material.needsUpdate = true;
};

const applyCachedTexture = async (url, material, type, tiling) => {
  if (url) {
    if (textureCache[url]) {
      applyTextureOnMaterial(textureCache[url], material, type);
    } else {
      const texture = await textureLoader.loadAsync(url);
      if (type==="map" || type=="emissiveMap") texture.colorSpace = THREE.SRGBColorSpace
      texture.encoding = sRGBEncoding;
      texture.flipY = false;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      // texture.repeat.set(5, 5);
      if (tiling && ["map", "normalMap", "metalnessMap", "roughnessMap"].includes(type)) texture.repeat.set(tiling.x, tiling.y);
      textureCache[url] = texture;
      applyTextureOnMaterial(textureCache[url], material, type);
    }

  }
};

export function getMaterialUpdate(parts, product, key) {
  let ans = [];
  if (!parts || !product || !key) {
    return ans;
  }
  //Aims to return the target[]/Nodes for each of the child.name instances
  Object.entries(parts).forEach((part, index) => {
    const temp = part[1].material;
    const res = getMaterials(product, temp, key, part);
    ans.push(res);
  });
  return ans;
}

export async function updateMaterial(updates, materialRef,isMaterialLoaded) {
  /* Exit early if no updates are provided */
  if (!updates) return;
  const {
    aoMap,
    emissiveMap,
    normalMap,
    baseMap,
    metalnessMap,
    roughnessMap,
    roughness,
    metalness,
    opacity,
    emissiveIntensity,
    emissive,
    doubleSide,
    tiling,
  } = updates;

  /* Update the Base Map Of the Material */
  await applyCachedTexture(baseMap, materialRef, "map",tiling);

  /* Setting Material Group Properties */
  aoMap ? await applyCachedTexture(aoMap, materialRef, "aoMap",tiling) : materialRef.aoMap = null;
  emissiveMap ? await applyCachedTexture(emissiveMap, materialRef, "emissiveMap",tiling) :  materialRef.emissiveMap  = null;
  normalMap ? await applyCachedTexture(normalMap, materialRef, "normalMap",tiling) :  materialRef.normalMap = null;
  metalnessMap ?  await applyCachedTexture(metalnessMap, materialRef, "metalnessMap",tiling) : materialRef.metalnessMap = null;
  roughnessMap ? await applyCachedTexture(roughnessMap, materialRef, "roughnessMap",tiling) : materialRef.roughnessMap = null;
  /* Update material settings with provided values */
  const materialSettings = {
    roughness,
    metalness,
    opacity,
    emissiveIntensity,
    emissive: new THREE.Color(`${emissive ? emissive : "#000000"}`),
    side: doubleSide ? 2 : 0,
  };

  /* Apply settings to materialRef and mark for update */
  Object.keys(materialSettings).forEach((key) => {
    if (materialSettings[key] !== undefined) {
      materialRef[key] = materialSettings[key];
      materialRef.update = true;
    }
  });

  /* Apply tiling to maps if tiling information is provided */
  if (tiling) {
    const { x: tilingX, y: tilingY } = tiling;
    ["map", "normalMap", "metalnessMap", "roughnessMap"].forEach((map) => {
      materialRef[map]?.repeat.set(tilingX, tilingY);
    });
    materialRef.update = true;
  }

  isMaterialLoaded(true);
}

export const disposeResources = (mtrl) => {
  if (mtrl.alphaMap) {
    mtrl.alphaMap.dispose();
  }
  if (mtrl.aoMap) {
    mtrl.aoMap.dispose();
  }
  if (mtrl.blendDstAlpha) {
    mtrl.blendDstAlpha.dispose();
  }
  if (mtrl.blendEquationAlpha) {
    mtrl.blendEquationAlpha.dispose();
  }
  if (mtrl.blendSrcAlpha) {
    mtrl.blendSrcAlpha.dispose();
  }
  if (mtrl.bumpMap) {
    mtrl.bumpMap.dispose();
  }
  if (mtrl.displacementMap) {
    mtrl.displacementMap.dispose();
  }
  if (mtrl.emissiveMap) {
    mtrl.emissiveMap.dispose();
  }
  if (mtrl.envMap) {
    mtrl.envMap.dispose();
  }
  if (mtrl.lightMap) {
    mtrl.lightMap.dispose();
  }
  if (mtrl.map) {
    mtrl.map.dispose();
  }
  if (mtrl.metalnessMap) {
    mtrl.metalnessMap.dispose();
  }
  if (mtrl.normalMap) {
    mtrl.normalMap.dispose();
  }
  if (mtrl.roughnessMap) {
    mtrl.roughnessMap.dispose();
  }
  if (mtrl.specularMap) {
    mtrl.specularMap.dispose();
  }
  if (mtrl.gradientMap) {
    mtrl.gradientMap.dispose();
  }
  mtrl.dispose();
  mtrl = undefined;
};
