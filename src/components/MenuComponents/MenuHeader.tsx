import useDataStore from '../../store/store'

export default function MenuHeader() {
  const store = useDataStore();
  return (
    <div className='flex flex-col gap-1'>
        <div className='text-[20px] lg:text-[26px] font-semibold'>{store.productDetails.title}</div>
        <div className='text-[13px] text-gray-600'>{store.productDetails.description}</div>
    </div>
  )
}
