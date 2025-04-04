import axios from "axios";

export const useChatHandlers = ({
  currentUser,
  user,
  apiUrl,
  sendAudioRef,
  deleteAudioRef,
  setMessages,
}) => {
const handleSendMessage = async (newMessage, setNewMessage, replyToId = null) => {
  if (!newMessage.trim()) return;

  try {
    await axios.post(
      `${apiUrl}/api/messages/send`, {
        receiverId: user.id,
        content: newMessage,
        replyToMessageId: replyToId, 
      }, {
        headers: {
          Authorization: `Bearer ${currentUser?.token}`,
          "Content-Type": "application/json",
        },
      }
    );
    setNewMessage("");
    sendAudioRef.current ?.play();
  } catch (error) {
    console.error("Mesaj göndərilə bilmədi:", error);
  }
};




  const handleDeleteMessage = async (messageId) => {
    const confirmed = window.confirm("Bu mesajı silmək istədiyinizə əminsiniz?");
    if (!confirmed) return;

    try {
      await axios.delete(`${apiUrl}/api/messages/${messageId}`, {
        headers: {
          Authorization: `Bearer ${currentUser?.token}`
        },
      });
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
      deleteAudioRef.current ?.play();
    } catch (error) {
      console.error("Mesaj silinə bilmədi:", error);
    }
  };

  const handleSendFileGeneric = async (file, type) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("receiverId", user.id);

    const urlMap = {
      audio: "upload-audio",
      video: "upload-video",
      file: "upload-file",
    };

    try {
      const response = await axios.post(`${apiUrl}/api/messages/${urlMap[type]}`, formData, {
        headers: {
          Authorization: `Bearer ${currentUser?.token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setMessages((prev) => [...prev, response.data]);
      sendAudioRef.current ?.play();
    } catch (error) {
      console.error(`${type} göndərilə bilmədi:`, error);
    }
  };
  const handleReactToMessage = async (messageId, reaction) => {
    try {
      await axios.post(`${apiUrl}/api/messages/react`, {
        messageId,
        reaction,
      }, {
        headers: {
          Authorization: `Bearer ${currentUser?.token}`,
          "Content-Type": "application/json",
        },
      });

      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? {
          ...m,
          reaction
        } : m))
      );
    } catch (error) {
      console.error("Reaksiya göndərilə bilmədi:", error);
    }
  };

 const handleEditMessage = async (messageId, newContent) => {
   try {
     await axios.put(`${apiUrl}/api/messages/${messageId}`, {
       content: newContent,
     }, {
       headers: {
         Authorization: `Bearer ${currentUser.token}`
       },
     });

     if (window.connectionRef ?.current) {
       await window.connectionRef.current.invoke("NotifyEditedMessage", messageId, newContent);
     }

     setMessages((prev) =>
       prev.map((msg) =>
         msg.id === messageId ? {
           ...msg,
           content: newContent
         } : msg
       )
     );
   } catch (error) {
     console.error("Redaktə zamanı xəta baş verdi:", error);
   }
 };


  return {
    handleSendMessage,
    handleDeleteMessage,
    handleSendFileGeneric,
    handleReactToMessage,
    handleEditMessage,
  };
};
