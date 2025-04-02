import { Canvas, CanvasProps, RaycasterProps, RootState, useFrame, useThree } from '@react-three/fiber';
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
  MutableRefObject,
  CSSProperties,
  Key,
} from 'react';
import * as THREE from 'three';
import { getModelMaterialArray } from '../../utils/getModelMaterialArray';
import {
  getMaterialUpdate, updateMaterial
} from '../../utils/updateModelMaterialArray';
import { animate, useMotionValue, Easing, MotionValue } from 'framer-motion';
import LoaderLottie from './LottieLoader/LoaderLottie'
import { StoreApi, UseBoundStore } from 'zustand';
import { PresetsType } from '@react-three/drei/helpers/environment-assets';
import { ModelViewerSettingsType } from '../../types/editorTypes';
import getTotalModelAndMaterialsToLoad from '../../utils/getTotalModelAndMaterialsToLoad';
import { modelViewerStore } from './store/modelViewerStore';

const mapOfCompletedAnimation:Map<THREE.Object3D,number> = new Map()

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
  xSize: MotionValue;
  ySize: MotionValue;
  zSize: MotionValue;
  show: boolean;
  theme?:String;
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
  target?: String[];
  data?: any;
  showDimensions?: any;
  modelViewerStore: UseBoundStore<StoreApi<any>>;
  cameraControls?: any;
  playAnimation?:boolean;
  playAnimationVisibility?:string[];
  onSuccessfulRender:()=>void;
  setPlayAnimationVisibility?: React.Dispatch<React.SetStateAction<string[]>>;
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
  theme?:String;
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
  theme?:String;
  playAnimation?:boolean;
  playAnimationVisibility?:string[];
  setPlayAnimationVisibility?: React.Dispatch<React.SetStateAction<string[]>>;
  setIsModelLoaded?: React.Dispatch<React.SetStateAction<boolean>>;
};
export type RenderingModelWrapperType = {
  product: any;
  index: number;
  products: any;
  showDimensions: any;
  modelViewerStore: UseBoundStore<StoreApi<any>>;
  cameraControls?: any;
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
function isInfiniteVec(a:THREE.Vector3):boolean{
    return a.x==Infinity || a.y==Infinity || a.z==Infinity || a.x==-Infinity || a.y==-Infinity || a.z==-Infinity
};


const CameraAnimationEdit = ({
  cameraFinalPosition,
  cameraControls,
  cameraFinalTarget,
  modelViewerStore,
  hotspotIndex,
}: CameraAnimationProps) => {
  const {
    currentCameraPosition,
    setTargetIndex,
    setIsTargetUpdateInProgress,
    isTargetUpdateInProgress,
    updateHotspotCameraPosition,
  } = modelViewerStore();
  const setAnimationFinalPosition = () => {
    // cameraSet(currentCameraPosition.clone())
    updateHotspotCameraPosition(
      hotspotIndex,
      cameraControls.current?.camera.position.clone()
    );
  };
  const setAnimationFinalTarget = () => {
    setIsTargetUpdateInProgress(true);
    setTargetIndex(hotspotIndex);
  };

  return (
    <div className=" bg-white text-black  border font-medium p-2 rounded-md text-[10px] flex gap-1">
      <div onClick={setAnimationFinalPosition}>
        <button className="border border-black p-2 rounded-md text-blue-600">
          SetCamera
        </button>
        <>
          [{cameraFinalPosition.x.toFixed(2)}
          {','}
          {cameraFinalPosition.y.toFixed(2)}
          {','}
          {cameraFinalPosition.z.toFixed(2)}]
        </>
      </div>
      <div onClick={setAnimationFinalTarget}>
        <button className="border border-black p-2 rounded-md text-blue-600">
          {isTargetUpdateInProgress ? 'SettingTarget' : 'SetTarget'}
        </button>
        <>
          [{cameraFinalTarget.x.toFixed(2)}
          {','}
          {cameraFinalTarget.y.toFixed(2)}
          {','}
          {cameraFinalTarget.z.toFixed(2)}]
        </>
      </div>
    </div>
  );
};

const Hotspot = (props: HotSpotProps) => {
  const [editMode, setEditMode] = useState(false);
  const { removeHotspots } = props.modelViewerStore();
  const { editHotspotMode } = editorStateStore();
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
  const animateCamera = () => {
    // if (isAnimationSet) {
    if (props.cameraControls.current)
      props.cameraControls.current.smoothTime = 0.3;
    const { x: Px, y: Py, z: Pz } = vectorCustomCameraPosition;
    const { x: Tx, y: Ty, z: Tz } = vectorCustomCameraTarget;
    props.cameraControls.current?.setLookAt(Px, Py, Pz, Tx, Ty, Tz, true);
    // }
  };
  const position = props.spot.point.isVector3
    ? props.spot.point
    : new THREE.Vector3(
      props.spot.point.x,
      props.spot.point.y,
      props.spot.point.z
    );
  return (
    <Html position={[position.x, position.y, position.z]} zIndexRange={[1, 0]}>
      <div
        onClick={animateCamera}
        className=" bg-white text-black border font-medium p-2 rounded-md text-[10px] flex gap-1"
      >
        <div>{props.spot.text}</div>
        {editHotspotMode.status && (
          <>
            <div
              onClick={(e) => {
                e.stopPropagation();
                // if (editMode) setAnimation(true)
                setEditMode(!editMode);
              }}
              className="border w-[40px] rounded-md p-1 h-full text-blue-600 hover:cursor-pointer"
            >
              ...{editMode ? 'Save' : 'Edit'}
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                removeHotspots(props.index);
              }}
              className="border w-[40px] rounded-md p-1 h-full text-blue-600 hover:cursor-pointer"
            >
              Delete
            </div>
          </>
        )}
      </div>
      {editMode && (
        <CameraAnimationEdit
          modelViewerStore={props.modelViewerStore}
          cameraControls={props.cameraControls}
          cameraFinalPosition={vectorCustomCameraPosition}
          cameraFinalTarget={vectorCustomCameraTarget}
          hotspotIndex={props.index}
        />
      )}
    </Html>
  );
};

