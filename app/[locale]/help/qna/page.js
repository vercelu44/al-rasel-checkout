"use client";
import { Link } from "@/navigation";

// ** Imoprt icons
import { BsFillTelephoneFill } from "react-icons/bs";
import QNAItems from "@/components/QNAItems";
import CallInquiry from "@/components/elements/CallInquiry";
import NestedPageTitle from "../../dashboard/_components/NestedPageTitle";
import { useSelector } from "react-redux";

const QnA = () => {
	const { translations } = useSelector((state) => state.common);
	return (
		<>
			<div className="breadcrumb hidden md:block breadcrumb-2 py-5 border-b border-slate-200">
				<div className="container">
					<div>
						<Link
							href={`/`}
							className="text-base text-slate-600 hover:text-primary"
						>
							{translations["home"] || "হোম"}
						</Link>
						<Link
							href={`/help/qna`}
							className="text-base text-slate-900 hover:text-primary"
						>
							{translations["q&a"] || "Q&A"}
						</Link>
					</div>
				</div>
			</div>

			<div className="lg:container">
				<NestedPageTitle
					title={translations["q&a"] || "Q&A"}
					href={"/mobile-login"}
					className={"lg:px-0"}
				/>
				<div className="px-3 md:px-0">
					<QNAItems />
					<div className="border-b border-slate-200 mt-14 lg:mt-28 mb-4 lg:mb-8"></div>
					<CallInquiry />
				</div>
			</div>
		</>
	);
};

export default QnA;
