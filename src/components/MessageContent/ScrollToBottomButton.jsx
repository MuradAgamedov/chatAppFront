import React from "react";
import { FiArrowDownCircle } from "react-icons/fi";

const ScrollToBottomButton = ({ onClick }) => {
  return (
    <button
      className="fixed bottom-24 right-6 bg-blue-500 text-white rounded-full p-2 shadow-md hover:bg-blue-600 transition"
      onClick={onClick}
      title="Ən son mesaja keç"
    >
      <FiArrowDownCircle size={28} />
    </button>
  );
};

export default ScrollToBottomButton;
