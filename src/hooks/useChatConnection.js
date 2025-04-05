import {
  useEffect,
  useRef
} from "react";
import * as signalR from "@microsoft/signalr";
import {
  toast
} from "react-toastify";

export const useChatConnection = ({
  user,
  currentUser,
  apiUrl,
  setMessages,
  setIsTyping,
  setIsUserOnline,
  scrollToBottom
}) => {
  const connectionRef = useRef(null);
  const typingTimer = useRef(null);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${apiUrl}/hubs/chat`, {
        accessTokenFactory: () => currentUser ?.token,
      })
      .withAutomaticReconnect()
      .build();

    connection.start().catch(console.error);

    connection.on("ReceiveMessage", (message) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m.id === message.id);
        if (!exists) {
          new Audio("/assets/music/receive.mp3").play();
          setTimeout(() => scrollToBottom(), 100);
          return [...prev, message];
        }
        return prev;
      });
    });
    connection.on("ReceiveEditedMessage", (editedMessage) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === editedMessage.id ? editedMessage : msg
        )
      );
    });

  connection.on("MessageRead", ({
    messageId,
    readAt
  }) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId ? {
          ...m,
          isRead: true,
          readAt
        } : m
      )
    );
  });


    connection.on("UserTyping", (senderId) => {
      if (senderId !== user.id) return;
      setIsTyping(true);
      if (typingTimer.current) clearTimeout(typingTimer.current);
      typingTimer.current = setTimeout(() => setIsTyping(false), 2000);
    });

    connection.on("UserConnected", (userId) => {
      if (userId === user.id) setIsUserOnline(true);
    });

    connection.on("UserDisconnected", (userId) => {
      if (userId === user.id) setIsUserOnline(false);
    });

    connection.on("MessageReaction", ({
      messageId,
      reaction
    }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId ? {
            ...m,
            reaction
          } : m
        )
      );
      new Audio("/assets/music/reaction.mp3").play();
    });

    connection.on("ReceiveRing", (fromUserId) => {
      if (fromUserId !== user.id) return;
      new Audio("/assets/music/ring.wav").play();
      toast.info("Собеседник пытается привлечь ваше внимание 👀");
    });

    connectionRef.current = connection;
    window.connectionRef = connectionRef;
    return () => connection.stop();
  }, [user?.id]);

  return connectionRef;
};
