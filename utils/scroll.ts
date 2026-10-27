/**
 * The scrollToTop function scrolls the window to the top with optional smooth scrolling animation.
 */
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth", // Optional: Add smooth scrolling animation
  });
};
