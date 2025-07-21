/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-duplicate-enum-values */
import { Canvas, CanvasProps, ObjectMap, RaycasterProps, RootState, useFrame, useThree } from '@react-three/fiber';
import {
  CameraControls,
  ContactShadows,
  Html,
  useGLTF,
  Stage,
  PerspectiveCamera,
  useAnimations,
  Line,
  QuadraticBezierLine,
  Line2Props,
  AccumulativeShadowsProps,
  RandomizedLightProps,
  ContactShadowsProps,
  EnvironmentProps,
  CenterProps,
  Bounds,
  Center
} from '@react-three/drei';
import React, {
  useEffect,
  useRef,
  Suspense,
  useState,
  Dispatch,
  SetStateAction,
  CSSProperties,
  Key,
} from 'react';
import * as THREE from 'three';
import {
  getMaterialUpdate, updateMaterial
} from '../../utils/updateModelMaterialArray';
import { animate, useMotionValue, Easing, MotionValue } from 'framer-motion';
import LoaderLottie from './LottieLoader/LoaderLottie'
import { StoreApi, UseBoundStore } from 'zustand';
import { PresetsType } from '@react-three/drei/helpers/environment-assets';
import { ModelViewerSettingsType } from '../../types/editorTypes';
import getTotalModelAndMaterialsToLoad from '../../utils/getTotalModelAndMaterialsToLoad';
import useDataStore from '../../store/store';
import MenuItemsContainer from '../MenuComponents/MenuItemsContainer';
import { MeshTranlationDataItemType } from '../../types/viewerTypes';
import { useSearchParams } from 'react-router-dom';
import { Perf } from 'r3f-perf'
import cacheTexture from '../../utils/cacheTexture.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';



const diplayedOnce={}
// const hotspotsComfort = [
//   { 
//     targetMenuId:"sdfmgn58489rwpqakdofdsvn",
//     text:"Edit",
//     point:{x: 2.163306866133267, y: 0.5878, z: 0.7266957592936525}// 1
//   },
//   {
//     targetMenuId:"sdjdkoejhferwp9eoa93ifdf",
//     text:"Edit",
//     point:{x: 2.1693037831961828, y: 0.5878, z: 0.07512792061767617}//2s
//   },
//   {
//     targetMenuId:"kasidsljfuiuwrhgirefsdgr",
//     text:"Edit",
//     point:{x: 2.1495794663848313, y: 0.5878, z: -0.709863264912324}//3
//   },
//   {
//     targetMenuId:"smkldg903uqrwjfp498owrey",
//     text:"Edit",
//     // point:{x: 0.7646976058974313, y: 0.5878, z: 0.652572240579195}//4
//     point:{x: 0.6073, y: 0.5878, z: 0.652572240579195}
//   },
//   {
//     targetMenuId:"j748wio8ruhsjdfj84hfslkd",
//     text:"Edit",
//     point:{x: 0.6200, y: 0.5878, z: -0.0784104725733182}//5
//   },
//   {
//     targetMenuId:"mzodewufwehfkjsdjfhksdjf",
//     text:"Edit",
//     point:{x: 0.5550, y: 0.5878, z: -0.6709727926677533}//6
//   },
// ]

const hotspotsComfort = [
  { 
    targetMenuId:"sdfmgn58489rwpqakdofdsvn",
    text:"Edit",
    point:{x: 2.163306866133267, y: 0.8, z: 0.7266957592936525}// 1
  },
  {
    targetMenuId:"sdjdkoejhferwp9eoa93ifdf",
    text:"Edit",
    point:{x: 2.1693037831961828, y: 0.8, z: 0.07512792061767617}//2s
  },
  {
    targetMenuId:"kasidsljfuiuwrhgirefsdgr",
    text:"Edit",
    point:{x: 2.1495794663848313, y: 0.8, z: -0.709863264912324}//3
  },
  {
    targetMenuId:"smkldg903uqrwjfp498owrey",
    text:"Edit",
    point:{x: 0.7646976058974313, y: 0.8, z: 0.652572240579195}//4
  },
  {
    targetMenuId:"j748wio8ruhsjdfj84hfslkd",
    text:"Edit",
    point:{x: 0.7681522741080182, y: 0.8, z: -0.0784104725733182}//5
  },
  {
    targetMenuId:"mzodewufwehfkjsdjfhksdjf",
    text:"Edit",
    point:{x: 0.7656144616063827, y: 0.8, z: -0.6709727926677533}//6
  },
]
const hotspotsCoils = [
  { 
    targetMenuId:"smkldg903uqrwjfp498owre2",
    text:"Edit",
    point:{x: 2.163306866133267, y: 0.6, z: 0.7266957592936525}// 1
  },
  {
    targetMenuId:"sdjdkoejhferwp9eoa93ifd3",
    text:"Edit",
    point:{x: 2.1693037831961828, y: 0.6, z: 0.07512792061767617}//2s
  },
  {
    targetMenuId:"kasidsljfuiuwrhgirefsdg5",
    text:"Edit",
    point:{x: 2.1495794663848313, y: 0.6, z: -0.709863264912324}//3
  },
  {
    targetMenuId:"sdfmgn58489rwpqakdofdsv1",
    text:"Edit",
    point:{x: 0.7646976058974313, y: 0.6, z: 0.652572240579195}//4
  },
  {
    targetMenuId:"j748wio8ruhsjdfj84hfslk4",
    text:"Edit",
    point:{x: 0.7681522741080182, y: 0.6, z: -0.0784104725733182}//5
  },
  {
    targetMenuId:"mzodewufwehfkjsdjfhksdj6",
    text:"Edit",
    point:{x: 0.7656144616063827, y: 0.6, z: -0.6709727926677533}//6
  },
]

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
    position?: [number, number, number] | number[];
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
  disabledCatagories: string[];
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
  xSize: MotionValue;
  ySize: MotionValue;
  zSize: MotionValue;
  show: boolean;
  theme?:string;
};
export type AxisComponentPropsTypes = {
  coneRadius: number;
  coneHeight: number;
  lineWidth: number;
  color: string;
  visible: boolean;
  axis: string;
  axisRef: MotionValue;
  linePointRef: THREE.Vector3[];
  arrowPointRef: THREE.Vector3[];
  axisPointRef: {
    start: THREE.Vector3;
    end: THREE.Vector3;
  };
};


export type ArrowRotationsType = { [key: string]: [[number, number, number], [number, number, number]]; }

export type NotationPositionsType = {
  topLineCenter: THREE.Vector3;
  frontLineCenter: THREE.Vector3;
  leftLineCenter: THREE.Vector3;
}

export type AxisPointsType = {
  xAxis: {
    start: THREE.Vector3;
    end: THREE.Vector3;
  };
  yAxis: {
    start: THREE.Vector3;
    end: THREE.Vector3;
  };
  zAxis: {
    start: THREE.Vector3;
    end: THREE.Vector3;
  };
}
export type MeasurementType = {
  xAxis: THREE.Vector3[];
  yAxis: THREE.Vector3[];
  zAxis: THREE.Vector3[];
}

