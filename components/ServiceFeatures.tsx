import Image from "next/image";

export default function ServiceFeatures() {
    return (
        <>
            <div className="features flex border border-slate-300 rounded-[44px] px-16 py-5 gap-12">
                <div className="single-feature col-span-3 flex items-center gap-4">
                    <Image src="/assets/images/icons/parcel.png" alt="Replacement" width={48} height={48}/>
                    <p className="text-base/[22px] font-semibold font-title"><span className="text-primary">৭ দিনের মধ্যে</span> বিনামূল্যে পরিবর্তনযোগ্য</p>
                </div>
                <div className="single-feature col-span-3 flex items-center gap-4">
                    <Image src="/assets/images/icons/delivery.png" alt="Replacement" width={48} height={48}/>
                    <p className="text-base/[22px] font-semibold font-title">ঢাকার মধ্যে <span className="text-primary">ফ্রি হোম ডেলিভারি</span></p>
                </div>
                <div className="single-feature col-span-3 flex items-center gap-4">
                    <Image src="/assets/images/icons/pay.png" alt="Replacement" width={48} height={48}/>
                    <p className="text-base/[22px] font-semibold font-title"><span className="text-primary">নিরাপদে পেমেন্ট</span> করার সহজ মাধ্যম</p>
                </div>
                <div className="single-feature col-span-3 flex items-center gap-4">
                    <Image src="/assets/images/icons/support.png" alt="Replacement" width={48} height={48}/>
                    <p className="text-base/[22px] font-semibold font-title"><span className="text-primary">সর্বাক্ষনিক</span> ও দ্রুত গ্রাহক সেবা </p>
                </div>
            </div>
        </>
    )
}
