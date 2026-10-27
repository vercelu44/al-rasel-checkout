import { useState, useCallback } from "react";

/**
 * The `useHover` function is a custom React hook that tracks whether an element is being hovered over
 * or not.
 * @returns The `useHover` function returns an object with the following properties:
 */
const useHover = () => {
	const [isHovered, setIsHovered] = useState(false);

	const handleMouseEnter = useCallback(() => {
		setIsHovered(true);
	}, []);

	const handleMouseLeave = useCallback(() => {
		setIsHovered(false);
	}, []);

	return {
		isHovered,
		bind: {
			onMouseEnter: handleMouseEnter,
			onMouseLeave: handleMouseLeave,
		},
	};
};

export default useHover;
