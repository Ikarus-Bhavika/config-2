import React, { useEffect, useRef, useState } from 'react'
import CustomModelViewer from './ModelViewerComponents/CustomModelViewer'
import { Group, Object3DEventMap } from 'three'
import { useSearchParams } from 'react-router-dom'
import LZString from 'lz-string'
import decompressProductJSON from '../utils/decompressProductJSON'
import useDataStore from '../store/store'

export default function ModelViewer() {
    
    const store = useDataStore();

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isModelLoaded,setIsModelLoaded] = useState<boolean>(false)
    const [modelRef,setModelRef] = useState<React.RefObject<Group<Object3DEventMap>>>(useRef(new Group()))
    const [params] = useSearchParams()
    const [product, setProduct] = useState<any>(null)
    const [menuUI, setMenuUI] = useState(null)
    const [menuThemeSpecifics, setMenuThemeSpecifics] = useState(null)
    const [menuInfo, setMenuInfo] = useState(null)
    const [defaultPresetFromJson, setDefaultPresetFromJson] = useState(null)
    const [renders, setRenders] = useState([])
    const [preset, setPreset] = useState<any>()
    const [isPresetLoaded, setPresetLoad] = useState(false)
    const [isThemeLoaded, setThemeLoad] = useState(false)
    const [showDimensions, setShowDimensions] = useState(false)
    const [productId, setProductId] = useState<string>("")
    const [sharedVariants, setSharedVariants] = useState()
    const [theme, setTheme] = useState('v2')
    const [pageBackgroundColor, setPageBackgroundColor] = useState('#ffffff')
    const [isSharedVariants,setIsSharedVariants] = useState(false);
    const [loadingAr,setLoadingAr] = useState(false);
    const [playAnimation,setPlayAnimation] = useState(false);
    const [playAnimationVisibility,setPlayAnimationVisibility] = useState<string[]>([]);
    const isOnPhone = window.innerWidth < 1024;

    const setProductFromJSON = product => setProduct(product)

    useEffect(() => {
        const sharedVarients = params.get('sharedVarients')
        const ar = params.get('ar')
        if(ar){
        params.delete('ar',"true");
        }
        // const decodeVariants = jwt.decode(sharedVarients);
        if (sharedVarients) {
        const decodeVariants = JSON.parse(
            LZString.decompressFromEncodedURIComponent(sharedVarients)
        )
        // setSharedVariants(decodeVariants)
        if(preset){
            const newJSON = decompressProductJSON(preset,decodeVariants)
            setSharedVariants(newJSON);
            setPreset(newJSON);

            // if(!ar){
            //   params.delete('sharedVarients',sharedVarients);
            // }
        }
        (ar && isOnPhone) && setIsSharedVariants(true);
        setTimeout(() => {
            setThemeLoad(true)
        }, 200)
        }
    }, [params.get('sharedVarients'),preset])

    useEffect(()=>{
        if(isModelLoaded && sharedVariants){
        params.delete('sharedVarients',params.get('sharedVarients') || "")
        setPreset(sharedVariants);
        }
    },[isModelLoaded])

    useEffect(()=>{
        const productId2 = params.get('id')
        if (productId2) {
        setProductId(productId2)
        const data =
            `${import.meta.env.VITE_S3_CLOUDFRONT}/assets/configurations/` +
            productId2 +
            `/master.json`
        fetch(`${data}`, { cache: 'no-cache' }).then(response =>
            response.json().then(res => setProductFromJSON(res))
        )
        }
    },[params.get('id')])


    const handleStopAnimation = models => {
        let modelNames:string[] = []
        Object.keys(models).forEach(key => modelNames.push(key))

        return {
        label: 'None',
        icon: 'https://d3dhh9nc6fiq1.cloudfront.net/assets/no-svgrepo-com.svg',
        animations: modelNames.map(modelName => ({
            model: modelName,
            animation: null,
        })),
        }
    }

    useEffect(() => {
        if (product && !isPresetLoaded) {
        let updatedTheme = theme
        let updatedBgColor = pageBackgroundColor
        if (product.viewerSettings.themeSettings) {
            const { theme, bgColor } = product.viewerSettings.themeSettings
            updatedTheme = theme
            updatedBgColor = bgColor
        }
        setTheme(updatedTheme)
        setPageBackgroundColor(updatedBgColor)

        const stopAnimation = handleStopAnimation(product.models)
        product.menuSettings?.menuUI?.map(
            el => el.type === 'animation' && el.options.unshift(stopAnimation)
        )
        product?.defaultPreset && setDefaultPresetFromJson(product?.defaultPreset)
        setMenuUI(product.menuSettings.menuUI)
        setMenuThemeSpecifics(product.menuSettings.menuThemeSpecifics)
        setMenuInfo(product.menuSettings.menuInfo)

        const customDefaultPreset = Object.entries(product.models).reduce(
            (aggr, [modelName, modelDetails], index) => ({
            ...aggr,
            [modelName]: {
                visible: !index,
                animation: [],
                parts: Object.entries((modelDetails as any).parts).reduce(
                    (aggr, [partName, partDetails]) => ({
                        ...aggr,
                        [partName]: { material: Object.keys((partDetails as any).materials)[0] },
                    }),
                    {}
                ),
            },
            }),
            {}
        )

        setRenders(product.renders)
        if (sharedVariants) {
            // setPreset(sharedVariants)
            setTimeout(() => {
            setPresetLoad(true)
            setThemeLoad(true)
            }, 200)
        } else {
            if (product?.defaultPreset) setPreset(product.defaultPreset)
            else setPreset(customDefaultPreset)
            setTimeout(() => {
            setPresetLoad(true)
            setThemeLoad(true)
            }, 200)
        }
        }
    }, [product])

    useEffect(() => {
        if (product && !isPresetLoaded) {
        window.addEventListener('message', event => {
            if (event.data && event.data.type == 'variant-type') {
            const r = event.data.payload
            // const t = getModelSrc(product, r)
            setPreset(r)
            }
        })
        }
    }, [product])

  
    return (
        <div className='h-[55%] lg:h-[100dvh] lg:w-3/5 xl:w-[75%] bg-white'>
            <CustomModelViewer
                setModelRef={setModelRef}
                product={{models:store.modelConfig}}
                currentProduct={store.preset}
                canvasRef={canvasRef}
                showDimensions={showDimensions}
                theme={theme}
                setIsModelLoaded={setIsModelLoaded}
                playAnimation={playAnimation}
                playAnimationVisibility={playAnimationVisibility}
                setPlayAnimationVisibility={setPlayAnimationVisibility}
            />
        </div>
    )
}