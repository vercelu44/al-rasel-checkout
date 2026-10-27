export const getSlicedText = <T,>(text: string | T, size: number): string | T => {
  if (typeof text === "string") {
    if (text.length > size) return text.slice(0, size) + "...";
  }
  return text;
};
