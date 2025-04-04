import React from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

const MessageItem = ({
  msg,
  currentUser,
  apiUrl,
  editingMessageId,
  editedContent,
  setEditedContent,
  handleEditMessage,
  setEditingMessageId,
  handleDeleteMessage,
  activeReactionPickerId,
  setActiveReactionPickerId,
  handleReactToMessage,
  setReplyToMessage,
}) => {
  const fileUrl = msg.filePath ? `${apiUrl}${msg.filePath}` : null;
  const fileName = msg.filePath?.split("/").pop();
  const extension = fileName?.split(".").pop()?.toLowerCase();

  let content;
  if (fileUrl && ["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) {
    content = <img src={fileUrl} alt={fileName} className="mt-1 rounded max-w-xs" />;
  } else if (fileUrl && ["mp4", "webm", "ogg"].includes(extension)) {
    content = <video controls src={fileUrl} className="mt-1 rounded max-w-xs" />;
  } else if (fileUrl && ["mp3", "wav", "aac"].includes(extension)) {
    content = <audio controls src={fileUrl} className="mt-1" />;
  } else if (fileUrl) {
    content = (
      <div className="mt-1 text-sm text-gray-800 bg-gray-100 p-2 rounded">
        <span className="font-medium">Fayl:</span>{" "}
        <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
          {fileName}
        </a>
      </div>
    );
  } else if (msg.videoPath) {
    content = <video controls src={`${apiUrl}${msg.videoPath}`} className="mt-1 rounded max-w-xs" />;
  } else if (msg.audioPath) {
    content = <audio controls src={`${apiUrl}${msg.audioPath}`} className="mt-1" />;
  } else {
    content = <p className="text-sm mt-1">{msg.content}</p>;
  }

  const renderReplyPreview = (reply) => {
    const fileUrl = reply.filePath ? `${apiUrl}${reply.filePath}` : null;
    const fileName = reply.filePath?.split("/").pop();
    const extension = fileName?.split(".").pop()?.toLowerCase();

    if (fileUrl && ["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) {
      return <img src={fileUrl} alt={fileName} className="rounded max-w-[100px]" />;
    } else if (fileUrl && ["mp4", "webm", "ogg"].includes(extension)) {
      return <video src={fileUrl} className="rounded max-w-[100px]" />;
    } else if (fileUrl && ["mp3", "wav", "aac"].includes(extension)) {
      return <audio controls src={fileUrl} className="w-full" />;
    } else if (fileUrl) {
      return (
        <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
          {fileName}
        </a>
      );
    } else if (reply.videoPath) {
      return <video src={`${apiUrl}${reply.videoPath}`} className="rounded max-w-[100px]" />;
    } else if (reply.audioPath) {
      return <audio controls src={`${apiUrl}${reply.audioPath}`} className="w-full" />;
    } else {
      return <p>{reply.content}</p>;
    }
  };

  return (
    <div className={`flex mb-2 ${msg.senderId === currentUser?.user?.id ? "justify-end" : ""}`}>
      <div
        className="rounded py-2 px-3 relative group"
        style={{ backgroundColor: msg.senderId === currentUser?.user?.id ? "#E2F7CB" : "#F2F2F2" }}
      >
        {msg.replyToMessage && (
          <div className="bg-gray-200 text-xs text-gray-700 p-1 rounded mb-1 border-l-4 border-blue-500 pl-2 max-w-xs">
            {renderReplyPreview(msg.replyToMessage)}
          </div>
        )}

        {editingMessageId === msg.id ? (
          <div className="mt-1">
            <textarea
              className="text-sm w-full border rounded p-1"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className="flex gap-2 mt-1">
              <button
                className="text-green-600 text-xs"
                onClick={() => {
                  handleEditMessage(msg.id, editedContent);
                  setEditingMessageId(null);
                  setEditedContent("");
                }}
              >
                Сохранить
              </button>
              <button
                className="text-gray-600 text-xs"
                onClick={() => {
                  setEditingMessageId(null);
                  setEditedContent("");
                }}
              >
                Отмена
              </button>
            </div>
          </div>
        ) : (
          <>
            {content}
            {msg.reaction && <div className="mt-1 text-xl">{msg.reaction}</div>}
          </>
        )}

        <div className="flex items-center justify-between gap-2 mt-1">
          <p className="text-xs text-grey-dark flex items-center">
            {new Date(msg.sentAt).toLocaleTimeString()}
            {msg.senderId === currentUser?.user?.id &&
              (msg.isRead ? (
                <span className="ml-1 text-blue-500">✔✔</span>
              ) : (
                <span className="ml-1 text-gray-500">✔</span>
              ))}
          </p>
          <div className="flex items-center gap-1">
            {msg.senderId === currentUser?.user?.id && (
              <>
                <button
                  onClick={() => {
                    setEditingMessageId(msg.id);
                    setEditedContent(msg.content);
                  }}
                  className="text-blue-600 text-xs px-1"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDeleteMessage(msg.id)}
                  className="text-red-600 text-xs px-1"
                >
                  🗑️
                </button>
              </>
            )}
            {msg.senderId !== currentUser?.user?.id && (
              <button
                className="text-lg"
                onClick={() =>
                  setActiveReactionPickerId((prev) => (prev === msg.id ? null : msg.id))
                }
              >
                😊
              </button>
            )}
          </div>
          <button
            className="text-yellow-600 text-xs px-1"
            onClick={() => setReplyToMessage(msg)}
          >
            💬
          </button>
        </div>

        {msg.senderId !== currentUser?.user?.id &&
          activeReactionPickerId === msg.id && (
            <div className="absolute top-full left-0 mt-2 z-[9999] bg-white rounded shadow-lg emoji-picker">
              <Picker
                data={data}
                onEmojiSelect={(emoji) => {
                  handleReactToMessage(msg.id, emoji.native);
                  setActiveReactionPickerId(null);
                  new Audio("/assets/music/reaction.mp3").play();
                }}
                locale="ru"
                theme="light"
              />
            </div>
          )}
      </div>
    </div>
  );
};

export default MessageItem;
