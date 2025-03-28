import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import * as signalR from "@microsoft/signalr";
import VoiceRecorder from "./VoiceRecorder";
import VideoUploader from "./VideoUploader";
import FileUploader from "./FileUploader";

const MessageList = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isUserOnline, setIsUserOnline] = useState(false);
  const connectionRef = useRef(null);
  const typingTimer = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const [msgRes, onlineRes] = await Promise.all([
          axios.get(`${apiUrl}/api/messages/with/${user.id}`, {
            headers: { Authorization: `Bearer ${currentUser?.token}` },
          }),
          axios.get(`${apiUrl}/api/messages/is-online/${user.id}`, {
            headers: { Authorization: `Bearer ${currentUser?.token}` },
          }),
        ]);

        setMessages(msgRes.data);
        setIsUserOnline(onlineRes.data.isOnline);
      } catch (error) {
        console.error("Verilər yüklənə bilmədi:", error);
      }
    };

    if (user?.id) fetchMessages();
  }, [user]);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${apiUrl}/hubs/chat`, {
        accessTokenFactory: () => currentUser?.token,
      })
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then(() => console.log("SignalR bağlantısı quruldu"))
      .catch((err) => console.error("SignalR bağlantı xətası:", err));

    connection.on("ReceiveMessage", (message) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m.id === message.id);
        return exists ? prev : [...prev, message];
      });
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

    connectionRef.current = connection;

    return () => {
      connection.stop();
    };
  }, [user]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      await axios.post(
        `${apiUrl}/api/messages/send`,
        {
          receiverId: user.id,
          content: newMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setNewMessage("");
    } catch (error) {
      console.error("Mesaj göndərilə bilmədi:", error);
    }
  };

  const handleTyping = () => {
    if (connectionRef.current && user?.id) {
      connectionRef.current
        .invoke("SendTypingNotification", user.id, currentUser.user.id)
        .catch((err) => console.error("Typing invoke xətası:", err));
    }
  };

  const handleDeleteMessage = async (messageId) => {
    const confirmed = window.confirm("Bu mesajı silmək istədiyinizə əminsiniz?");
    if (!confirmed) return;

    try {
      await axios.delete(`${apiUrl}/api/messages/${messageId}`, {
        headers: { Authorization: `Bearer ${currentUser?.token}` },
      });
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    } catch (error) {
      console.error("Mesaj silinə bilmədi:", error);
    }
  };

  const handleSendVoiceMessage = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("receiverId", user.id);

    try {
      const response = await axios.post(`${apiUrl}/api/messages/upload-audio`, formData, {
        headers: {
          Authorization: `Bearer ${currentUser?.token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setMessages((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Səsli mesaj göndərilə bilmədi:", error);
    }
  };

  const handleSendVideoMessage = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("receiverId", user.id);

    try {
      const response = await axios.post(`${apiUrl}/api/messages/upload-video`, formData, {
        headers: {
          Authorization: `Bearer ${currentUser?.token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setMessages((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Video göndərilə bilmədi:", error);
    }
  };

  const handleSendFile = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("receiverId", user.id);

    try {
      const response = await axios.post(`${apiUrl}/api/messages/upload-file`, formData, {
        headers: {
          Authorization: `Bearer ${currentUser?.token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setMessages((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Fayl göndərilə bilmədi:", error);
    }
  };

  return (
    <div className="w-full md:w-2/3 border flex flex-col">
      <div className="py-2 px-3 bg-grey-lighter flex items-center">
        <img
          className="w-10 h-10 rounded-full"
          src={user.avatarUrl ? `${apiUrl}${user.avatarUrl}` : "default-avatar.png"}
          alt="chat avatar"
        />
        <div className="ml-4">
          <p className="text-grey-darkest">{user.fullName || user.userName}</p>
          {isTyping ? (
            <p className="text-red-500 text-xs italic">... yazır</p>
          ) : isUserOnline ? (
            <p className="text-green-600 text-xs font-bold">Online</p>
          ) : null}
        </div>
      </div>

      <div className="px-3 py-2 overflow-y-auto" style={{ backgroundColor: "#DAD3CC", height: "calc(100vh - 160px)" }}>
        {messages.length === 0 ? (
          <p className="text-sm text-center text-gray-600">Hələ mesaj yoxdur</p>
        ) : (
          messages.map((msg) => {
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

            return (
              <div
                key={msg.id}
                className={`flex mb-2 ${msg.senderId === currentUser?.user?.id ? "justify-end" : ""}`}
              >
                <div
                  className="rounded py-2 px-3 relative"
                  style={{
                    backgroundColor: msg.senderId === currentUser?.user?.id ? "#E2F7CB" : "#F2F2F2",
                  }}
                >
                  {content}
                  <p className="text-right text-xs text-grey-dark mt-1">
                    {new Date(msg.sentAt).toLocaleTimeString()}
                    <button onClick={() => handleDeleteMessage(msg.id)} className="text-red-600 text-xs px-2">
                      Sil
                    </button>
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="bg-grey-lighter px-4 py-4 flex items-center">
        <div className="flex-1 mx-4">
          <input
            className="w-full border rounded px-2 py-2"
            type="text"
            placeholder="Mesaj yazın..."
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
        </div>
        <button onClick={handleSendMessage} className="bg-blue-500 text-white px-4 py-2 rounded">
          Göndər
        </button>
        <VoiceRecorder onSend={handleSendVoiceMessage} />
        <VideoUploader onSend={handleSendVideoMessage} />
        <FileUploader onSend={handleSendFile} />
      </div>
    </div>
  );
};

export default MessageList;