import React, { useState, useRef } from "react";
import { FiMic, FiStopCircle } from "react-icons/fi";

const VoiceRecorder = ({ onSend }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunks = useRef([]);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (e) => {
        chunks.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: "audio/webm" });
        chunks.current = [];
        const file = new File([blob], "voiceMessage.webm", { type: "audio/webm" });
        onSend(file);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Mikrofon icazəsi alınmadı:", err);
    }
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  return (
    <div className="ml-2">
      {isRecording ? (
        <button onClick={handleStopRecording} className="text-red-600 hover:text-red-700">
          <FiStopCircle size={28} />
        </button>
      ) : (
        <button onClick={handleStartRecording} className="text-gray-700 hover:text-black">
          <FiMic size={24} />
        </button>
      )}
    </div>
  );
};

export default VoiceRecorder;
