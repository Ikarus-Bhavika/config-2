import MenuHeader from './MenuComponents/MenuHeader'
import MenuContainer from './MenuComponents/MenuContainer'
import PriceContainer from './MenuComponents/PriceContainer'

export default function MobileMenu() {
  return (
    <div style={{boxShadow:'-3px 0px 7px 0px #00000026'}} 
      className='bg-[#F5F8FB] h-[45%] lg:hidden p-4 lg:p-10 flex flex-col gap-2 overflow-y-auto'>
      <MenuHeader />
      <MenuContainer/>
      <hr className='mt-5 mb-1 border border-[#0000002E] w-[95%] mx-auto'/>
      <PriceContainer/>
    </div>
  )
}
