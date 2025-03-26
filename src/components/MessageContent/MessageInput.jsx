import { FiMic } from "react-icons/fi"; // Mikrofon ikonu üçün

const MessageInput = ({ value, onChange, onSend, onVoiceClick }) => {
  return (
    <div className="bg-grey-lighter px-4 py-4 flex items-center gap-2">
      <div className="flex-1 mx-4">
        <input
          className="w-full border rounded px-2 py-2"
          type="text"
          placeholder="Mesaj yazın..."
          value={value}
          onChange={onChange}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
        />
      </div>

      <button
        onClick={onSend}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Göndər
      </button>

      <button
        onClick={onVoiceClick}
        className="bg-gray-200 text-gray-700 p-2 rounded-full hover:bg-gray-300"
        title="Səsli mesaj göndər"
      >
        <FiMic size={20} />
      </button>
    </div>
  );
};

export default MessageInput;
