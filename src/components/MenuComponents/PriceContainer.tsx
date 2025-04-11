import useDataStore from "../../store/store"
import getPrice from "../../utils/getPrice.js"
export default function PriceContainer() {
  const store = useDataStore();
  return window.innerWidth<1024 ? (
      <div className=" flex flex-col lg:flex-row gap-4 items-center">
        <div className="px-2 w-full flex lg:flex-col justify-between font-semibold text-[18px] lg:text-[16px]">
          <div className="lg:text-[14px] lg:font-medium">Total Price</div>
          <div className="lg:text-[18px] lg:font-medium">${getPrice(store.modelConfig, store.preset, 0).pric + 2000}.00</div>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <button className="px-1 cursor-pointer flex w-full justify-center items-center text-[18px] lg:text-[14px] lg:whitespace-nowrap lg:px-4 border border-black  py-2 lg:py-3 rounded-md font-semibold">Save</button>
          <button className="px-1 cursor-pointer flex w-full justify-center items-center text-[18px] lg:text-[14px] lg:whitespace-nowrap lg:px-4 bg-black text-white py-2 lg:py-3 rounded-md font-semibold">Add to Cart</button>
        </div>
      </div>
    ):(
      <div className="flex flex-col lg:flex-row gap-4 items-center 3xl:pt-2">
        <div className="w-1/3 flex flex-col">
          <div className="lg:text-[14px] lg:font-medium">Total Price</div>
          <div className="lg:text-[18px] lg:font-medium">${getPrice(store.modelConfig, store.preset, 0).price + 2000}.00</div>
        </div>
        <div className="flex w-2/3 gap-2">
          <button className="w-1/2 cursor-pointer 3xl:py-3 border border-black rounded-md whitespace-nowrap p-2 text-[14px]">Save</button>
          <button className="w-1/2 cursor-pointer 3xl:py-3 bg-black rounded-md text-white whitespace-nowrap p-2 text-[14px]">Add To Cart</button>
        </div>
      </div>
  )
}
