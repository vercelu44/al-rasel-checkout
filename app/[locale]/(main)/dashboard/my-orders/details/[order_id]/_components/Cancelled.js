import React from 'react'
import { IoMdClose } from 'react-icons/io'

const Cancelled = () => {
  return (
   <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
    <div className="flex items-start gap-4">

        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <IoMdClose className="h-7 w-7 text-red-600" />
        </div>

        <div className="flex-1">
            <h3 className="text-lg font-bold text-red-700">
                Order Cancelled
            </h3>

            <p className="mt-2 text-sm text-red-600">
                Unfortunately this order has been cancelled.
                This order will no longer be processed.
            </p>

           
        </div>

    </div>
</div>
  )
}

export default Cancelled