// Define axis keys mapping
export type AxisKey = 'xAxis' | 'yAxis' | 'zAxis';
export type Axis = 'x' | 'y' | 'z';
export type AxisMappingType = Record<Axis, AxisKey>
export type LinePointsType = {
  xAxis: THREE.Vector3[];
  yAxis: THREE.Vector3[];
  zAxis: THREE.Vector3[];
};

export type AxisRefTypes = Record<Axis, MotionValue<number>>
export type RenderingModelCompProps = {
  src: string;
  values: any;
  product: any;
  products: any;
  name: string;
  animation: string[];
  visible: boolean;
  material?: THREE.MeshStandardMaterial;
  target?: string[];
  data?: any;
  showDimensions?: any;
  modelViewerStore: UseBoundStore<StoreApi<any>>;
  cameraControls?: any;
  playAnimation?:boolean;
  playAnimationVisibility?:string[];
  onSuccessfulRender:()=>void;
  setPlayAnimationVisibility?: React.Dispatch<React.SetStateAction<string[]>>;
  isModelLoaded?: boolean
  index:number;
  setCurrentCount:React.Dispatch<React.SetStateAction<{
    models: number;
    materials: number;
  }>>;
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
  theme?:string;
  playAnimation?:boolean;
  playAnimationVisibility?:string[];
  setPlayAnimationVisibility?: React.Dispatch<React.SetStateAction<string[]>>;
  setIsModelLoaded?: React.Dispatch<React.SetStateAction<boolean>>;
};
export type ChildCanvasCustomModelViewerProps = {
  modelViewerSettings: any;
  grid: boolean | undefined;
  modelSettings: ModelSettingsType;
  currentProduct: any;
  product: any;
  showDimensions?: boolean;
  cameraControls?: any;
  modelViewerStore: UseBoundStore<StoreApi<any>>;
  setModelRef?: Dispatch<SetStateAction<React.RefObject<THREE.Group<THREE.Object3DEventMap>>>>;
  theme?:string;
  playAnimation?:boolean;
  playAnimationVisibility?:string[];
  setPlayAnimationVisibility?: React.Dispatch<React.SetStateAction<string[]>>;
  setIsModelLoaded?: React.Dispatch<React.SetStateAction<boolean>>;
  isModelLoaded?: boolean;
};
export type RenderingModelWrapperType = {
  product: any;
  index: number;
  products: any;
  showDimensions: any;
  modelViewerStore: UseBoundStore<StoreApi<any>>;
  cameraControls?: any;
  isModelLoaded?:boolean;
  playAnimation?:boolean;
  playAnimationVisibility?:string[];
  onSuccessfulRender: ()=>void
  setPlayAnimationVisibility?: React.Dispatch<React.SetStateAction<string[]>>;
  setCurrentCount:React.Dispatch<React.SetStateAction<{
    models: number;
    materials: number;
  }>>;
};
export type AnimateProperty = (
  property: MotionValue<number>,
  targetValue: MotionValue<number> | number,
  duration?: number,
  ease?: string
) => void;

export type hotspotItem = {
  targetMenuId:string,
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
  layerName:string;
};

export type CameraAnimationProps = {
  cameraFinalPosition: THREE.Vector3;
  cameraFinalTarget: THREE.Vector3;
  modelViewerStore: UseBoundStore<StoreApi<any>>;
  cameraControls: React.RefObject<CameraControls>;
  hotspotIndex: number;
};
function isInfiniteVec(a:THREE.Vector3):boolean{
    return a.x==Infinity || a.y==Infinity || a.z==Infinity || a.x==-Infinity || a.y==-Infinity || a.z==-Infinity
};


const Hotspot = (props: Omit<
  HotSpotProps,
  "modelViewerSettings" |
  "modelViewerStore"
>
) => {
  const [editMode, setEditMode] = useState(false);

  const store = useDataStore()
  // const { editHotspotMode } = editorStateStore();
  const vectorCustomCameraPosition = props.spot.customCameraPosition?.isVector3
    ? props.spot.customCameraPosition
    : new THREE.Vector3(
      props.spot.customCameraPosition?.x || 0,
      props.spot.customCameraPosition?.y || 0,
      props.spot.customCameraPosition?.z || 0
    );
  const vectorCustomCameraTarget = props.spot.customCameraTarget?.isVector3
    ? props.spot.customCameraTarget
    : new THREE.Vector3(
      props.spot.customCameraTarget?.x || 0,
      props.spot.customCameraTarget?.y || 0,
      props.spot.customCameraTarget?.z || 0
    );
  // const animateCamera = () => {
  //   // if (isAnimationSet) {
  //   if (props.cameraControls.current)
  //     props.cameraControls.current.smoothTime = 0.3;
  //   const { x: Px, y: Py, z: Pz } = vectorCustomCameraPosition;
  //   const { x: Tx, y: Ty, z: Tz } = vectorCustomCameraTarget;
  //   props.cameraControls.current?.setLookAt(Px, Py, Pz, Tx, Ty, Tz, true);
  //   // }
  // };
  const isAllowedVisible = store.allowHotspots.for==props.layerName || store.allowHotspots.active
  const isActiveSpot = isAllowedVisible && props.spot.targetMenuId==store.allowHotspots.activeMenuItemId

  function handleClick(){
    if(!store.hotspotMenu) return

    const { allowHotspots } = useDataStore.getState()
    
    if(isActiveSpot){
      store.setAllowHotspots({
        ...allowHotspots,
        activeMenuItemId:"",
        activeData:[],
      })
      return
    }


    store.setAllowHotspots({
      ...allowHotspots,
      activeMenuItemId:props.spot.targetMenuId,
      activeData:store.hotspotMenu[props.spot.targetMenuId]
    })
    
  }

  const position = props.spot.point.isVector3? props.spot.point : new THREE.Vector3(props.spot.point.x,props.spot.point.y,props.spot.point.z);

  return (
    <Html position={[position.x, position.y, position.z]} zIndexRange={[101, 0]}    portal={{ current: document.body }}
 
  // distanceFactor={3.3} // adjust based on zoom level
  className="z-[9999]" >
      
      <div className='relative z-50' >
        <div
          onClick={isAllowedVisible?handleClick:()=>{}}
          className={`
            ${!isAllowedVisible?"opacity-0":" "} 
            bg-[#00000088] hover:bg-[#000000ff] duration-150 text-white min-h-8 min-w-8
            font-medium p-1 rounded-full text-[10px]
             flex justify-center items-center gap-1 aspect-square cursor-pointer
          `}
        >
          <div> {isActiveSpot
            ?<img height={40} width={40} src='icons/cross.png' alt='cross'/>
            :<img height={40} width={40} src='icons/Edit.png' alt='cross'/>
          }</div>
        </div>
      
        {isActiveSpot &&
         <div className="absolute bg-white p-2 z-[9999] rounded-md w-[250px] sm:w-[280px] xl:w-[320px] shadow-lg" >

          <h2 className='p-2'>
            {store.expandedComponent=="menu3" ? "Contour" : "Coils"} Layer
          </h2>
          {store.expandedComponent === "menu3" && (
    <h3 className="py-1 text-[11px] xl:text-[13px] ml-2">
         Contour Module
    </h3>

  )}
    {store.expandedComponent === "menu4" && (
    <h4 className="py-1 text-[11px] xl:text-[13px] ml-2">
      Coils Module
    </h4>
    
  )}
          <MenuItemsContainer 
isHotspotMenu
menuId={props.spot.targetMenuId}
menuOptions={store.allowHotspots.activeData}
/>
          </div>
        }
      
      </div>
    </Html>
  );
};

