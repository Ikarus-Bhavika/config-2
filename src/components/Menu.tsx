import MenuContainer from "./MenuComponents/MenuContainer";
import MenuHeader from "./MenuComponents/MenuHeader";
import PriceContainer from "./MenuComponents/PriceContainer";

export default function Menu() {
  return (
    <div className="hidden lg:w-2/5 h-[100dvh] lg:flex flex-col justify-center items-center">
      <div className="w-3/4 3xl:w-3/5 py-6 xl:py-10 shadow-md rounded-xl bg-[#F5F8FB] h-[90%] flex p-4 flex-col gap-4">
        <MenuHeader/>
        <div className="w-full grow overflow-y-auto rounded-md flex flex-col gap-2">
        <MenuContainer/>
        </div>
        <hr className='mt-5 mb-1 border border-[#0000002E] w-[95%] mx-auto'/>
        <PriceContainer/>
      </div>
    </div>
  )
}
