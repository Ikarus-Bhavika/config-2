import ModelViewer from './ModelViewer'
import MobileMenu from './MobileMenu'
import Menu from './Menu'

export default function Main() {
  return (
    <main className='flex flex-col lg:flex-row w-[100dvw] h-[100dvh] justify-end'>
        <ModelViewer />
        <MobileMenu />
        <Menu/>
    </main>
  )
}
