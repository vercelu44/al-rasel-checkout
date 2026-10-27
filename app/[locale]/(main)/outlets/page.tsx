import { fetchData } from '@/lib/fetch-data';
import Link from 'next/link';
import OutletCard from './_components/OutletCard';
import type { ApiResponse, Outlet } from "@/types";

const OutletsPage = async () => {

  const data = await fetchData<ApiResponse<Outlet[]>>({ api: `outlets` });
  const outlets: Outlet[] = data?.data || [];
    
  return (
   <div>
      <div className="breadcrumb breadcrumb-2 mt-2.5 pb-4 pt-5">
				<div className=" border-b border-slate-200 pb-4">
					<div className="flex container gap-2 items-center">
						<Link
							href={`/`}
							className="text-base text-slate-600 hover:text-secondary"
						>
							Home
						</Link>
						<Link href={'/outlets'} className="text-base text-slate-600 hover:text-secondary">
							<h1>Outlets</h1>
						</Link>
					</div>
				</div>
			</div>

			<div className=" container  mb-4 md:mb-24">
				<div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4   gap-3 md:gap-5 mb-12">
					{outlets?.map((outlet, i) => <OutletCard key={i} outlet={outlet} />)}
				</div>
			</div>
   </div>
  )
}

export default OutletsPage