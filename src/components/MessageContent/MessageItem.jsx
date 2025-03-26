const MessageItem = ({ msg, isCurrentUser, onDelete }) => {
    const apiUrl = import.meta.env.VITE_API_URL;

    return (
        <div className={`flex mb-2 ${isCurrentUser ? "justify-end" : ""}`}>
            <div
                className="rounded py-2 px-3 relative"
                style={{ backgroundColor: isCurrentUser ? "#E2F7CB" : "#F2F2F2" }}
            >
                {msg.audioPath ? (
                    <audio
                        controls
                        src={`${apiUrl}${msg.audioPath}`}
                        className="mt-1"
                    />
                ) : (
                    <p className="text-sm mt-1">{msg.content}</p>
                )}

                <p className="text-right text-xs text-grey-dark mt-1">
                    {new Date(msg.sentAt).toLocaleTimeString()}
                    <button
                        onClick={() => onDelete(msg.id)}
                        className="text-red-500 text-xs ml-2"
                    >
                        Sil
                    </button>
                </p>
            </div>
        </div>
    );
};

export default MessageItem;
