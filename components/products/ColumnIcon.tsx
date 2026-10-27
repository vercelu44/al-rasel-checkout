'use client'
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react'
import { useAppSelector } from '@/store/hooks';

/** One bar of the column icon (dark when that column count is active) */
const MakeDesign = ({ className }: { className?: string | false }) => {
    return <span className={cn('h-5 w-2 bg-gray-600 inline-block', className)}></span>
}

const ColumnIcons = () => {
    const {isFilterPanelOpen} = useAppSelector(state => state.common)
    const router = useRouter();
    const searchParams = useSearchParams();
    // Media query
    const isMobile = useMediaQuery("(max-width: 768px)");
    const isFiveThou = useMediaQuery("(max-width: 1536px)");
    const isNineTwo = useMediaQuery("(max-width: 1279px)");
    const columnNumber = searchParams.get('col')
    // same result as the old loose `isColumn(3)` check
    const isColumn = (n: number) => columnNumber !== null && Number(columnNumber) === n

    const isAditionalCard = !isFilterPanelOpen ? 1 : 0 ;

    // Show query column number
    const handleColumn = (colNumber: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("col", String(colNumber));
        router.push(`?${params.toString()}`);
    }

    

    useEffect(() => {
        if(isFiveThou && columnNumber ){
            const params = new URLSearchParams(searchParams.toString());
            params.set("col", String(4 + isAditionalCard));
            router.push(`?${params.toString()}`);
       }
        if(isNineTwo && columnNumber ){
            const params = new URLSearchParams(searchParams.toString());
            params.set("col", String(3 + isAditionalCard));
            router.push(`?${params.toString()}`);
       }
        if(isMobile && columnNumber ){
            const params = new URLSearchParams(searchParams.toString());
            params.set("col", String(2 + isAditionalCard));
            router.push(`?${params.toString()}`);
       }
    }, [isFiveThou,isNineTwo,isMobile]);


    if(isMobile){
        return null;
    }


  return (
   <div className='flex gap-2'>
    
        <button type='button' aria-label='Show 3 columns' onClick={() => handleColumn(3)} className='flex gap-0.5 border border-black p-0.5'>
            <MakeDesign className={ isColumn(3) && 'bg-black'} />
            <MakeDesign className={ isColumn(3) && 'bg-black'} />
            <MakeDesign className={ isColumn(3) && 'bg-black'} />
        </button>
    
        <button type='button' aria-label='Show 4 columns' onClick={() => handleColumn(4)} className='flex gap-0.5 border border-black p-0.5'>
            <MakeDesign className={ isColumn(4) && 'bg-black'} />
            <MakeDesign className={ isColumn(4) && 'bg-black'} />
            <MakeDesign className={ isColumn(4) && 'bg-black'} />
            <MakeDesign className={ isColumn(4) && 'bg-black'} />
        </button>
        
        {!isFiveThou && 
        <button type='button' aria-label='Show 5 columns' onClick={() => handleColumn(5)} className='flex gap-0.5 border border-black p-0.5'>
            <MakeDesign className={ isColumn(5) && 'bg-black'} />
            <MakeDesign className={ isColumn(5) && 'bg-black'} />
            <MakeDesign className={ isColumn(5) && 'bg-black'} />
            <MakeDesign className={ isColumn(5) && 'bg-black'} />
            <MakeDesign className={ isColumn(5) && 'bg-black'} />
        </button>
    }
   </div>
  )
}

export default ColumnIcons