"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import QAItem from "./elements/QAItem";
import { useGetFaqsQuery } from "@/store/api/faqsAPI";
import ItemsListLoader from "./elements/loaders/ItemsListLoader";
import type { QnaItem } from "@/types";

export default function QNAItems({ faqsData }: { faqsData?: QnaItem[] }) {
	const { locale } = useParams<{ locale: string }>();
	const { data, isLoading } = useGetFaqsQuery({ locale });
	/** Index of the open question (`null` = all closed) */
	const [open, setOpen] = useState<number | null>(0);
	const faqs = faqsData?.length > 0 ? faqsData : data?.data || [];

	const toggleOpen = (index: number) => {
		if (open === index) {
			setOpen(null);
		}

		setOpen(index);
	};
	return (
		<div className="qna-wpr">
			{isLoading ? (
				<ItemsListLoader numItems={3} noImage={true} viewBoxWidth={900} />
			) : (
				faqs?.map((item, index) => (
					<QAItem
						item={{ ...item, index }}
						key={index}
						open={open === index}
						toggleOpen={toggleOpen}
					/>
				))
			)}
		</div>
	);
}
