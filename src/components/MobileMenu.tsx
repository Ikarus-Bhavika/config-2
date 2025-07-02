import { RefObject } from "react";
import MenuHeader from './MenuComponents/MenuHeader';
import MenuContainer from './MenuComponents/MenuContainer';
import PriceContainer from './MenuComponents/PriceContainer';
import useDataStore from '../store/store';

export default function MobileMenu({ configRef }: { configRef: RefObject<HTMLDivElement | null> }) {
  const store = useDataStore();

  return (
    <div
      style={{ boxShadow: '-3px 0px 7px 0px #00000026' }}
      className={`${
        !store.expandModel && 'pointer-events-none'
      } select-none bg-[#F5F8FB] h-[45%] lg:hidden p-4 lg:p-10 flex flex-col gap-2 overflow-y-auto`}
    >
      <MenuHeader />
      <MenuContainer />
      <hr className='mt-5 mb-1 border border-[#0000002E] w-[95%] mx-auto' />

      {/* ✅ Pass configRef into PriceContainer */}
      <PriceContainer configRef={configRef} />
    </div>
  );
}
