"use client";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useAddToNewsletterMutation } from "@/store/api/contactAPI";
import { useSelector } from "react-redux";

const SubscriptionForm = ({ settings }) => {
	const [addToNewsLetter] = useAddToNewsletterMutation();
	const { translations } = useSelector((state) => state.common);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm();
	const onSubmit = async (data) => {
		const newMessage = {
			email: data.email,
		};
		// console.log(newMessage);

		addToNewsLetter(newMessage)
			.unwrap()
			.then((response) => {
				// Handle the successful response if necessary
				toast.success("Thank you for subscribe us.");
				reset();
			})
			.catch((error) => {
				// Handle the error if necessary
				toast.error("Failed to subscribe");
				console.log(error);
			});
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className="flex md:justify-center pt-2">
				<div className="w-[90vw] lg:w-[400px] h-10 lg:h-12 flex items-center">
					<input
						style={{
							border: `1px solid ${settings?.colors?.primary}`,
						}}
						className="rounded-l w-full h-full"
						type="email"
						name="email"
						placeholder="Enter your email"
						{...register("email", {
							pattern: {
								value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
								message: "Email is not valid.",
							},
							required: "Email is required.",
						})}
					/>
					<button
						className="inline-block h-full px-4 py-1 border-none text-center rounded-r"
						type="submit"
						style={{
							backgroundColor: settings?.colors?.primary_text,
							color: settings?.colors?.primary,
						}}
					>
						{translations["submit"] || "Submit"}
					</button>
				</div>
			</div>
			{errors.email && <p className="errorMsg">{errors.email.message}</p>}
		</form>
	);
};

export default SubscriptionForm;
