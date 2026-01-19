'use client'
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';

const ColumnIcons = () => {
    const {isFilterPanelOpen} = useSelector(state => state.common)
    const router = useRouter();
    const searchParams = useSearchParams();
    // Media query
    const isMobile = useMediaQuery("(max-width: 768px)");
    const isFiveThou = useMediaQuery("(max-width: 1536px)");
    const isNineTwo = useMediaQuery("(max-width: 1279px)");
    const columnNumber = searchParams.get('col')

    const isAditionalCard = !isFilterPanelOpen ? 1 : 0 ;

    // Show query column number
    const handleColumn = (colNumber) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("col", colNumber);
        router.push(`?${params.toString()}`);
    }

    

    useEffect(() => {
        if(isFiveThou && columnNumber ){
            const params = new URLSearchParams(searchParams.toString());
            params.set("col", 4 + isAditionalCard);
            router.push(`?${params.toString()}`);
       }
        if(isNineTwo && columnNumber ){
            const params = new URLSearchParams(searchParams.toString());
            params.set("col", 3 + isAditionalCard);
            router.push(`?${params.toString()}`);
       }
        if(isMobile && columnNumber ){
            const params = new URLSearchParams(searchParams.toString());
            params.set("col", 2 + isAditionalCard);
            router.push(`?${params.toString()}`);
       }
    }, [isFiveThou,isNineTwo,isMobile]);


    const MakeDesign =  ({className}) => {
        return <span className={cn('h-5 w-2 bg-gray-600 inline-block', className)}></span>
    }


    if(isMobile){
        return null;
    }


  return (
   <div className='flex gap-2'>
    
        <button type='button' onClick={() => handleColumn(3)} className='flex gap-0.5 border border-black p-0.5'>
            <MakeDesign className={ columnNumber == 3 && 'bg-black'} />
            <MakeDesign className={ columnNumber == 3 && 'bg-black'} />
            <MakeDesign className={ columnNumber == 3 && 'bg-black'} />
        </button>
    
        <button  type='button' onClick={() => handleColumn(4)} className='flex gap-0.5 border border-black p-0.5'>
            <MakeDesign className={ columnNumber == 4 && 'bg-black'} />
            <MakeDesign className={ columnNumber == 4 && 'bg-black'} />
            <MakeDesign className={ columnNumber == 4 && 'bg-black'} />
            <MakeDesign className={ columnNumber == 4 && 'bg-black'} />
        </button>
        
        {!isFiveThou && 
        <button  type='button' onClick={() => handleColumn(5)} className='flex gap-0.5 border border-black p-0.5'>
            <MakeDesign className={ columnNumber == 5 && 'bg-black'} />
            <MakeDesign className={ columnNumber == 5 && 'bg-black'} />
            <MakeDesign className={ columnNumber == 5 && 'bg-black'} />
            <MakeDesign className={ columnNumber == 5 && 'bg-black'} />
            <MakeDesign className={ columnNumber == 5 && 'bg-black'} />
        </button>
    }
   </div>
  )
}

export default ColumnIcons