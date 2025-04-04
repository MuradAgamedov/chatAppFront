import MessageItem from "./MessageItem";

const MessageContainer = ({
  messages,
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
  setReplyToMessage
}) => {
 
  return (
    <>
      {messages.length === 0 ? (
        <p className="text-sm text-center text-gray-600">Пока сообщений нет.</p>
      ) : (
        messages.map((msg) => (
          <MessageItem
            key={msg.id}
            msg={msg}
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
        ))
      )}
    </>
  );
};
export default MessageContainer;