import { useAppSelector } from "@/store/hooks";
import { toast } from "react-toastify"; // was missing: showed a crash instead of the message
import { useAddReviewReactMutation } from "@/store/api/productReviewAPI";
import type { ID, ReviewReactionType } from "@/types";

/**
 * The `useAddReviewReaction` function is a custom hook that handles adding reactions to reviews and
 * displays an error message if the user is not logged in.
 * @returns The function `useAddReviewReaction` returns an object with a single property
 * `handleReviewReact`, which is a function.
 */
const useAddReviewReaction = () => {
	const { user } = useAppSelector((state) => state.auth);
	const [addReviewReact] = useAddReviewReactMutation();

	const handleReviewReact = (type: ReviewReactionType, commentId: ID) => {
		if (!user) {
			toast.error("You're not logged in");
			return;
		}
		const newReact = {
			comment_id: commentId,
			type,
		};
		addReviewReact(newReact)
			.unwrap()
			.then((response) => {
				// console.log(response);
				// toast.success("React Success!");
			})
			.catch((error) => {
				// toast.error("Failed to React");
				console.log(error);
			});
	};
	return {
		handleReviewReact,
	};
};

export default useAddReviewReaction;
