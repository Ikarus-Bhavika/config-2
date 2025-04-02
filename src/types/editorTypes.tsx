import {
  DropEvent,
  DropzoneInputProps,
  DropzoneRootProps,
  FileRejection,
} from 'react-dropzone';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrgMaterialType } from '../types/firebaseTypes';
import * as THREE from 'three'

export type CodeType = {
  children: string;
};
export type FileDropType = {
  onDrop?: (
    acceptedFiles: File[],
    fileRejections: FileRejection[],
    event: DropEvent
  ) => void;
  getRootProps: () => DropzoneRootProps;
  getInputProps: () => DropzoneInputProps;
  isDragActive: boolean;
  fileRejections: FileRejection[];
  children?: React.ReactNode;
  classes?: string;
};
export type FileStateTypes = {
  userDataVariants: { name: string; index: number }[][] | null;
  parsedResults: GLTF[];
  currentVariantIndex: number[];
};
export type EachCategoryType = {
  title: string;
  isMesh: boolean;
  isExtras: boolean;
  isDefault: boolean;
  hasInCatChanges: boolean;
  resetVarientsOnChange: string[];
  reInsertVarientsOnChange: string[];
  variants: EachVarientType[];
};
export type EachVarientType = {
  uid: string;
  name: string;
  src?: string;
  color?: string;
  img?: string;
  aoMap?: string;
  materialSettings?: any;
  textureSettings?: any;
  categoryId?: number[];
};
export type EachPrimeCategoryType = {
  title: string;
  options: EachPrimeCatOptionType[];
};
export type EachPrimeCatOptionType = {
  name: string;
  subText?: string;
  imageSrc: string;
};
export type UISettingsType = {
  allowZoom: Boolean;
  allowGrid: Boolean;
  panel: {
    allow: Boolean;
    allowPdfGenerate: Boolean;
    allowDownload: Boolean;
    allowProductEnquiry: Boolean;

    allowCustomize: Boolean;
    allowViewInAr: Boolean;
    allowSreenshot: Boolean;
    allowMeasurement: Boolean;
  };
};
export type NodesGroupType = {
  nodeName: string;
  nodes: string[];
};
export enum ETextureLocations {
  BaseMaps = 'BaseMaps',
  AO_Maps = 'AO_Maps',
  NormalMaps = 'NormalMaps',
}
export type MaterialType1 = {
  name: string;
  isFromModel: boolean;
  materialIndex: number;
};
export type MaterialType3 = {
  name: string;
  hexCode: string;
  baseMap: string;
};
export type MaterialGroupType = {
  id: string;
  name: string;
  materials: OrgMaterialType[];
  roughness?: number;
  roughnessMap?: string;
  metalness?: number;
  metalnessMap?: string;
  normalMap?: string;
  reflectivity?: number;
  opacity?: number;
  emissive?: string;
  emissiveIntensity?: number;
  emissiveMap?: string;
  emissiveMapIntensity?: number;
  tiling?: { x: number; y: number };
  doubleSide?: boolean;
};
export type MaterialType2 = {
  name: string;
  hexCode: string;
  baseMap?: string;
  normalMap?: string;
  emissiveMap?: string;
  aoMap?: string;
  tiling?: number[];
  materialSettings?: {
    roughness?: number;
    metalness?: number;
  };
  textureSettings?: {
    colorSpace?: string;
    warpT?: number;
    warpS?: number;
  };
  metallicMap?: string;
  roughnessMap?: string;
};
export type PartType = {
  name: string;
  target: string[];
  materialGroups: string[];
  materials: MaterialGroupType[];
};
export type ModelType = {
  name: string;
  modelSrc?: string;
  parts: PartType[];
  animations?: string[];
  price: number;
};
export type ProductType = {
  models: ModelType[];
};

export type MappingLayerType = {
  nodeName: string;
  envMapIntensity: number;
  materialIndex: number;
};
export type ResponseFileData = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
};
export type SaveFileResponseType = {
  files: ResponseFileData[];
};
export type ModelViewerCameraSettingsType = {
  fov: number;
  position: [number, number, number];
  damping: number;
  maxDistance: number;
  minDistance: number;
};
export type ModelViewerContactShadowsSettingsType = {
  blur: number;
  opacity: number;
  scale: number;
  near: number;
  far: number;
  height: number;
  width: number;
};
export type ModelViewerSettingsType = {
  camera: ModelViewerCameraSettingsType;
  contactShadows: ModelViewerContactShadowsSettingsType;
  enviromentPreset: string;
  viewerSettings: {
    toneMapping:THREE.ToneMapping,
    toneMappingExposure: number,
    intensity:number
  }
  grid?:boolean
};

/*default preset types*/

export type Part = {
  material: string;
};

export type Parts = {
  [key: string]: Part;
};

export type Feature = {
  visible: boolean;
  parts: Parts;
};

export type Configuration = {
  [key: string]: Feature;
};
