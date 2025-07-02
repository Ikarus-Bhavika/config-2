// import ModelViewer from './ModelViewer'
// import MobileMenu from './MobileMenu'
// import Menu from './Menu'

// export default function Main() {
//   return (
//     <main className='flex flex-col lg:flex-row w-[100dvw] h-[100dvh]'>
//         <ModelViewer />
//         <MobileMenu />
//         <Menu/>
//     </main>
//   )
// }

 import ModelViewer from './ModelViewer'
 import MobileMenu from './MobileMenu'
import Menu from './Menu'
import { useRef } from 'react';



export default function Main() {
  // ✅ Shared ref for the configurator canvas
  const canvasRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col lg:flex-row w-full h-full">
      {/* ✅ Pass shared canvasRef to ModelViewer */}
      <ModelViewer canvasRef={canvasRef} />

      {/* ✅ Pass same canvasRef to Menu → PriceContainer */}
      <Menu canvasRef={canvasRef} />
      <MobileMenu configRef={canvasRef}/>
    </div>
  );
}
