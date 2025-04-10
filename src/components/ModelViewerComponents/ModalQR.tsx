import QRCode from 'qrcode'
import { Ref, useEffect, useState } from 'react'
import Cross from '../../assets/Cross'
import LZString from 'lz-string'
import './ModalQR.css'
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js'
import compressProductJSON from '../../utils/compressProductJSON'
import { useModelViewerStates } from '../../store/modelViewerContext'
import { useNavigate } from 'react-router-dom'
import { Group, Object3DEventMap } from 'three'

export default function ModalQR({
  currentProduct,
  modelRef,
  openAR,
  close,
}:{
  currentProduct: any
  modelRef:React.RefObject<Group<Object3DEventMap>>,
  openAR:boolean,
  close: ()=>void
}){
  const [qrCodeData, setQrCodeData] = useState()
  const navigate = useNavigate()

  const bIsOnSmallScreen = window.innerWidth < 1024;

  const { changePropsState } = useModelViewerStates()

  function gltfExporter(modelRef) {

      // const usdzExporter = new USDZExporter()
      // usdzExporter.parse(modelRef.current,(result)=>{
      //   // const output = JSON.stringify(result, null, 2)
      //   const blob = new Blob([result], { type: 'text/plain' });
      //   const iosSrc = URL.createObjectURL(blob)
      //   // const a = document.createElement("a")
      //   // a.href = URL.createObjectURL(blob)
      //   // a.download = "usdz1.usdz"
      //   // a.click()
    

        const exporter = new GLTFExporter()
        exporter.parse(
          modelRef.current,
          function (glb) {
            console.log("FILE",glb)
            const output = JSON.stringify(glb, null, 2)
            const blob = new Blob([output], { type: 'text/plain' });
            // const link = document.createElement('a');
            const newJSON = compressProductJSON(currentProduct);
            const stringifiedJWT = JSON.stringify(newJSON)
            const signedJWT = LZString.compressToEncodedURIComponent(stringifiedJWT)
            // link.href = URL.createObjectURL(blob);
            const windowUrl = `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}`
            const siteurl = `${windowUrl}?sharedVarients=${signedJWT}`;
            changePropsState({ 
              url: URL.createObjectURL(blob),
              blob, 
              // iosURL:iosSrc,
              siteURL: siteurl
            })
            navigate(`/ar-view`,{replace:true})
          },
          err => console.error('ERR->', err)
        )
    }

    console.log(bIsOnSmallScreen)

    useEffect(()=>{
      if(openAR){
        console.log("here",modelRef)
        gltfExporter(modelRef);
      }
    },[openAR])
    
    useEffect(() => {
      if (!bIsOnSmallScreen) {
        const newJSON = compressProductJSON(currentProduct);
        const stringifiedJWT = JSON.stringify(newJSON)
        const signedJWT = LZString.compressToEncodedURIComponent(stringifiedJWT)
        const windowUrl = `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}`
        const shareableURL = `${windowUrl}/shared?sharedVarients=${signedJWT}&ar=${true}`
        console.log("shareableURL",shareableURL)
        console.log("qrcode",newJSON)
        QRCode.toDataURL(shareableURL, { errorCorrectionLevel: 'M' })
        .then(url => {
          setQrCodeData(url)
        })
        .catch(err => console.error(err.message))
      }else{
        console.log("here",modelRef.current)
        gltfExporter(modelRef)
      }
    },[modelRef])

  return (
    <div className='modal-container'>
      {!bIsOnSmallScreen && (
        <div className='modal-content'>
          <div className='modal-close' onClick={close}>
            <Cross />
          </div>
          <div className='qr-code-container'>
            <div>
              <img src={qrCodeData} alt='QR Code' height={300} width={300} />
            </div>
          </div>
          <div className='modal-text'>
            <p>Scan QR Code with your smartphone camera to</p>
            <p>
              place your
              <span className='bold-text'> Model </span>
              configuration in your room.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}