function RenderingModel(props: RenderingModelCompProps) {
  const { camera,...restcene } = useThree();
  const {
    cameraZoom,
    zoomTrigger,
    setCurrentCameraPosition,
    updateHotspotCameraTarget,
    isTargetUpdateInProgress,
    setIsTargetUpdateInProgress,
    targetIndex,
    setTargetIndex,
    setLastClickedPoint,
  } = props.modelViewerStore();
  const thisLoader = useGLTF(props.src);
  const [isMaterialLoaded,setIsMaterialLoaded] = useState(false);
  const loader1 = thisLoader.scene as THREE.Object3D;
  const meshRef = useRef<THREE.Object3D>(loader1);
  const { animations } = thisLoader;
  const [currentAnimation, setCurrentAnimation] = useState<string[]>([]);
  const { actions } = useAnimations(animations, meshRef);
  //Hovering with responses
  const [hovered, setHover] = useState(null);

  const [firstIteration,setFirstIteration] = useState<boolean>(true)
  const { setOpenSetHotspotName, editHotspotMode } = editorStateStore();

  const handleClick = (e: any) => {
    e.stopPropagation();
    setCurrentCameraPosition(props?.cameraControls?.current?.camera?.position);
    if (!editHotspotMode.status) return;
    if (isTargetUpdateInProgress && targetIndex !== null) {
      updateHotspotCameraTarget(targetIndex, e.point);
      setIsTargetUpdateInProgress(false);
      setTargetIndex(null);
    } else {
      setLastClickedPoint(e.point);
      setOpenSetHotspotName({ status: true, editIndex: -1 });
    }
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

  useEffect(() => {
    const action = actions["alwaysAnimate"];
    if (!action || !meshRef.current) return;
    
    const duration = mapOfCompletedAnimation.get(meshRef.current)
    if (duration) {
      action.time = duration; // Move to last frame
      action.play().setLoop(THREE.LoopOnce, 1)
      action.clampWhenFinished = true;
      return;
    }
    
    action.reset().fadeIn(0.5).play().setLoop(THREE.LoopOnce, 1);
    
    action.enabled = true;
    action.clampWhenFinished = true;
  
    action.getMixer().addEventListener("finished", (e) => {
      mapOfCompletedAnimation.set(meshRef.current, e.action.getClip().duration);
    });
  
  }, [actions]);

  useEffect(()=>{
    const req = {...actions}
    if (req.playOnButton && props.setPlayAnimationVisibility) {
      props.setPlayAnimationVisibility(prev=>[...prev, props.name]);
      if (props.playAnimation) {
        req["playOnButton"].paused=false;
        req["playOnButton"]?.setLoop(THREE.LoopRepeat,Infinity);
        req["playOnButton"]?.play();
      }else if(firstIteration){
        req["playOnButton"].paused=false;
        req["playOnButton"]?.setLoop(THREE.LoopOnce,1);
        req["playOnButton"]?.play();
        setFirstIteration(false)
      }
      else {
        req["playOnButton"].paused=true;
      }
    }
  },[actions,props.playAnimation,props.values]);

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

  useEffect(() => {
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
    loader1.traverse((child: THREE.Object3D) => {
      if ((child as THREE.Mesh).isMesh) {
        updatedMapping.map((d: any, i: number) => {
          if (d?.target.includes(child.name)) {
            // const color = new THREE.Color('#2e1403');
            // child.material.color = color;
            updateMaterial(d, (child as THREE.Mesh).material,setIsMaterialLoaded);
          }
        });
        // props.data.map((d: any, i: number) => {
        //   if (d.target.includes(child.name)) (child as THREE.Mesh).material = d.material;
        // });
      }
    });
  }, [props.values]);

  useEffect(() => {
    if (cameraZoom === 2 || cameraZoom === -2) {
      const currentDistance = props.cameraControls.current._lastDistance;
      if (props.cameraControls.current)
        props.cameraControls.current.smoothTime = 0.1;
      const zoomValue = cameraZoom > 0 ? 0.08 : -0.08;

      props.cameraControls?.current?.dolly(zoomValue, true);
      // props.cameraControls?.current?.forward(zoomValue, true);
      // props.cameraControls?.current?.zoom(zoomValue, true);
      camera.updateProjectionMatrix();
    }
  }, [zoomTrigger]);

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
    // @ts-ignore
    <primitive
      ref={meshRef}
      position={[0, 0, 0]}
      onDoubleClick={handleClick}
      name={"Primitive_"+props.product}
      // onClick={handleClick}
      // onPointerOver={handlePointerOver}
      // onPointerOut={handlePointerOut}
      object={meshRef.current}
    />
  );
}