let animationCompletionDuration:number;

function RenderingModel(props: Omit<
  RenderingModelCompProps,
  "modelViewerSettings" |
  "modelViewerStore"
>
) {
  const { camera,...restcene } = useThree();
  const [params] = useSearchParams();
  const {expandModel,
    setExpandModel,
    enableButtons,
    setEnableButtons,
    initialAnimationCompleted,
    setInitialAnimationCompleted,
    ...store
  } = useDataStore() 
  

  const thisLoader = useGLTF(props.src,true,false,(loader)=>{
     const dracoLoader = new DRACOLoader();
     dracoLoader.setDecoderPath('/draco/');
     loader.setDRACOLoader(dracoLoader as any);
  }); 

  const [isMaterialLoaded,setIsMaterialLoaded] = useState(false);
  const loader1 = thisLoader.scene as THREE.Object3D;
  const meshRef = useRef<THREE.Object3D>(loader1);
  const { animations } = thisLoader;
  const [currentAnimation, setCurrentAnimation] = useState<string[]>([]);
  const { actions } = useAnimations(animations, meshRef);


  
  
  const [newRender,setNewRender] = useState<boolean>(diplayedOnce[props.name]!=undefined?diplayedOnce[props.name]:true)
  //Hovering with responses
  const [hovered, setHover] = useState(null);

  const [firstIteration,setFirstIteration] = useState<boolean>(true)
  // const { setOpenSetHotspotName, editHotspotMode } = editorStateStore();

  const handleClick = (e: any) => {
    e.stopPropagation();
    // console.log(e.object.name);
    // console.log(e.point)
    const point = e.point;
    console.log("🟢 Clicked position:", {
      x: Number(point.x.toFixed(4)),
      y: Number(point.y.toFixed(4)),
      z: Number(point.z.toFixed(4))
    });
  };

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    e.object.material.emissive = new THREE.Color(0xffffff);
    e.object.material.emissiveIntensity = 0.2;
    e.object.material.needsUpdate = true;
    setHover(e.object.material.name);
  };

  const handlePointerOut = (e: any) => {
    e.stopPropagation();
    e.object.material.emissive = new THREE.Color(0x000000);
    e.object.material.emissiveIntensity = 1;
    e.object.material.needsUpdate = true;
    e.intersections.length === 0 && setHover(null);
  };

  // Function to stop the current animations
  const stopCurrentAnimations = () => {
    currentAnimation.forEach((anim) => {
      //Add error handling if anim doesn't exist
      actions[anim]?.fadeOut(0.5).stop();
    });
  };

  // Function to play new animations
  const playNewAnimations = () => {
    props?.animation?.forEach((anim) => {
      actions[anim]?.reset().fadeIn(0.5).play();
    });
  };

  const setInitialMeshTranslationData = (loader: THREE.Object3D) => {
    // console.log("model position",loader.parent?.position)
    const box = new THREE.Box3().setFromObject(loader);
    const center = new THREE.Vector3();
    box.getCenter(center);

    const size = new THREE.Vector3();
    box.getSize(size);

    const offset = new THREE.Vector3(center.x + size.x, 0, 0);
    const startPos = loader.position.clone();
    const endPos = startPos.clone().add(offset);
    const tempData = store.meshTranslationData;
    const newData:MeshTranlationDataItemType = {
      loader:loader,
      cameraPosition: new THREE.Vector3(4.579316020011902, 4.511467328295112, 4.575059533119202),
      isTranslated: false,
      translationPosition: endPos,
    }
    tempData[props.name] = newData;
    store.setMeshTranslationData(tempData); 
  }

  

  useEffect(() => {
    const rawAction = actions["alwaysAnimate"];
    if (initialAnimationCompleted || !rawAction || !meshRef.current) return;
  
    const action = rawAction as THREE.AnimationAction;
    const mixer = action.getMixer();
  
    // Apply first animation frame immediately to prevent flicker
    action.reset();
    action.play();
    action.paused = true;
    action.time = 0;
    mixer.update(0);
  
    function handleFinish(e: THREE.Event) {
      const finishedAction = (e as any).action as THREE.AnimationAction;
  
      if (finishedAction?.getClip().name === action.getClip().name) {
        animationCompletionDuration = action.getClip().duration;
      }
  
      setInitialAnimationCompleted(true);
      setInitialMeshTranslationData(loader1);
      mixer.removeEventListener("finished", handleFinish);
    }
  
    function playInitialAnimation() {
      if (!action || initialAnimationCompleted) return;
  
      mixer.removeEventListener("finished", handleFinish);
      mixer.addEventListener("finished", handleFinish);
  
      action.reset();
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
      action.enabled = true;
      action.fadeIn(0.5).play();
    }
  
    const timeout = setTimeout(playInitialAnimation, 600);
  
    return () => {
      mixer.removeEventListener("finished", handleFinish);
      clearTimeout(timeout);
    };
  }, [actions, props]);
  
  
  // useEffect(() => {
  //   const rawAction = actions["alwaysAnimate"];
  //   if (
  //     initialAnimationCompleted ||
  //     !rawAction ||
  //     !meshRef.current ||
  //     !props.isModelLoaded
  //   ) return;
  
  //   const action = rawAction as THREE.AnimationAction;
  //   const mixer = action.getMixer();
  
  //   function handleFinish(e: THREE.Event) {
  //     if ((e as any).action?.getClip().name === action.getClip().name) {
  //       animationCompletionDuration = action.getClip().duration;
  //     }
  //     console.log("✅ Initial animation finished");
  //     setInitialAnimationCompleted(true);
  //     setInitialMeshTranslationData(loader1);
  //     mixer.removeEventListener("finished", handleFinish);
  //   }
  
  //   function playInitialAnimation() {
  //     if (!action || initialAnimationCompleted) return;
  
  //     console.log("🎬 Playing initial animation");
  
  //     mixer.removeEventListener("finished", handleFinish);
  //     mixer.addEventListener("finished", handleFinish);
  
  //     action.reset();
  //     action.enabled = true;
  //     action.clampWhenFinished = true;
  //     action.setLoop(THREE.LoopOnce, 1);
  //     action.fadeIn(0.5).play();
  //   }
  
  //   const timeout = setTimeout(playInitialAnimation, 1000);
  
  //   return () => {
  //     mixer.removeEventListener("finished", handleFinish);
  //     clearTimeout(timeout);
  //   };
  // }, [actions, props.isModelLoaded]);
  
  
  
  
  useEffect(() => {
    
    const action = actions["alwaysAnimate"];
    if (!initialAnimationCompleted || !action || !meshRef.current) return;
    console.log("PlayingThis");

    const mixer = action.getMixer();
    const mesh = meshRef.current;
    
    function handleFinish() {
      setEnableButtons(!enableButtons);
      // console.log("expandModel",expandModel)
      // const tempPreset = {...store.preset};
      // if(tempPreset["Coils2"]?.visible) tempPreset["Coils2"].visible = expandModel
      // if(tempPreset["comfortModule1"]?.visible) tempPreset["comfortModule1"].visible = expandModel
      // if(tempPreset["reliefLayer2"]?.visible) tempPreset["reliefLayer2"].visible = expandModel

      // diplayedOnce["Coils2"]=false
      // diplayedOnce["comfortModule1"]=false
      // diplayedOnce["reliefLayer2"]=false
      // store.setPreset(tempPreset);
    }
    
    function playAnimation(){
      if(!action) return

      
      mixer.removeEventListener("finished", handleFinish); // clean old
      mixer.addEventListener("finished", handleFinish); // add new
      
      const duration = animationCompletionDuration || action.getClip().duration;
    
      action.reset();
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
      action.enabled = true;
    
      if (expandModel) {
        action.timeScale = 1;
        action.time = 0;
      } else {
        action.timeScale = -1;
        action.time = duration;
      }
    
      action.play();
    }
    

    if(!newRender || !expandModel){
      playAnimation()
      setNewRender(false)
      diplayedOnce[props.name] = true
    }else{
      const duration = 2;
      action.clampWhenFinished = true;
      action.enabled = true;
      action.time = duration;
      action.play().setLoop(THREE.LoopOnce, 1);
    }
    // debugger
    return () => {
      mixer.removeEventListener("finished", handleFinish);
    };
  }, [newRender,expandModel]);


  useEffect(() => {
    // Check if the animations need to be updated
    stopCurrentAnimations();

    if (props.animation?.length > 0 && !props.showDimensions) {
      playNewAnimations();
      setCurrentAnimation(props.animation);
    } else {
      // If no new animations or showDimensions is true, set current animation to an empty array
      setCurrentAnimation([]);
    }
  }, [props.animation]);

  const applyTextureOnNodes = async (loader: THREE.Object3D,updatedMapping:any) => {
    const res = await cacheTexture(updatedMapping, {});
    console.log("textureCache",res);
    loader.traverse(async (child: THREE.Object3D) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        updatedMapping.map(async (d: any) => {
          if (d?.target.includes(child.name)) {
            // console.log(child.name)
            await updateMaterial(d, (child as THREE.Mesh).material,setIsMaterialLoaded,res);
          }
        });
      }
    });
  }

  useEffect(() => {
    // console.log("running")
    const updatedMapping = getMaterialUpdate(
      props.values,
      props.products,
      props.name
    );
    props.onSuccessfulRender()

    props.setCurrentCount((prev)=>(
      {
        ...prev,
        models:prev.models+1
      } 
    ))
    if (Object.keys(store.meshTranslationData).length>0 && !store.meshTranslationData[props.name]) setInitialMeshTranslationData(loader1);

    // console.log(props.name)
    applyTextureOnNodes(loader1,updatedMapping)
    
  }, [JSON.stringify(props.values)]);

  const translateMesh = (
    name:string
  ) => {
    // console.log(name)
    const tempData = store.meshTranslationData;
    const duration = 500;
    //here tempData[props.name].translationPosition is the offset that we need to change in model position
    Object.keys(tempData).map((key)=>{
      let start:THREE.Vector3;
      let end:THREE.Vector3;
      const data = tempData[key];
      const loader = data.loader;
      
      const box = new THREE.Box3().setFromObject(loader);
      const center = new THREE.Vector3();
      box.getCenter(center);
      const size = new THREE.Vector3();
      box.getSize(size);
      const startPos = loader.position.clone();
      // const startPos = new THREE.Vector3();
      const endPos = data.translationPosition;
      if(name==key){
        // console.log("getting here",name,startPos,endPos)
        start = startPos;
        end = endPos;
        const startTime = performance.now();
        
        const animate = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const t = Math.min(elapsed / duration, 1); // interpolation factor [0,1]
          // console.log("loader",loader);
          loader.position.lerpVectors(start, end, t);
      
          if (t < 1) {
            requestAnimationFrame(animate);
          }
        };
      
        requestAnimationFrame(animate);
        tempData[name].isTranslated = true;
      }else if(data.isTranslated){
        end = new THREE.Vector3();
        start = startPos;
        const startTime = performance.now();
  
        const animate = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const t = Math.min(elapsed / duration, 1); // interpolation factor [0,1]
      
          loader.position.lerpVectors(start, end, t);
      
          if (t < 1) {
            requestAnimationFrame(animate);
          }
        };
      
        requestAnimationFrame(animate);
        tempData[key].isTranslated = false;
      } 
    })
    store.setMeshTranslationData(tempData);
  };

  useEffect(()=>{
    const meshes = meshRef.current.children;
    const menu1 = ['Cover','Cover2'];
    const menu2 = ['ReliefLayer'];
    const menu3 = ['1','2','3','4','5','6','B1','B2','B3','B4','B5','B6']
    const menu4 = ['C1','C2','C3','C4','C5','C6']
    if(store.expandedComponent=="menu1"){
      if(meshes.find(child=>menu1.includes(child.name))){
        translateMesh(props.name)
        store.setOutLineObjects(meshes);
      }else{
        console.log("meshes",meshes); 
      }
    }else if(store.expandedComponent=="menu2"){
      if(meshes.find(child=>menu2.includes(child.name))){
        translateMesh(props.name)
        store.setOutLineObjects(meshes);    
      }
    }else if(store.expandedComponent=="menu3"){
      if(meshes.find(child=>menu3.includes(child.name))){
        translateMesh(props.name)
        store.setOutLineObjects(meshes);  
      }
    }else if(store.expandedComponent=="menu4"){
      if(meshes.find(child=>menu4.includes(child.name))){
        translateMesh(props.name)
        store.setOutLineObjects(meshes);  
      }
    }else{
      translateMesh("")
      store.setOutLineObjects([]);
    }
  },[store.expandedComponent,store.preset]);

  useEffect(()=>{
    if(isMaterialLoaded){
      props.setCurrentCount((prev)=>(
        {
          ...prev,
          materials:prev.materials+1
        } 
      ))
    }
  },[isMaterialLoaded])

  return (
    <primitive
      ref={meshRef}
      key={props.name}
      position={[0, 0, 0]}
      onDoubleClick={handleClick}
      name={"Primitive_"+props.product}
      onClick={handleClick}
      // onPointerOver={handlePointerOver}
      // onPointerOut={handlePointerOut}
      object={meshRef.current}
    />
  );
}

