"use client";
import Image from "next/image";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import {
	useAddToProductQnaMutation,
	useGetProductQnaListQuery,
} from "@/store/api/productsQnaAPI";
import { getFormattedDate } from "@/utils/format-date";
import Paginator from "@/components/elements/Paginator";
import RoundedSearch from "@/components/elements/RoundedSearch";
import ItemsListLoader from "@/components/elements/loaders/ItemsListLoader";
import { AnswerIcon, QuestionIcon } from "@/components/elements/svg";
import { FiSearch } from "react-icons/fi";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const ProductQNA = ({ product_id }) => {
	const { user } = useSelector((state) => state.auth);
	const { settings, translations } = useSelector((state) => state.common);
	const [customSearchParams, setCustomSearchParams] = useState({
		per_page: 6,
		page: 1,
	});
	const isMobile = useMediaQuery("(max-width: 768px)");
	const [isSearch, setIsSearch] = useState(false);
	// const searchParams = useSearchParams();
	const params = new URLSearchParams(customSearchParams);
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm();

	const { data, isLoading } = useGetProductQnaListQuery({
		productId: product_id,
		params: params.toString(),
	});
	const [addQuestion] = useAddToProductQnaMutation();
	const questions = data?.data || [];
	const meta = data?.meta || {};

	const onSubmit = (data) => {
		if (!user) {
			toast.error("Please login first");
			return;
		}
		const newQuestion = {
			product_id,
			questions: data.question,
		};
		// console.log(newQuestion);
		addQuestion(newQuestion)
			.unwrap()
			.then((response) => {
				// Handle the successful response if necessary
				// console.log(response);
				toast.success("Question added, You'll get a reply soon");
				reset();
			})
			.catch((error) => {
				// Handle the error if necessary
				toast.error("Failed to add your question");
				console.log(error);
			});
	};

	return (
		<section id="product-questions-and-answers">
			<div className="">
				<div className="w-full qna-search">
					{!isSearch && (
						<div className="flex justify-between items-center">
							<h2 className="text-2xl font-bold font-title text-slate-900">
								{translations["product-question-answer"] ||
									"এই প্রডাক্ট সম্পর্কে প্রশ্ন ও উত্তর"}{" "}
								({meta?.total || 0})
							</h2>
							<button
								className="w-[48px] h-[48px] bg-white rounded-full border-2 border-[#E2E8F0] hidden lg:flex justify-center items-center"
								onClick={() => setIsSearch(true)}
							>
								<FiSearch size={24} />
							</button>
						</div>
					)}
					{(isSearch || isMobile) && (
						<div
							className={`w-full question-search flex items-center relative mt-3 lg:mt-0`}
						>
							<RoundedSearch
								placeholder={"এই প্রডাক্ট সম্পর্কে সার্চ করুন"}
								isSearch={isSearch}
							/>
							<Image
								onClick={() => setIsSearch(false)}
								src={`/assets/images/icons/close-icon.png`}
								alt="close icon"
								width={0}
								height={0}
								sizes="32px"
								className="w-[32px] h-[32px] ml-6 hidden lg:block"
							/>
						</div>
					)}
				</div>

				{!settings?.guest_checkout ? (
					<form className="mt-6 lg:mt-8" onSubmit={handleSubmit(onSubmit)}>
						<div className="flex flex-col lg:flex-row justify-between gap-4 items-end">
							<textarea
								className="w-full h-24 lg:h-[50px] lg:w-[25.75rem] border-1 border-[#E2E8F0] focus:border-primary text-base focus:outline-none rounded-lg p-3"
								type="text"
								// rows={1}
								placeholder={
									translations["type-product-question"] ||
									"প্রডাক্ট সম্পর্কে আপনার প্রশ্ন লিখুন"
								}
								{...register("question", {
									required: "Question is required.",
								})}
							/>
							{errors.question && (
								<p className="errorMsg !m-0 lg:hidden">
									{errors.question.message}
								</p>
							)}
							<div className="product-actions flex justify-end items-center">
								<button
									type="submit"
									className="primary-btn !h-[2.5rem] w-[12.25rem]"
								>
									{translations["ask-question"] || "প্রশ্ন জিজ্ঞাস করুন"}
								</button>
							</div>
						</div>

						{errors.question && (
							<p className="errorMsg hidden lg:block">
								{errors.question.message}
							</p>
						)}
					</form>
				) : null}
				{isLoading ? (
					<ItemsListLoader noImage={true} numItems={2} />
				) : (
					<div className="mt-4 lg:mt-8">
						{questions.map((question) => (
							<div
								key={question.id}
								className="mb-2 bg-[#F8FAFC] rounded-lg p-3 lg:p-6 border border-slate-100"
							>
								<div className="flex justify-start">
									<div className="icon-container">
										<QuestionIcon />
									</div>
									<div className="icon-container pl-5">
										<p className="font-bold">{question.questions}</p>
										<p className="text-slate-500">
											{question?.customer || "Not Available"} |{" "}
											{getFormattedDate(question.created_at)}
										</p>
									</div>
								</div>
								{question?.answer ? (
									<div className="flex justify-start mt-3">
										<div className="icon-container">
											<AnswerIcon />
										</div>
										<div className="icon-container pl-5">
											<p className="font-bold">{question.answer}</p>
											<p className="text-slate-500">
												{settings.name} |{" "}
												{getFormattedDate(question.updated_at)}
											</p>
										</div>
									</div>
								) : null}
							</div>
						))}
					</div>
				)}
			</div>
			{questions.length >= 6 && (
				<div className="flex lg:justify-end mt-6 lg:mt-8">
					<Paginator
						meta={meta}
						isOnPage={true}
						onPageChange={(page) =>
							setCustomSearchParams((prevParams) => ({
								...prevParams,
								page: page,
							}))
						}
					/>
				</div>
			)}
		</section>
	);
};

export default ProductQNA;
