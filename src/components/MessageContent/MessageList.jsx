import React, { useState, useRef } from "react";
import VoiceRecorder from "./VoiceRecorder";
import VideoUploader from "./VideoUploader";
import FileUploader from "./FileUploader";
import MessageInput from "./MessageInput";
import ScrollToBottomButton from "./ScrollToBottomButton";
import "react-toastify/dist/ReactToastify.css";
import SearchBar from "./SearchBar";
import Header from "./Header";
import ReplyPreview from "./ReplyPreview";
import MessageContainer from "./MessageContainer";
import { useChatHandlers } from "../../hooks/useChatHandlers";
import { useTyping } from "../../hooks/useTyping";
import { useChatConnection } from "../../hooks/useChatConnection";
import { useMessageEffects } from "../../hooks/useMessageEffects";
import { useScrollHandler } from "../../hooks/useScrollHandler";

const MessageList = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isUserOnline, setIsUserOnline] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [activeReactionPickerId, setActiveReactionPickerId] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [replyToMessage, setReplyToMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const sendAudioRef = useRef(null);
  const receiveAudioRef = useRef(null);
  const deleteAudioRef = useRef(null);
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const apiUrl = import.meta.env.VITE_API_URL;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const connectionRef = useChatConnection({
    user,
    currentUser,
    apiUrl,
    setMessages,
    setIsTyping,
    setIsUserOnline,
    scrollToBottom,
    
  });

  const {
    handleSendMessage,
    handleDeleteMessage,
    handleSendFileGeneric,
    handleReactToMessage,
    handleEditMessage,
  } = useChatHandlers({
    currentUser,
    user,
    apiUrl,
    sendAudioRef,
    deleteAudioRef,
    setMessages,
  });

  const { handleTyping } = useTyping({ connectionRef, currentUser, user });

  useMessageEffects({
    user,
    currentUser,
    apiUrl,
    setMessages,
    setIsUserOnline,
    receiveAudioRef,
    messages,
    connectionRef
  });

  useScrollHandler({ scrollContainerRef, setShowScrollButton });

  const handleRing = async () => {
    try {
      await connectionRef.current.invoke("SendRing", user.id);
      console.log("Zəng göndərildi!");
    } catch (err) {
      console.error("Zəng göndərmək mümkün olmadı:", err);
    }
  };

const filteredMessages = messages.filter((msg) =>
  (msg.content ?? "").toLowerCase().includes(searchTerm.toLowerCase())
);


  return (
    <div className="w-full md:w-2/3 border flex flex-col relative">
      <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

      <Header user={user} isTyping={isTyping} isUserOnline={isUserOnline} apiUrl={apiUrl} />

      <div
        ref={scrollContainerRef}
        className="px-3 py-2 overflow-y-auto"
        style={{ backgroundColor: "#DAD3CC", height: "calc(100vh - 160px)" }}
      >
        <MessageContainer
          messages={filteredMessages}
          currentUser={currentUser}
          apiUrl={apiUrl}
          editingMessageId={editingMessageId}
          editedContent={editedContent}
          setEditedContent={setEditedContent}
          handleEditMessage={handleEditMessage}
          setEditingMessageId={setEditingMessageId}
          handleDeleteMessage={handleDeleteMessage}
          activeReactionPickerId={activeReactionPickerId}
          setActiveReactionPickerId={setActiveReactionPickerId}
          handleReactToMessage={handleReactToMessage}
          setReplyToMessage={setReplyToMessage}
        />
        <div ref={messagesEndRef} />
      </div>

      {showScrollButton && <ScrollToBottomButton onClick={scrollToBottom} />}

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
          user={currentUser}
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
    </div>
  );
};

export default MessageList;