function RenderingModelWrapper(props: Omit<
  RenderingModelWrapperType,
  "modelViewerSettings" |
  "modelViewerStore"
>
) {
  return  props.product.value.visible && 
    props.products.models[props.product.key]?.modelSrc && 
    <RenderingModel
      index={props.index}
      src={props.products.models[props.product.key]?.modelSrc}
      values={props.product.value.parts}
      product={props.product}
      products={props.products}
      key={props.product.value.modelSrc}
      name={props.product.key}
      animation={props.product.value.animation}
      visible={props.product.value.visible}
      showDimensions={props.showDimensions}
      cameraControls={props.cameraControls}
      playAnimation={props.playAnimation}
      onSuccessfulRender={props.onSuccessfulRender}
      setPlayAnimationVisibility={props.setPlayAnimationVisibility}
      playAnimationVisibility={props.playAnimationVisibility}
      setCurrentCount={props.setCurrentCount}
      isModelLoaded={props.isModelLoaded}
    />
}

        

const Annotation = (props: AnnotationPropsTypes) => {
  const [value, set] = useState(false)
  useFrame(() => {
    if (props.show) {
      set(!value)
    }
  })
  return (
    <>
      <Html
        position={[props.topLineCenter.x, props.topLineCenter.y, props.topLineCenter.z]}
        className={`${props.show ? 'block' : 'hidden'}`}
        zIndexRange={[1, 0]}
      >
        <div className=" bg-white text-black  border font-medium p-2 rounded-md text-[14px] flex gap-1">
          {props.theme === 'v4' ? ( 
            <>
              <div>{(props.xSize.get() * 100 * 0.393701).toFixed(2)}</div>
              <div>Inch</div>
            </>
          ):(
              <>
                <div>{(props.xSize.get() * 100).toFixed(2)}</div>
                <div>cm</div>
              </>
            )
          }
        </div>
      </Html>
      <Html
        position={[props.leftLineCenter.x, props.leftLineCenter.y, props.leftLineCenter.z]}
        className={`${props.show ? 'block' : 'hidden'}`}
        zIndexRange={[1, 0]}
      >
        <div className=" bg-white text-black  border font-medium p-2 rounded-md text-[14px] flex gap-1">
        {props.theme === 'v4' ? ( 
            <>
              <div>{(props.ySize.get() * 100 * 0.393701).toFixed(2)}</div>
              <div>Inch</div>
            </>
          ):(
              <>
                <div>{(props.ySize.get() * 100).toFixed(2)}</div>
                <div>cm</div>
              </>
            )
          }
        </div>
      </Html>
      <Html
        position={[props.frontLineCenter.x, props.frontLineCenter.y, props.frontLineCenter.z]}
        className={`${props.show ? 'block' : 'hidden'}`}
        zIndexRange={[1, 0]}
      >
        <div className=" bg-white text-black  border font-medium p-2 rounded-md text-[14px] flex gap-1">
          {props.theme === 'v4' ? ( 
            <>
              <div>{(props.zSize.get() * 100 * 0.393701).toFixed(2)}</div>
              <div>Inch</div>
            </>
          ):(
              <>
                <div>{(props.zSize.get() * 100).toFixed(2)}</div>
                <div>cm</div>
              </>
            )
          }
        </div>
      </Html>
    </>
  );
};

