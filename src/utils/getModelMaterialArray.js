import { getMaterials } from './getMaterials';
import * as THREE from 'three';

THREE.TextureLoader.prototype.crossOrigin = 'anonymous';
const inspectTexture = (url) => {
  const textureLoader = new THREE.TextureLoader();
  textureLoader.crossOrigin = 'anonymous';
  textureLoader.load(
    url,
    (texture) => {
      // console.warn(texture.source.data);
    }, // Function called when download progresses
    function (xhr) {
      // console.warn((xhr.loaded / xhr.total) * 100 + '% loaded');
    },
    // Function called when download errors
    function (xhr) {
      // console.error('An error happened');
    }
  );
};

function recursevilyAddValues(givenMap, key, value) {
  if (typeof value == 'object') {
    Object.entries(value).forEach(([k, v]) => {
      recursevilyAddValues(givenMap[key], k, v);
    });
  } else {
    givenMap[key] = value;
    return;
  }
}

const textureCache = {};

const getCachedTexture = (url) => {
  if (!textureCache[url]) {
    inspectTexture(url);
    const texture = new THREE.TextureLoader().load(url);
    textureCache[url] = texture;
  }
  return textureCache[url];
};
export function getModelMaterialArray(parts, product, key) {
  let ans = [];
  if (!parts || !product || !key) {
    return ans;
  }
  Object.entries(parts).forEach((part, index) => {
    const temp = part[1].material;
    const res = getMaterials(product, temp, key, part);

    if (res != null) {
      let aoSrc = '/assets/null_maps/nullAO.jpg';
      if (res.aoMap) aoSrc = res.aoMap;

      let emissionMap = '/assets/null_maps/nullEmissive.jpg';
      if (res.emissiveMap) emissionMap = res.emissiveMap;

      let normal = '/assets/null_maps/nullNormal.jpg';
      if (res.normalMap) normal = res.normalMap;

      let tiling = [1, 1];
      if (res.tiling) tiling = [res.tiling.x, res.tiling.y];

      let roughnessAndMetalnessMap = {};

      if (res.metalnessMap) {
        const metalnessMap = getCachedTexture(res.metalnessMap);
        metalnessMap.flipY = false;
        roughnessAndMetalnessMap.metalnessMap = metalnessMap;
      }

      if (res.roughnessMap) {
        const roughnessMap = getCachedTexture(res.roughnessMap);
        roughnessMap.flipY = false;
        roughnessAndMetalnessMap.roughnessMap = roughnessMap;
      }

      let materialSettings = {};
      if (res.roughness) materialSettings.roughness = res.roughness;
      if (res.metalness) materialSettings.metalness = res.metalness;
      if (res.opacity) materialSettings.opacity = res.opacity;
      if (res.emissiveIntensity)
        materialSettings.emissiveIntensity = res.emissiveIntensity;
      if (res.emissive) materialSettings.emissive = res.emissive;
      materialSettings.side = res.doubleSide ? 2 : 0;

      let textureSettings = {
        colorSpace: THREE.SRGBColorSpace,
        wrapT: THREE.RepeatWrapping,
        wrapS: THREE.RepeatWrapping,
      };

      const aoMap = getCachedTexture(aoSrc);
      aoMap.repeat.set(tiling[0], tiling[1]);

      const emissiveMap = getCachedTexture(emissionMap);
      emissiveMap.repeat.set(tiling[0], tiling[1]);

      const normalMap = getCachedTexture(normal);
      normalMap.repeat.set(tiling[0], tiling[1]);

      let baseMap = '/assets/null_maps/nullBasecolor.jpg';
      if (res?.baseMap) baseMap = res.baseMap;
      const map = getCachedTexture(baseMap);
      map.repeat.set(tiling[0], tiling[1]);

      if (res.textureSettings) textureSettings = res.textureSettings;
      Object.entries(textureSettings).forEach(([k, v]) =>
        recursevilyAddValues(map, k, v)
      );

      let color = '#FFFFFF';
      if (res.hexCode) color = res.hexCode;

      map.flipY = false;
      normalMap.flipY = false;
      emissiveMap.flipY = false;
      aoMap.flipY = false;

      const material = new THREE.MeshStandardMaterial({
        map,
        color,
        aoMap,
        normalMap,
        emissiveMap,
        ...materialSettings,
        ...roughnessAndMetalnessMap,
      });

      const target = res?.target;
      ans.push({ material, target, isFromModel: false });
    }
  });
  return ans;
}
