import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";
/**
 * The function `cn` is a utility function that merges multiple class names together.
 * @param inputs - The `inputs` parameter is a rest parameter that allows you to pass in multiple
 * arguments. In this case, it is used to accept any number of arguments that will be passed to the
 * `clsx` function.
 */
export const cn = (...inputs) => twMerge(clsx(inputs));