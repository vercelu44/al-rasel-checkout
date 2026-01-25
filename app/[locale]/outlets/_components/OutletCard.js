import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaMapMarkedAlt, FaPhoneAlt } from 'react-icons/fa'
import { FiClock } from 'react-icons/fi'
import { IoLocationSharp } from 'react-icons/io5'

const OutletCard = ({ outlet }) => {
  return (
    <div className="border border-slate-200 rounded-lg p-5 bg-gray-50 transition-shadow duration-300 ease-in-out ">
      <p className="font-medium text-slate-800 text-center text-lg pb-2 ">{outlet?.title}</p>
      <div className=''>
        {
          outlet?.image ? 
          <Image src={outlet?.image} alt={outlet.title} width={450} height={450} className='aspect-[2/1] h-full w-full object-cover object-top rounded' /> : 
          <div className="aspect-[2/1] rounded bg-slate-200 flex items-center justify-center text-slate-400" />  
        }
      </div>
      <div className='space-y-1.5 pt-4'>
        <p className="font-medium text-slate-600 text-base flex gap-1 items-center justify-center m-0 p-0"> 
          <IoLocationSharp size={16} />
          {outlet?.address}
        </p>
        <p className="font-medium text-slate-600 text-base flex gap-1 items-center justify-center m-0 p-0">
          <FaPhoneAlt size={16} />
          <Link href={`tel:${outlet?.phone}`} className='underline underline-offset-4'>
            {outlet?.phone}
          </Link>
        </p>
        <p className="font-medium text-slate-600 text-base flex gap-1 items-center justify-center m-0 p-0">
          <FiClock size={16} /> Open:  {' '}
          {outlet?.open_close_time}
        </p>
        {
          outlet?.map_location_link && 
        <Link href={outlet?.map_location_link} target='_blank' className="font-medium text-sm flex gap-1 items-center justify-center m-0 p-0 text-secondary">
          <FaMapMarkedAlt size={14} />
          View on Map
        </Link>
        }

      </div>
    </div>
  )
}

export default OutletCard