function RenderingModelWrapper(props: RenderingModelWrapperType) {
  const data = getModelMaterialArray(
    props.product.value.parts,
    props.products,
    props.product.key
  );

  return  props.product.value.visible && 
          props.products.models[props.product.key]?.modelSrc && 
          <RenderingModel
            index={props.index}
            modelViewerStore={props.modelViewerStore}
            src={props.products.models[props.product.key]?.modelSrc}
            values={props.product.value.parts}
            product={props.product}
            products={props.products}
            key={props.index + props.product.value.modelSrc}
            name={props.product.key}
            animation={props.product.value.animation}
            visible={props.product.value.visible}
            data={data}
            showDimensions={props.showDimensions}
            cameraControls={props.cameraControls}
            playAnimation={props.playAnimation}
            onSuccessfulRender={props.onSuccessfulRender}
            setPlayAnimationVisibility={props.setPlayAnimationVisibility}
            playAnimationVisibility={props.playAnimationVisibility}
            setCurrentCount={props.setCurrentCount}
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
  props: ChildCanvasCustomModelViewerProps
) => {
  const { hotspots } = props.modelViewerStore();
  const {scene} = useThree()
  const measurementRef = useRef<THREE.Group<THREE.Object3DEventMap>>(null);
  const modelRef = useRef<THREE.Group<THREE.Object3DEventMap>>(null);
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
      props?.setModelRef(modelRef);
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

  const data = [];
  for (const [key, value] of Object.entries(props.currentProduct)) {
    data.push({ key, value });
  }


  const {camera,gl} = useThree();


  useEffect(() => {
    setTimeout(()=>{
      if (props.theme!=="EDITOR_MODE" && props?.product?.viewerSettings?.allowedOptions?.allowCameraMovement && modelRef.current && props.cameraControls.current) {
        // Calculate the bounding box of the modelRef
        const boundingBox = new THREE.Box3().setFromObject(modelRef.current);
        const size = new THREE.Vector3();
        boundingBox.getSize(size);
  
        // Calculate the volume of the bounding box
        const newVolume = size.x * size.y * size.z;
        if(!prevBoundingBox ||Math.abs(newVolume-prevBoundingBox.volume)>0.01){
          const center = new THREE.Vector3();
          boundingBox.getCenter(center);
  
          // Determine the distance the camera should be to fit the model
          const maxDimension = Math.max(size.x, size.y, size.z);
          const distance = maxDimension * 2; // Adjust multiplier as needed
          // Set camera position and adjust CameraControls
          camera.position.set(center.x, center.y, center.z + distance); // Place camera behind the model
          const cameraEndPosition = props.modelViewerSettings.camera.to_position;
          if(cameraEndPosition){
            props.cameraControls.current.setLookAt(
              cameraEndPosition[0],
              cameraEndPosition[1],
              cameraEndPosition[2],
              center.x,
              center.y,
              center.z,
              true // Smooth transition
            );
          }else{
            props.cameraControls.current.setLookAt(
              center.x + 0.5,
              center.y + 0.5,
              center.z + distance,
              center.x,
              center.y,
              center.z,
              true // Smooth transition
            );
          }
          setPrevBoundingBox({size, volume:newVolume})
        }
      }
    },500)
  }, [modelRef, camera,props.currentProduct, prevBoundingBox]);

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
          ref={modelRef}
          position={[0, props.modelSettings.verticalAdjustment, 0]}
        >
          <Stage {...props.modelSettings.stageSettings}>
              {data.map((product: any, index: number) => (
                <Suspense key={product.key} >
                  <RenderingModelWrapper
                    modelViewerStore={props.modelViewerStore}
                    cameraControls={props.cameraControls}
                    product={product}
                    index={index}
                    products={props.product}
                    key={index}
                    showDimensions={props.showDimensions}
                    playAnimation={props.playAnimation}
                    setPlayAnimationVisibility={props.setPlayAnimationVisibility}
                    playAnimationVisibility={props.playAnimationVisibility}
                    onSuccessfulRender={setContactShadowY}
                    setCurrentCount={setCurrentCount}
                  />
                  </Suspense>
              ))}
              
            {props.grid && <gridHelper
              castShadow={false}
              args={[50,100]}
              visible={props.grid}
              material={new THREE.LineBasicMaterial({color:'#ccc'})}
            />}
          </Stage>
          {hotspots?.map((spot: any, index: number) => (
            <Hotspot
              modelViewerStore={props.modelViewerStore}
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

export default function CustomModelViewer(props: CustomModelViewerProps) {
  
  const modelSettings: ModelSettingsType = {
    verticalAdjustment: 0,
    canvasSettings: {
      gl: {
        preserveDrawingBuffer: true,
        toneMapping: isNaN(props.modelViewerSettings?.viewerSettings?.toneMapping)? THREE.NeutralToneMapping:props.modelViewerSettings?.viewerSettings?.toneMapping,
        toneMappingExposure: isNaN(props.modelViewerSettings?.viewerSettings?.toneMappingExposure)? 1:props.modelViewerSettings?.viewerSettings?.toneMappingExposure,
      },
      shadows: true,
    },
    stageSettings: {
      intensity:0,
      shadows: false,
      adjustCamera: false,
      environment: {
        backgroundIntensity: isNaN(props.modelViewerSettings?.viewerSettings?.intensity)? 0.1:props.modelViewerSettings?.viewerSettings?.intensity,
        files:
          'https://d3dhh9nc6fiq1.cloudfront.net' +
          props.modelViewerSettings.enviromentPreset,
      },
    },
    contactShadowsSettings: {
      position: [0, 0, 0],
      ...props.modelViewerSettings.contactShadows,
      resolution: 256,
      color: '#000000',
    },
    environmentSrc: '/assets/environments/Studio02.exr',
  };
  const { setCurrentCameraPosition } = props.modelViewerStore()
  const cameraControlsRef = useRef<CameraControls>(null);
  return (
    <>
      <Suspense fallback={<LoaderLottie />}>
        {props.currentProduct && Object.keys(props.currentProduct).length > 0 && (
          <Canvas {...modelSettings.canvasSettings} ref={props.canvasRef} >
            <PerspectiveCamera name='Main Perspective Camera'
              makeDefault
              fov={props.modelViewerSettings.camera.fov}
              position={props.modelViewerSettings.camera.position}
              
            />
            <CameraControls ref={cameraControlsRef}
              onEnd={()=>{props.theme=="EDITOR_MODE" && cameraControlsRef?.current?.camera?.position && setCurrentCameraPosition(cameraControlsRef?.current?.camera?.position)}}
              minDistance={props.modelViewerSettings.camera.minDistance}
              maxDistance={props.modelViewerSettings.camera.maxDistance}
              smoothTime={props.modelViewerSettings.camera.damping}
            />
            {props.product && (
              <ChildCanvasCustomModelViewer
                cameraControls={cameraControlsRef}
                {...props}
                grid={props.modelViewerSettings.grid || false}
                modelSettings={modelSettings}
                setIsModelLoaded={props.setIsModelLoaded}
              />
            )}
          </Canvas>
        )}
      </Suspense>
    </>
  );
}
