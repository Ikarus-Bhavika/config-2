import * as THREE from 'three';
import { PresetsType } from '@react-three/drei/helpers/environment-assets';
import { CSSProperties, Dispatch, Key, SetStateAction } from 'react';
import { ModelViewerSettingsType } from './editorTypes';
import { CanvasProps, RaycasterProps, RootState } from '@react-three/fiber';
import {
    AccumulativeShadowsProps,
    CameraControls,
    CenterProps,
    ContactShadowsProps,
    EnvironmentProps,
    RandomizedLightProps,
} from '@react-three/drei';
import { StoreApi, UseBoundStore } from 'zustand';
import { MotionValue } from 'framer-motion';


export enum ETableControlIndex {
    MATERIAL_TABLE_TOP = 1,
    MATERIAL_EDGE = 2,
    MATERIAL_FRAME = 4,
    MATERIAL_ACCESSORIES = 4,
    MATERIAL_SCREEN = 8,
    MATERIAL_HINGE = 9,
  
    MESH_TOP_EDGE = 0,
    MESH_FRAMES = 3,
    MESH_ACCESSORIES = 5,
    MESH_CONTROLLERS = 6,
    MESH_SCREENS = 7,
  }
  export enum EDefaultRoughness {
    Top = 0.85,
    Frame = 0.4,
    Screen = 0.85,
    Edge = 0.85,
    Hinge = 0.95,
  }
  export enum EDefaultMetalness {
    Top = 0.6,
    Frame = 0,
    Screen = 1,
    Edge = 1,
    Hinge = 1,
  }
  
  export type ClientProductData = ProductData[];
  export type CanvasPropsType = Omit<CanvasProps, 'children'> & {
    gl?: THREE.WebGLRendererParameters; // Custom parameters for the WebGL renderer
    flat?: boolean;
    camera?: Omit<Partial<THREE.Camera>, 'position'> & {
      // Customizable props for the default camera
      fov?: number; // Field of view
      aspect?: number; // Aspect ratio
      near?: number; // Near clipping plane
      far?: number; // Far clipping plane
      position?: [number, number, number]; // Initial position of the camera in 3D space
    };
    shadows?: boolean | Partial<THREE.WebGLShadowMap>; // Enables shadow map and its configuration
    orthographic?: boolean; // Sets the camera to orthographic mode
    raycaster?: RaycasterProps; // Custom raycaster configurations
    onCreated?: (state: RootState) => void; // Callback when the canvas is ready
    dpr?: number | [number, number]; // Device pixel ratio (DPR) for rendering resolution
    performance?: {
      // Performance optimizations
      min?: number; // Minimum frame rate for adaptive performance
      max?: number; // Maximum frame rate for adaptive performance
      debounce?: number; // Debouncing interval for performance adjustments
    };
    style?: CSSProperties; // CSS styles for the canvas element
    className?: string; // CSS class name for the canvas element
    // events?: React.DomEventHandlers;                 // Custom event handlers for DOM events
  };
  
  // export type StageSettingsTypes
  export type StageShadows = Partial<AccumulativeShadowsProps> &
    Partial<RandomizedLightProps> &
    Partial<ContactShadowsProps> & {
      type: 'contact' | 'accumulative';
      offset?: number;
      bias?: number;
      normalBias?: number;
      size?: number;
    };
  
  export type StageProps = {
    preset?:
    | 'rembrandt'
    | 'portrait'
    | 'upfront'
    | 'soft'
    | {
      main: [x: number, y: number, z: number];
      fill: [x: number, y: number, z: number];
    };
    shadows?: boolean | 'contact' | 'accumulative' | StageShadows;
    adjustCamera?: boolean | number;
    environment?: PresetsType | Partial<EnvironmentProps> | null;
    intensity?: number;
    center?: Partial<CenterProps>;
  };
  export type ModelSettingsType = {
    verticalAdjustment: number;
    contactShadowsSettings: {
      position?: [number, number, number];
    } & ContactShadowsProps;
    environmentSrc: string;
    canvasSettings: CanvasPropsType;
    stageSettings: StageProps;
  };
  export type MeshMaterialMappingType = {
    mappingName: string;
    modelId: Key;
    envMapIntensity: number | number[];
    meshIndex: number;
    materialIndex?: number | number[];
    nodeName?: string | string[];
  };
  export type ModelImagesType = {
    Name: string;
    isModel: boolean;
    src: string;
  };
  
  //TODO: remove all any
  export type ProductData = {
    modelSettings: ModelSettingsType;
    customizerSettings: any;
    meshMaterialMapping: MeshMaterialMappingType[];
    meshNodes: any;
    primeCats?: any;
    disabledCatagories: String[];
    variantOptions?: any;
    uiComponents: any;
    modelImages: ModelImagesType[];
    product: Product;
    currentState: any;
  };
  export type MaterialType1 = {
    id: string;
    name: string;
    isFromModel: boolean;
    materialIndex: number;
  };
  export type MaterialType2 = {
    id: string;
    name: string;
    hexCode: string;
    baseMap?: string;
    normalMap?: string;
    emissiveMap?: string;
    aoMap?: string;
    tiling?: tilingType;
    normalTiling?: boolean;
    roughnessTiling?: boolean;
    emissiveTiling?: boolean;
    aoMapTiling?: boolean;
    metallicTiling?: boolean;
    textureSettings?: any;
    metalnessMap?: string | null;
    roughnessMap?: string | null;
    roughness?: number;
    metalness?: number;
    reflectivity?: number;
    opacity?: number;
    emissive?: string;
    emissiveIntensity?: number;
    doubleSide?: boolean;
  };
  export type MaterialType = {
    id: string;
    name: string;
    baseMap?: string;
    hexCode?: string;
  };
  export type tilingType = {
    x: number;
    y: number;
  };
  export type MaterialGroupType = {
    id: string;
    name?: string;
    materials: { [key: string]: MaterialType } | MaterialType[];
    roughness?: number;
    roughnessMap?: string;
    metalness?: number;
    metalnessMap?: string;
    normalMap?: string;
    aoMap?: string;
    aoMapIntensity?: number;
    reflectivity?: number;
    emissiveIntensity?: number;
    opacity?: number;
    emissive?: string;
    tiling?: tilingType;
    doubleSide?: boolean;
  };
  
  export interface Part {
    name?: string;
    target: string[];
    materialGroups?: { [key: string]: MaterialGroupType } | string[];
    materials: { [key: string]: MaterialType1 | MaterialType2 };
  }
  export interface Model {
    name?: string;
    parts: { [key: string]: Part };
    modelSrc: string;
    imgSrc?: string;
  }
  export interface Product {
    models: { [key: string]: Model };
  }
  
  export type AnnotationPropsTypes = {
    topLineCenter: THREE.Vector3;
    frontLineCenter: THREE.Vector3;
    leftLineCenter: THREE.Vector3;
    size: any;
    show: boolean;
  };
  export type AxisComponentPropsTypes = {
    arrowPoints: {
      yAxis: THREE.Vector3[];
      xAxis: THREE.Vector3[];
      zAxis: THREE.Vector3[];
    };
    linePoints: {
      yAxis: THREE.Vector3[];
      xAxis: THREE.Vector3[];
      zAxis: THREE.Vector3[];
    };
    limiterPoints: {
      yAxis: THREE.Vector3[];
      xAxis: THREE.Vector3[];
      zAxis: THREE.Vector3[];
    };
    coneRadius: number;
    coneHeight: number;
    lineWidth: number;
    color: string;
    visible: boolean;
    axis: 'x' | 'y' | 'z';
  };
  
  export type RenderingModelCompProps = {
    src: string;
    values: any;
    product: any;
    products: any;
    name: string;
    animation: string[];
    visible: boolean;
    material?: THREE.MeshStandardMaterial;
    target?: String[];
    data?: any;
    showDimensions?: any;
    modelViewerStore: UseBoundStore<StoreApi<any>>;
    cameraControls?: any;
  };
  export type CustomModelViewerProps = {
    canvasRef?: React.Ref<HTMLCanvasElement>;
    currentProduct: any;
    product: any;
    modelViewerSettings: ModelViewerSettingsType;
    showDimensions?: boolean;
    setModelRef?: Dispatch<
      SetStateAction<React.RefObject<THREE.Group<THREE.Object3DEventMap>>>
    >;
    modelViewerStore: UseBoundStore<StoreApi<any>>;
  };
  export type ChildCanvasCustomModelViewerProps = {
    modelSettings: ModelSettingsType;
    currentProduct: any;
    product: any;
    showDimensions?: boolean;
    cameraControls?: any;
    grid?:boolean;
    modelViewerStore: UseBoundStore<StoreApi<any>>;
    setModelRef?: Dispatch<SetStateAction<React.RefObject<THREE.Group<THREE.Object3DEventMap>>>>;
  };
  export type tempType = {
    product: any;
    index: number;
    products: any;
    showDimensions: any;
    modelViewerStore: UseBoundStore<StoreApi<any>>;
    cameraControls?: any;
  };
  export type AnimateProperty = (
    property: MotionValue<number>,
    targetValue: MotionValue<number> | number,
    duration?: number,
    ease?: string
  ) => void;
  
  export type hotspotItem = {
    point: THREE.Vector3;
    text: string | null;
    customCameraPosition?: THREE.Vector3;
    customCameraTarget?: THREE.Vector3;
  };
  
  export type HotSpotProps = {
    spot: hotspotItem;
    cameraControls: React.RefObject<CameraControls>;
    modelViewerStore: UseBoundStore<StoreApi<any>>;
    index: any;
  };
  
  export type CameraAnimationProps = {
    cameraFinalPosition: THREE.Vector3;
    cameraFinalTarget: THREE.Vector3;
    modelViewerStore: UseBoundStore<StoreApi<any>>;
    cameraControls: React.RefObject<CameraControls>;
    hotspotIndex: number;
  };
  