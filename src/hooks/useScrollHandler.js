import {
  useEffect
} from "react";

export const useScrollHandler = ({
  scrollContainerRef,
  setShowScrollButton
}) => {
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const {
        scrollTop,
        scrollHeight,
        clientHeight
      } = container;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      setShowScrollButton(distanceFromBottom > 150);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);
};
