import React, { useState } from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { FiSend } from "react-icons/fi";

const MessageInput = ({
  value,
  onChange,
  onSend,
  onRingClick,
  replyToMessage,
  setReplyToMessage,
  apiUrl
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const addEmoji = (emoji) => {
    onChange({ target: { value: value + emoji.native } });
    setShowEmojiPicker(false);
  };

  const renderReplyPreview = (reply) => {
    if (!reply) return null;

    const fileUrl = reply.filePath ? `${apiUrl}${reply.filePath}` : null;
    const fileName = reply.filePath?.split("/").pop();
    const extension = fileName?.split(".").pop()?.toLowerCase();

    if (fileUrl && ["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) {
      return <img src={fileUrl} alt="Изображение" className="rounded max-w-[100px]" />;
    } else if (fileUrl && ["mp4", "webm", "ogg"].includes(extension)) {
      return <video src={fileUrl} controls className="rounded max-w-[100px]" />;
    } else if (fileUrl && ["mp3", "wav", "aac"].includes(extension)) {
      return <audio src={fileUrl} controls className="w-full" />;
    } else if (fileUrl) {
      return (
        <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
          {fileName}
        </a>
      );
    } else if (reply.videoPath) {
      return <video src={`${apiUrl}${reply.videoPath}`} controls className="rounded max-w-[100px]" />;
    } else if (reply.audioPath) {
      return <audio src={`${apiUrl}${reply.audioPath}`} controls className="w-full" />;
    } else if (reply.content) {
      return <p>{reply.content}</p>;
    } else {
      return <p className="italic text-gray-400 text-sm">Сообщение не найдено.</p>;
    }
  };

  return (
    <div className="bg-grey-lighter px-4 py-3 flex flex-col gap-2">
      {replyToMessage && (
        <div className="bg-gray-100 p-2 rounded border-l-4 border-blue-500 relative">
          <p className="text-xs text-gray-600 mb-1">Ответ на сообщение:</p>
          {renderReplyPreview(replyToMessage)}
          <button
            onClick={() => setReplyToMessage(null)}
            className="absolute top-1 right-2 text-xs text-red-500"
          >
            ✖
          </button>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <input
            className="w-full border rounded px-4 py-2"
            type="text"
            placeholder="Напишите сообщение..."
            value={value}
            onChange={onChange}
            onKeyDown={(e) => e.key === "Enter" && onSend()}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xl"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
          >
            😊
          </button>
          {showEmojiPicker && (
            <div className="absolute bottom-12 right-0 z-10">
              <Picker data={data} onEmojiSelect={addEmoji} locale="ru" />
            </div>
          )}
        </div>

        <button
          onClick={onSend}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          title="Отправить"
        >
          <FiSend size={20} />
        </button>
        <button
          onClick={onRingClick}
          className="bg-yellow-400 text-white p-2 rounded-full hover:bg-yellow-500"
          title="Привлечь внимание"
        >
          🔔
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
