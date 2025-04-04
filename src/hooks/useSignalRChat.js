import {
  useEffect,
  useRef
} from "react";
import * as signalR from "@microsoft/signalr";

export const useSignalRChat = ({
  user,
  currentUser,
  onMessageReceived,
  onTypingReceived,
  onUserConnected,
  onUserDisconnected
}) => {
  const connectionRef = useRef(null);
  const typingTimer = useRef(null);
  const apiUrl =
    import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!user ?.id) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${apiUrl}/hubs/chat`, {
        accessTokenFactory: () => currentUser ?.token
      })
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then(() => console.log("✅ SignalR bağlantısı quruldu"))
      .catch(err => console.error("❌ SignalR bağlantı xətası:", err));

    connection.on("ReceiveMessage", onMessageReceived);

    connection.on("UserTyping", (senderId) => {
      if (senderId === user.id) {
        onTypingReceived();
        if (typingTimer.current) clearTimeout(typingTimer.current);
        typingTimer.current = setTimeout(() => onTypingReceived(false), 2000);
      }
    });

    connection.on("UserConnected", (userId) => {
      if (userId === user.id) onUserConnected();
    });

    connection.on("UserDisconnected", (userId) => {
      if (userId === user.id) onUserDisconnected();
    });

    connectionRef.current = connection;

    return () => {
      connection.stop();
    };
  }, [user]);

  const sendTyping = () => {
    if (connectionRef.current && user ?.id) {
      connectionRef.current.invoke("SendTypingNotification", user.id, currentUser.user.id)
        .catch(err => console.error("Typing invoke xətası:", err));
    }
  };

  return {
    sendTyping
  };
};
