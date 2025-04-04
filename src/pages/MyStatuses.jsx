import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyStatuses = () => {
  const [statuses, setStatuses] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [newStatus, setNewStatus] = useState({ text: "", file: null });
  const [showStatusOverlay, setShowStatusOverlay] = useState(true);
  const timeoutRef = useRef(null);

  const apiUrl = import.meta.env.VITE_API_URL;
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

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
    fetchStatuses();
  }, []);

  useEffect(() => {
    if (statuses.length > 0) startTimeout();
    return () => clearTimeout(timeoutRef.current);
  }, [statuses, currentIndex]);

  const fetchStatuses = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/status`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setStatuses(res.data);
    } catch (err) {
      console.error("Не удалось загрузить статусы", err);
    }
  };

  const handleFileChange = (e) => {
    setNewStatus({ ...newStatus, file: e.target.files[0] });
  };

  const handleAddStatus = async () => {
    if (!newStatus.text || !newStatus.file) {
      alert("⚠️ Пожалуйста, введите текст и выберите файл.");
      return;
    }

    const formData = new FormData();
    formData.append("Text", newStatus.text);
    formData.append("File", newStatus.file);

    try {
      await axios.post(`${apiUrl}/api/status/add`, formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setShowModal(false);
      setNewStatus({ text: "", file: null });
      fetchStatuses();
    } catch (err) {
      alert("⚠️ Не удалось загрузить статус.");
    }
  };

  const handleDeleteStatus = async (id) => {
    if (!window.confirm("Вы уверены, что хотите удалить этот статус?")) return;

    try {
      await axios.delete(`${apiUrl}/api/status/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const updated = statuses.filter((s) => s.id !== id);
      setStatuses(updated);
      if (currentIndex >= updated.length) {
        setCurrentIndex(Math.max(updated.length - 1, 0));
      }
    } catch (err) {
      alert("⚠️ Не удалось удалить статус.");
    }
  };

  const nextStatus = () => {
    setCurrentIndex((prev) => (prev + 1) % statuses.length);
  };

  const prevStatus = () => {
    setCurrentIndex((prev) => (prev - 1 + statuses.length) % statuses.length);
  };

  const current = statuses[currentIndex];

  return (
    <div className="w-full max-w-md mx-auto p-4 text-center relative">
      {statuses.length === 0 || !showStatusOverlay ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-gray-500 text-sm">
          <p className="mb-4">У вас пока нет статусов</p>
          <div className="flex gap-2">
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              + Добавить
            </button>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-white text-black border border-gray-300 rounded hover:bg-gray-100"
            >
              ← Назад
            </button>
          </div>
        </div>
      ) : (
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
                  onClick={() => navigate("/")}
                  className="text-white text-xl bg-white/20 px-3 py-1 rounded"
                >
                  ←
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeleteStatus(current.id)}
                    className="text-white text-sm bg-red-600 px-4 py-1 rounded"
                  >
                    Удалить
                  </button>
                  <button
                    onClick={() => setShowModal(true)}
                    className="text-white text-sm bg-blue-600 px-4 py-1 rounded"
                  >
                    + Добавить
                  </button>
                </div>
              </div>
            </div>

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
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow w-80 space-y-4">
            <h2 className="text-lg font-bold">Добавить статус</h2>
            <input
              type="text"
              placeholder="Текст статуса..."
              className="w-full border px-3 py-2 rounded"
              value={newStatus.text}
              onChange={(e) =>
                setNewStatus({ ...newStatus, text: e.target.value })
              }
            />
            <input
              type="file"
              accept="image/*,video/*"
              className="w-full"
              onChange={handleFileChange}
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowModal(false)}
              >
                Отмена
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleAddStatus}
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyStatuses;
