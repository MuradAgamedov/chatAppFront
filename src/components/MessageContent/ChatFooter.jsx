import React from "react";
import MessageInput from "./MessageInput";
import VoiceRecorder from "./VoiceRecorder";
import VideoUploader from "./VideoUploader";
import FileUploader from "./FileUploader";
import ReplyPreview from "./ReplyPreview";

const ChatFooter = ({
  newMessage,
  setNewMessage,
  handleTyping,
  handleSendMessage,
  handleSendFileGeneric,
  handleRing,
  replyToMessage,
  setReplyToMessage,
}) => {
  return (
    <div className="bg-grey-lighter px-4 py-4 flex items-center">
      {replyToMessage && (
        <ReplyPreview message={replyToMessage} onCancel={() => setReplyToMessage(null)} />
      )}

      <MessageInput
        value={newMessage}
        onRingClick={handleRing}
        onChange={(e) => {
          setNewMessage(e.target.value);
          handleTyping();
        }}
        onSend={() => {
          handleSendMessage(newMessage, setNewMessage, replyToMessage?.id);
          setReplyToMessage(null);
        }}
        onVoiceClick={() => console.log("Voice click handled separately")}
        replyToMessage={replyToMessage}
        clearReply={() => setReplyToMessage(null)}
      />

      <VoiceRecorder onSend={(file) => handleSendFileGeneric(file, "audio")} />
      <VideoUploader onSend={(file) => handleSendFileGeneric(file, "video")} />
      <FileUploader onSend={(file) => handleSendFileGeneric(file, "file")} />
    </div>
  );
};

export default ChatFooter;
