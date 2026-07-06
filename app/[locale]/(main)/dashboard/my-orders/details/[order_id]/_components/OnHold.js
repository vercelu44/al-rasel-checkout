import React from 'react'
import { HiPlayPause } from 'react-icons/hi2'

const OnHold = () => {
  return (
   <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
    <div className="flex gap-4">

        <div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
            <HiPlayPause className="h-7 w-7 text-amber-600" />
        </div>
        </div>

        <div>

            <h3 className="text-lg font-bold text-amber-700">
                Order On Hold
            </h3>

            <p className="mt-2 text-sm text-amber-700">
                Your order is temporarily on hold because this product is currently out of stock.
            </p>

            <div className="mt-4 rounded-lg border border-amber-200 bg-white px-4 py-3">
                <p className="text-sm text-amber-700">
                    We will automatically continue processing your order once the item is back in stock.
                </p>
            </div>

        </div>

    </div>
</div>
  )
}

export default OnHold