const AxisComponent = ({
  coneRadius,
  coneHeight,
  lineWidth,
  color,
  visible,
  axis,
  axisRef,
  linePointRef,
  arrowPointRef,
  axisPointRef,
}: AxisComponentPropsTypes) => {
  const halfConeHeight = coneHeight / 2
  const axisLineRef = useRef<Line2Props>(null)
  const arrowBegin = useRef<THREE.Mesh>(null)
  const arrowEnd = useRef<THREE.Mesh>(null)

  const arrowRotations: ArrowRotationsType = {
    x: [
      [0, 0, Math.PI / 2],
      [0, 0, -Math.PI / 2],
    ],
    y: [
      [-Math.PI, 0, 0],
      [0, 0, 0],
    ],
    z: [
      [Math.PI / 2, 0, 0],
      [-Math.PI / 2, 0, 0],
    ],
  };


  useFrame(() => {
    // Update axis-specific logic in useFrame
    if (axisPointRef && linePointRef && arrowPointRef) {
      // Update line points for the axis
      linePointRef = [
        isInfiniteVec(axisPointRef.start)?new THREE.Vector3():axisPointRef.start,
        isInfiniteVec(axisPointRef.end)?new THREE.Vector3():new THREE.Vector3(
            axis === 'x' ? axisRef.get() : axisPointRef.end.x,
            axis === 'y' ? axisRef.get() : axisPointRef.end.y,
            axis === 'z' ? axisRef.get() : axisPointRef.end.z
            ),
      ]
      if (axisLineRef.current) {
        axisLineRef?.current?.setPoints(linePointRef[0], linePointRef[1], linePointRef[1]);
      }
      // Update arrow points for the axis
      arrowPointRef = [
        isInfiniteVec(axisPointRef.start)? new THREE.Vector3():new THREE.Vector3(
            axis === 'x' ? axisPointRef.start.x - halfConeHeight : axisPointRef.start.x,
            axis === 'y' ? axisPointRef.start.y - halfConeHeight : axisPointRef.start.y,
            axis === 'z' ? axisPointRef.start.z + halfConeHeight : axisPointRef.start.z
        ),
        isInfiniteVec(axisPointRef.end)? new THREE.Vector3():new THREE.Vector3(
            axis === 'x' ? axisRef.get() + halfConeHeight : axisPointRef.end.x,
            axis === 'y' ? axisRef.get() + halfConeHeight : axisPointRef.end.y,
            axis === 'z' ? axisRef.get() - halfConeHeight : axisPointRef.end.z
        ),
      ]

      if (arrowBegin.current && arrowEnd.current) {
        arrowBegin.current.position.copy(arrowPointRef[0]);
        arrowEnd.current.position.copy(arrowPointRef[1]);
      }

    }
  })

  return (
    <group visible={visible} >
      <mesh
        ref={arrowBegin}
        rotation={arrowRotations[axis][0]}
        renderOrder={500}
      >
        <coneGeometry args={[coneRadius, coneHeight, 24, 1]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <QuadraticBezierLine
        ref={axisLineRef}
        visible={visible}
        color={color}
        lineWidth={lineWidth}
        start={[0, 0, 0]}
        end={[0, 0, 0]}
        dashed={false}
      />
      <mesh
        ref={arrowEnd}
        rotation={arrowRotations[axis][1]}
        renderOrder={500}
      >
        <coneGeometry args={[coneRadius, coneHeight, 24, 1]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
};

const ChildCanvasCustomModelViewer = (
  props:Omit<
    ChildCanvasCustomModelViewerProps,
    "modelViewerSettings" |
    "modelViewerStore"
  >
) => {
  const hotspots = []
  const {scene} = useThree()
  const measurementRef = useRef<THREE.Group<THREE.Object3DEventMap>>(null);
  const modelRef = useRef<THREE.Group<THREE.Object3DEventMap>>(new THREE.Group());
  const [y, setY] = useState<number>(0);
  

  const [modelSize, setModelSize] = useState<THREE.Vector3>(
    new THREE.Vector3(0, 0, 0)
  );
  const [notationPositions,setNotationPositions] = useState<NotationPositionsType>({
    topLineCenter: new THREE.Vector3(),
    frontLineCenter: new THREE.Vector3(),
    leftLineCenter: new THREE.Vector3(),
  })
  const linePoints = useRef<MeasurementType>({
    yAxis: [new THREE.Vector3(), new THREE.Vector3()],
    xAxis: [new THREE.Vector3(), new THREE.Vector3()],
    zAxis: [new THREE.Vector3(), new THREE.Vector3()],
  })
  const arrowPoints = useRef<MeasurementType>({
    yAxis: [new THREE.Vector3(), new THREE.Vector3()],
    xAxis: [new THREE.Vector3(), new THREE.Vector3()],
    zAxis: [new THREE.Vector3(), new THREE.Vector3()],
  })
  const axisPoints = useRef({
    xAxis: { start: new THREE.Vector3(), end: new THREE.Vector3() },
    yAxis: { start: new THREE.Vector3(), end: new THREE.Vector3() },
    zAxis: { start: new THREE.Vector3(), end: new THREE.Vector3() },
  })
  const [currentCount,setCurrentCount] = useState({
    models:0,
    materials:0,
  })
  const lineWidth = useRef(1);
  const coneRadius = useRef(0.01);
  const coneHeight = useRef(0.04);
  const measurementTheme = "#242424"
  const xAxis = useMotionValue(0);
  const yAxis = useMotionValue(0);
  const zAxis = useMotionValue(0);
  const xSize = useMotionValue(0);
  const ySize = useMotionValue(0);
  const zSize = useMotionValue(0);
  const [isAnimating, setAnimation] = useState(false);
  const [prevBoundingBox, setPrevBoundingBox] = useState<{
    size: THREE.Vector3;
    volume: number;
  } | null>(null);
  //dimensions
  const showModelDimensions = () => {
    if (modelRef.current) {
      const boundingBox = new THREE.Box3().setFromObject(modelRef.current);
      // if (measurementRef.current) {
      const boxHelper = new THREE.Box3Helper(boundingBox, 'black');

      const modelSize = new THREE.Vector3()
      setModelSize(boundingBox.getSize(modelSize));

      const axisSpacingOffset = 0.07;
      // X axis
      const initialX = [
        new THREE.Vector3(
          boundingBox.min.x + coneHeight.current,
          boundingBox.min.y - props.modelSettings.verticalAdjustment,
          boundingBox.max.z + axisSpacingOffset
        ),
        new THREE.Vector3(
          boundingBox.min.x + coneHeight.current,
          boundingBox.min.y - props.modelSettings.verticalAdjustment,
          boundingBox.max.z + axisSpacingOffset
        ),
      ];
      const verticesTop = [
        new THREE.Vector3(
          boundingBox.min.x + coneHeight.current,
          boundingBox.min.y - props.modelSettings.verticalAdjustment,
          boundingBox.max.z + axisSpacingOffset
        ),
        new THREE.Vector3(
          boundingBox.max.x - coneHeight.current,
          boundingBox.min.y - props.modelSettings.verticalAdjustment,
          boundingBox.max.z + axisSpacingOffset
        ),
      ];

      //Y axis
      const yAxisSpacingOffset = 0.05;
      const initialY = [
        new THREE.Vector3(
          boundingBox.min.x - yAxisSpacingOffset,
          boundingBox.min.y -
          props.modelSettings.verticalAdjustment +
          coneHeight.current,
          boundingBox.max.z + yAxisSpacingOffset
        ),
        new THREE.Vector3(
          boundingBox.min.x - yAxisSpacingOffset,
          boundingBox.min.y -
          props.modelSettings.verticalAdjustment +
          coneHeight.current,
          boundingBox.max.z + yAxisSpacingOffset
        ),
      ];
      const verticesFront = [
        new THREE.Vector3(
          boundingBox.min.x - yAxisSpacingOffset,
          boundingBox.min.y -
          props.modelSettings.verticalAdjustment +
          coneHeight.current,
          boundingBox.max.z + yAxisSpacingOffset
        ),
        new THREE.Vector3(
          boundingBox.min.x - yAxisSpacingOffset,
          boundingBox.max.y -
          props.modelSettings.verticalAdjustment -
          coneHeight.current,
          boundingBox.max.z + yAxisSpacingOffset
        ),
      ];

      // Z axis
      const initialZ = [
        new THREE.Vector3(
          boundingBox.min.x - axisSpacingOffset,
          boundingBox.min.y - props.modelSettings.verticalAdjustment,
          boundingBox.max.z - coneHeight.current
        ),
        new THREE.Vector3(
          boundingBox.min.x - axisSpacingOffset,
          boundingBox.min.y - props.modelSettings.verticalAdjustment,
          boundingBox.max.z - coneHeight.current
        ),
      ];

      const verticesLeft = [
        new THREE.Vector3(
          boundingBox.min.x - axisSpacingOffset,
          boundingBox.min.y - props.modelSettings.verticalAdjustment,
          boundingBox.max.z - coneHeight.current
        ),
        new THREE.Vector3(
          boundingBox.min.x - axisSpacingOffset,
          boundingBox.min.y - props.modelSettings.verticalAdjustment,
          boundingBox.min.z + coneHeight.current
        ),
      ];

      const lineTop = new THREE.Line3(...verticesTop);
      const lineFront = new THREE.Line3(...verticesFront);
      const lineLeft = new THREE.Line3(...verticesLeft);

      let LineTopCenter = new THREE.Vector3();
      let LineFrontCenter = new THREE.Vector3();
      let LineLeftCenter = new THREE.Vector3();

      xAxis.set(verticesTop[0].x);
      yAxis.set(verticesFront[0].y);
      zAxis.set(verticesLeft[0].z);
      xSize.set(0);
      ySize.set(0);
      zSize.set(0);

      axisPoints.current = {
        xAxis: { start: verticesTop[0], end: verticesTop[1] },
        yAxis: { start: verticesFront[0], end: verticesFront[1] },
        zAxis: { start: verticesLeft[0], end: verticesLeft[1] },
      }
      lineTop.getCenter(LineTopCenter)
      lineLeft.getCenter(LineLeftCenter)
      lineFront.getCenter(LineFrontCenter)

      LineTopCenter = isInfiniteVec(LineTopCenter)? new THREE.Vector3():LineTopCenter
      LineLeftCenter = isInfiniteVec(LineLeftCenter)? new THREE.Vector3():LineLeftCenter
      LineFrontCenter = isInfiniteVec(LineFrontCenter)? new THREE.Vector3():LineFrontCenter
      setNotationPositions({
        topLineCenter:LineTopCenter, 
        frontLineCenter:LineLeftCenter, 
        leftLineCenter:LineFrontCenter, 
      })
      linePoints.current = {
        xAxis: initialX,
        yAxis: initialY,
        zAxis: initialZ,
      }
      const modelVolume = Math.min(modelSize.x,Math.min(modelSize.y,modelSize.z))
      coneHeight.current = Math.min(modelVolume,0.02)
      coneRadius.current = coneHeight.current/3
      setAnimation(true);

      // setY(boundingBox.min.y);
      // measurementRef.current?.add(boxHelper)
      //}
    }
  };

  const animateProperty: AnimateProperty = (
    property,
    targetValue,
    duration = 1,
    ease = 'easeIn'
  ) => {
    return animate(property, targetValue, {
      duration,
      ease: ease as Easing,
    });
  };

  useEffect(() => {
    if (isAnimating) {
      animateProperty(xAxis, axisPoints.current['xAxis'].end.x);
      animateProperty(xSize, modelSize.x);
      animateProperty(yAxis, axisPoints.current['yAxis'].end.y);
      animateProperty(ySize, modelSize.y);
      animateProperty(zAxis, axisPoints.current['zAxis'].end.z);
      animateProperty(zSize, modelSize.z);
      setAnimation(false);
    }
  }, [isAnimating]);


  function setContactShadowY(){
    if (modelRef.current) {
      const boundingBox = new THREE.Box3().setFromObject(modelRef.current);
      setY(boundingBox.min.y);
    }
  }
  const totalCount = getTotalModelAndMaterialsToLoad(props.currentProduct);
  useEffect(()=>{
    if(currentCount.models==totalCount.totalModels && currentCount.materials==totalCount.totalMaterials){
        props.setIsModelLoaded && props.setIsModelLoaded(true);
    }
  },[currentCount])


  useEffect(() => {
    showModelDimensions();
    if (!props.showDimensions) {
      setAnimation(false);
      // measurementRef.current && measurementRef.current.clear();
    }
    setContactShadowY()
  }, [props.showDimensions, props.currentProduct]);

  useEffect(() => {
    if (modelRef.current && props.setModelRef) {
      modelRef!=null && props?.setModelRef(modelRef);
    }
  }, [props.currentProduct]);

  const getLineWidth = (percentageZoom: number) => {
    const minLineWidth = 1;
    const medianLineWidth = 3;
    const maxLineWidth = 3;
    const minZoom = 10;
    const maxZoom = 90;

    if (percentageZoom >= maxZoom) return maxLineWidth;
    if (percentageZoom <= minZoom) return minLineWidth;

    // Linear interpolation between minZoom and maxZoom
    return (
      ((percentageZoom - minZoom) * (medianLineWidth - minLineWidth)) /
      (maxZoom - minZoom) +
      minLineWidth
    );
  };

  useFrame(() => {
    if (props.cameraControls.current && props.showDimensions) {
      const maxDistance = props.cameraControls.current.maxDistance;
      const minDistance = props.cameraControls.current.minDistance;
      const currentDistance = props.cameraControls.current._lastDistance;
      const percentageZoom =
        100 -
        ((currentDistance - minDistance) / (maxDistance - minDistance)) * 100;
      const tempLineWidth = getLineWidth(percentageZoom);
      // if (percentageZoom >= 80) coneRadius.current = 0.01;
      // else coneRadius.current = 0.02;
      lineWidth.current = tempLineWidth;
    }
  });
  const data:any[] = [];
  for (const [key, value] of Object.entries(props.currentProduct)) {
    data.push({ key, value });
  }


  const {camera,gl} = useThree();

  const store = useDataStore();


  useEffect(() => {
    setTimeout(()=>{

      if (props.theme!=="EDITOR_MODE" && store.initialAnimationCompleted && modelRef.current && props.cameraControls.current) {
        // Calculate the bounding box of the modelRef
        const boundingBox = new THREE.Box3().setFromObject(modelRef.current);
        const size = new THREE.Vector3();
        boundingBox.getSize(size);
  
        // Calculate the volume of the bounding box
        const newVolume = size.x * size.y * size.z;

        // console.log("camera position",camera.position)
        if(!prevBoundingBox ||Math.abs(newVolume-prevBoundingBox.volume)>0.01){
          const center = new THREE.Vector3();
          boundingBox.getCenter(center);
  
          // Determine the distance the camera should be to fit the model
          const maxDimension = Math.max(size.x, size.y, size.z);
          const distance = maxDimension * 2; // Adjust multiplier as needed
          // Set camera position and adjust CameraControls
          camera.position.set(center.x, center.y, center.z + distance); // Place camera behind the model

          props.cameraControls.current.setLookAt(
            center.x + distance/2,
            center.y + 3,
            center.z + distance/2,
            center.x,
            center.y,
            center.z,
            true // Smooth transition
          );

          setPrevBoundingBox({size, volume:newVolume})
        }
      }
    },500)
  }, [modelRef, camera, props.currentProduct,store.expandedComponent ,prevBoundingBox, store.meshTranslationData, props.theme, props.cameraControls, store.initialAnimationCompleted]);

  const contactShadowProps = props.modelSettings.contactShadowsSettings;

  const axes: Axis[] = ['x', 'y', 'z'];
  const axisMapping: AxisMappingType = {
    x: 'xAxis',
    y: 'yAxis',
    z: 'zAxis',
  };
  const axisRefs: AxisRefTypes = {
    x: xAxis,
    y: yAxis,
    z: zAxis,
  };

  const linePointsRefs: LinePointsType | null = linePoints.current;
  const arrowPointsRefs: LinePointsType | null = arrowPoints.current;
  const axisPointsRefs: AxisPointsType | null = axisPoints.current;
  // console.log(scene);

  return (
    <>
      {/* <Perf /> */}
      <group name='ChildCanvasCustomModelViewer Group' castShadow receiveShadow {...props} dispose={null}>

        <group name='Measurements Group' ref={measurementRef} visible={props.showDimensions} dispose={null}>
          {axes.map((axis) => (
            <AxisComponent
              key={axis}
              visible={props.showDimensions || false}
              coneRadius={coneRadius.current}
              lineWidth={lineWidth.current}
              coneHeight={coneHeight.current}
              color={measurementTheme}
              axis={axis}
              axisRef={axisRefs[axis]}
              linePointRef={linePointsRefs[axisMapping[axis]]}
              arrowPointRef={arrowPointsRefs[axisMapping[axis]]}
              axisPointRef={axisPointsRefs[axisMapping[axis]]}
            />
          ))}
          <Annotation
            show={props.showDimensions ? props.showDimensions : false}
            {...notationPositions}
            theme={props.theme}
            xSize={xSize}
            ySize={ySize}
            zSize={zSize} />
        </group>

        <group
          name='mainModel'
          position={[0, props.modelSettings.verticalAdjustment, 0]}
        >
          <Stage {...props.modelSettings.stageSettings}>
            <group ref={modelRef}>
              {data.map((product: any, index: number) => (
                <Suspense  key={product.key}>
                  <RenderingModelWrapper
                    cameraControls={props.cameraControls}
                    product={product}
                    index={index}
                    products={props.product}
                    key={product.key}
                    showDimensions={props.showDimensions}
                    playAnimation={props.playAnimation}
                    setPlayAnimationVisibility={props.setPlayAnimationVisibility}
                    playAnimationVisibility={props.playAnimationVisibility}
                    onSuccessfulRender={setContactShadowY}
                    setCurrentCount={setCurrentCount}
                    isModelLoaded={props.isModelLoaded}
                  />
                  </Suspense>
              ))}
            </group>
              
            {props.grid && <gridHelper
              castShadow={false}
              args={[50,100]}
              visible={props.grid}
              material={new THREE.LineBasicMaterial({color:'#ccc'})}
            />}
          </Stage>
          {hotspotsComfort?.map((spot: any, index: number) => (
            <Hotspot
              layerName='comfort'
              key={index}
              cameraControls={props.cameraControls}
              spot={spot}
              index={index}
            />
          ))}
          {hotspotsCoils?.map((spot: any, index: number) => (
            <Hotspot
              layerName='coils'
              key={index}
              cameraControls={props.cameraControls}
              spot={spot}
              index={index}
            />
          ))}
        </group>
        <group name='contactShadow' visible={y ? true : false}>
          <ContactShadows
            position-y={y<0 ? y : 0}
            scale={Number(contactShadowProps.scale)}
            opacity={Number(contactShadowProps.opacity)}
            blur={Number(contactShadowProps.blur)}
            near={Number(contactShadowProps.near)}
            far={Number(contactShadowProps.far)}
            height={Number(contactShadowProps.height)}
            width={Number(contactShadowProps.width)}
            color={contactShadowProps.color}
          />
        </group>

      </group>
    </>
  );
}

const modelViewerSettings = {
  "verticalAdjustment": 0,
  "allowedOptions": {
    "allowMeasurement": true,
    "allowAr": true,
    "allowScreenshot": true,
    "allowZoom": true,
    "allowFullscreen": true,
    "allowCameraMovement": false
  },
  "themeSettings": {
    "bgColor": "fff",
    "theme": "v2"
  },
  "canvasSettings": {
    "gl": {
      "preserveDrawingBuffer": true,
      "toneMapping": 0,
      "toneMappingExposure": 0.7
    },
    "camera": {
      "damping": 1,
      "fov": 45,
      "maxDistance": 20,
      "minDistance": 1.25,
      "position": [
        0.8970274473002411,
        0.6588086983930231,
        1.5207110693434738
      ],
      "to_position": [
        2.019677608110914,
        1.1065608314007753,
        4.730902101148846
      ]
    }
  },
  "stageSettings": {
    "intensity": 0.1,
    "shadows": false,
    "adjustCamera": false,
    "environment": {
      "files": {
        "name": "neutral",
        "files": "/assets/environments/neutral.hdr"
      }
    }
  },
  "contactShadowsSettings": {
    "opacity": 0.5,
    "scale": 1,
    "blur": 1.4,
    "near": 0,
    "far": 0.4,
    "height": 1,
    "width": 1,
    "resolution": 256,
    "color": "#000000"
  }
}

export default function CustomModelViewer(props:Omit<
  CustomModelViewerProps,
  "modelViewerSettings" |
  "modelViewerStore"
>) {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [tooltipText, setTooltipText] = useState("");
const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
const [showTooltip, setShowTooltip] = useState(false);

const updateTooltipPosition = (e: React.MouseEvent) => {
  const tooltipWidth = 250;
  const tooltipHeight = 60;

  let left = e.clientX + 20;
  let top = e.clientY + 20;

  if (left + tooltipWidth > window.innerWidth) left = e.clientX - tooltipWidth - 20;
  if (top + tooltipHeight > window.innerHeight) top = window.innerHeight - tooltipHeight - 20;
  if (left < 0) left = e.clientX + 20;
  if (top < 0) top = e.clientY + 20;

  setTooltipPosition({ top, left });
};

  const modelSettings = {
    verticalAdjustment: 0,
    canvasSettings: {
      gl: {
        preserveDrawingBuffer: true,
        toneMapping: THREE.NeutralToneMapping,
        toneMappingExposure: 1
      },
      shadows: true,
    },
    stageSettings: {
      intensity:0,
      shadows: false,
      adjustCamera: false,
      environment: {
        backgroundIntensity: 0.1,
        files:'images/neutral.hdr'
      },
    },
    contactShadowsSettings: {
      position: [0, 0, 0],
      ...modelViewerSettings.contactShadowsSettings,
      resolution: 256,
      color: '#000000',
    },
    environmentSrc: '/assets/environments/Studio02.exr',
  };

  useEffect(()=>{
    THREE.Cache.enabled = true;
  },[])

  const cameraControlsRef = useRef<CameraControls>(null);

  const camera = {
    damping: 1,
    fov: 45,
    maxDistance: 20,
    minDistance: 1.25,
    position: [0, 1.4, 3],
  }
  return (
    <>
      <Suspense fallback={<LoaderLottie />}>
      <div className="h-[80vh] md:h-[90vh] w-full">
        <Canvas dpr={Math.min(window.devicePixelRatio, 2)}  {...modelSettings.canvasSettings} ref={props.canvasRef}>
          {/* <OutlineEffectManager /> */}
          <PerspectiveCamera name='Main Perspective Camera'
            makeDefault
            fov={camera.fov}
            position={new THREE.Vector3(...camera.position)}
            
          />
          <CameraControls ref={cameraControlsRef}
            minDistance={camera.minDistance}
            maxDistance={camera.maxDistance}
            smoothTime={camera.damping}
          />
          {/* {true && ( */}
            <ChildCanvasCustomModelViewer
              cameraControls={cameraControlsRef}
              grid={false}
              {...props}
              modelSettings={modelSettings}
              setIsModelLoaded={props.setIsModelLoaded}
              isModelLoaded={isModelLoaded}
            />
          {/* )} */}
        </Canvas>
        </div>
      </Suspense>
      {showTooltip && (
        <div
          className="fixed z-[9999] bg-black text-white text-xs rounded-md px-3 py-2 shadow-md max-w-[250px] pointer-events-none"
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
          }}
        >
          {tooltipText}
        </div>
      )}
   

    </>
  );
}

