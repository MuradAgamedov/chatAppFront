import {
  useEffect
} from "react";
import axios from "axios";

export const useMessageEffects = ({
  user,
  currentUser,
  apiUrl,
  setMessages,
  setIsUserOnline,
  messages,
  connectionRef,
}) => {
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const [msgRes, onlineRes] = await Promise.all([
          axios.get(`${apiUrl}/api/messages/with/${user.id}`, {
            headers: {
              Authorization: `Bearer ${currentUser?.token}`
            },
          }),
          axios.get(`${apiUrl}/api/messages/is-online/${user.id}`, {
            headers: {
              Authorization: `Bearer ${currentUser?.token}`
            },
          }),
        ]);

        setMessages(msgRes.data);
        setIsUserOnline(onlineRes.data.isOnline);
      } catch (error) {
        console.error("Verilər yüklənə bilmədi:", error);
      }
    };

    if (user ?.id) fetchMessages();
  }, [user]);

  const markVisibleMessagesAsRead = async () => {
    if (document.visibilityState !== "visible") return;
    const connection = connectionRef.current;

    if (!connection || connection.state !== "Connected") {
      console.warn("Bağlantı hələ qurulmayıb, oxundu göndərilmir.");
      return;
    }

    for (const msg of messages) {
      if (
        msg.receiverId === currentUser ?.user ?.id &&
        !msg.isRead
      ) {
        try {
          await connection.invoke("MarkMessageAsRead", msg.id);
        } catch (err) {
          console.error("Oxundu göndərilə bilmədi:", err);
        }
      }
    }
  };

  useEffect(() => {
    markVisibleMessagesAsRead();
  }, [messages]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        markVisibleMessagesAsRead();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [messages]);




};
