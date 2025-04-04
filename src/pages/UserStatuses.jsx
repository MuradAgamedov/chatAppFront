import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const UserStatuses = () => {
  const [statuses, setStatuses] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef(null);

  const { userId } = useParams();
  const apiUrl = import.meta.env.VITE_API_URL;
  const user = JSON.parse(localStorage.getItem("user"));
 
  const isVideo = (filePath) =>
    filePath.endsWith(".mp4") || filePath.endsWith(".webm") || filePath.endsWith(".mkv");

  const startTimeout = () => {
    clearTimeout(timeoutRef.current);
    const current = statuses[currentIndex];
    if (!isVideo(current.filePath)) {
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % statuses.length);
      }, 5000);
    }
  };

  useEffect(() => {
    fetchUserStatuses();
  }, []);

  useEffect(() => {
    if (statuses.length > 0) startTimeout();
    return () => clearTimeout(timeoutRef.current);
  }, [statuses, currentIndex]);

  const fetchUserStatuses = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/status/by-email/${userId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setStatuses(res.data);
      console.log(res.data)
    } catch (err) {
      console.error("Не удалось загрузить статусы", err);
    }
  };

  const nextStatus = () => {
    setCurrentIndex((prev) => (prev + 1) % statuses.length);
  };

  const prevStatus = () => {
    setCurrentIndex((prev) => (prev - 1 + statuses.length) % statuses.length);
  };

  const current = statuses[currentIndex];

  if (statuses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
        <p className="text-lg mb-4">У пользователя пока нет статусов.</p>
        <button
          onClick={() => window.history.back()}
          className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300"
        >
          Назад
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="relative w-full max-w-sm text-white">
        <div className="relative">
          {isVideo(current.filePath) ? (
            <video
              src={apiUrl + current.filePath}
              autoPlay
              controls
              onEnded={nextStatus}
              className="w-full h-[500px] object-cover rounded"
            />
          ) : (
            <img
              src={apiUrl + current.filePath}
              alt="status"
              className="w-full h-[500px] object-cover rounded"
            />
          )}

          <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 z-50 bg-gradient-to-b from-black/60 to-transparent rounded-t">
            <button
              onClick={() => window.history.back()}
              className="text-white text-xl bg-white/20 px-3 py-1 rounded"
            >
              ←
            </button>
          </div>
        </div>

        {/* Progress bar (clickable) */}
        <div className="flex gap-1 px-4 mt-2">
          {statuses.map((_, idx) => (
            <div
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1 flex-1 rounded-full cursor-pointer ${
                idx < currentIndex
                  ? "bg-white"
                  : idx === currentIndex
                  ? "bg-white animate-pulse"
                  : "bg-white/30"
              }`}
            ></div>
          ))}
        </div>

        {/* Navigation buttons */}
        <button
          onClick={prevStatus}
          className="absolute left-2 top-1/2 -translate-y-1/2 text-white text-3xl px-3 z-50"
        >
          ‹
        </button>
        <button
          onClick={nextStatus}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-3xl px-3 z-50"
        >
          ›
        </button>

        <p className="text-center mt-4">{current.text}</p>
      </div>
    </div>
  );
};

export default UserStatuses;
