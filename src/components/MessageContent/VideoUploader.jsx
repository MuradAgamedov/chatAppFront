import React, { useRef, useState, useEffect } from "react";
import { FiVideo, FiStopCircle } from "react-icons/fi";

const VideoRecorder = ({ onSend }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunks = useRef([]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const startRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);

      const mediaRecorder = new MediaRecorder(mediaStream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        chunks.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: "video/webm" });
        chunks.current = [];
        const file = new File([blob], "videoMessage.webm", { type: "video/webm" });
        onSend(file);

        // axını dayandır
        mediaStream.getTracks().forEach((track) => track.stop());
        setStream(null);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Kamera və mikrofon icazəsi alınmadı:", err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  return (
    <div className="flex flex-col items-center ml-2">
      {stream && (
        <video
          ref={videoRef}
          autoPlay
          muted
          className="rounded mb-2 border"
          style={{ width: 200, height: 150, objectFit: "cover" }}
        />
      )}

      {isRecording ? (
        <button
          onClick={stopRecording}
          className="text-red-600 hover:text-red-700"
          title="Dayandır"
        >
          <FiStopCircle size={28} />
        </button>
      ) : (
        <button
          onClick={startRecording}
          className="text-gray-700 hover:text-black"
          title="Videoya başla"
        >
          <FiVideo size={24} />
        </button>
      )}
    </div>
  );
};

export default VideoRecorder;
