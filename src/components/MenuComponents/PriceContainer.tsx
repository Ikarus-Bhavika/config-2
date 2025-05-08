import useDataStore from "../../store/store"
import getPrice from "../../utils/getPrice.js"
export default function PriceContainer() {
  const store = useDataStore();
  return window.innerWidth<1024 ? (
      <div className=" flex flex-col lg:flex-row gap-4 items-center">
        <div className="px-2 w-full flex lg:flex-col justify-between font-semibold text-[18px] lg:text-[16px]">
          <div className="lg:text-[14px] lg:font-medium">Total Price</div>
          <div className="lg:text-[18px] lg:font-medium">${getPrice(store.modelConfig, store.preset, 0).price + 2000}.00</div>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <button className="px-1 cursor-pointer flex gap-2 w-full justify-center items-center text-[16px] lg:whitespace-nowrap lg:px-4 border border-black  py-2 lg:py-3 rounded-md font-semibold">
            <img src="/Online Store.png" width={100} height={100} alt="store" className="w-6 h-6"/>
            Store near you
          </button>
          <button className="px-1 cursor-pointer flex gap-2 w-full justify-center items-center text-[16px] lg:whitespace-nowrap lg:px-4 border border-black  py-2 lg:py-3 rounded-md font-semibold">
            <img src="/Timesheet.png" width={100} height={100} alt="store" className="w-6 h-6"/>
            Book an appointment
          </button>
          <button className="px-1 cursor-pointer flex gap-2 w-full justify-center items-center text-[16px] lg:whitespace-nowrap lg:px-4 bg-black text-white py-2 lg:py-3 rounded-md font-semibold">
            <img src="/Add Shopping Cart.png" width={100} height={100} alt="store" className="w-6 h-6"/>
            Add To Cart
          </button>

        </div>
      </div>
    ):(
      <div className="flex flex-col w-full gap-4 items-center 3xl:pt-2">
        <div className="flex gap-4 items-center w-full 3xl:pt-2">
          <div className="w-1/3 flex flex-col">
            <div className="lg:text-[14px] lg:font-medium">Total Price</div>
            <div className="lg:text-[18px] lg:font-medium">${getPrice(store.modelConfig, store.preset, 0).price + 2000}.00</div>
          </div>
          <div className="flex w-2/3 justify-end gap-2">
            <button className="w-2/3 cursor-pointer flex gap-1 items-center justify-center 3xl:py-3 bg-black rounded-md text-white whitespace-nowrap p-2 px-4 text-[14px] 2xl:text-[16px]">
              <img src="/Add Shopping Cart.png" width={100} height={100} alt="store" className="w-6 h-6"/>
              Add To Cart
            </button>
          </div>
        </div>
        <div className="flex gap-4 items-center w-full 3xl:pt-2">
            <div className="w-2/5 flex flex-col">
              <button className="w-full flex gap-1 items-center justify-center cursor-pointer 3xl:py-3 border border-gray-400 rounded-md whitespace-nowrap p-2 text-[14px] 2xl:text-[16px]">
                <img src="/Online Store.png" width={100} height={100} alt="store" className="w-6 h-6"/>
                  Store near you
              </button>
            </div>
            <div className="flex w-3/5 gap-2 justify-end">
              <button className="w-full cursor-pointer justify-center flex gap-1 items-center 3xl:py-3 border border-gray-400 rounded-md whitespace-nowrap p-2 text-[14px] 2xl:text-[16px]">
              <img src="/Timesheet.png" width={100} height={100} alt="store" className="w-6 h-6"/>
                Book an appointment
              </button>
            </div>
        </div>
      </div>
  )
}
