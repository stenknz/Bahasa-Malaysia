"use client";

import { useState, useRef } from "react";

interface SpeakButtonProps {
  expected: string;
  onResult: (result: { accuracy: number }) => void;
}

export function SpeakButton({ expected, onResult }: SpeakButtonProps) {
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        setLoading(true);
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("audio", blob);
        formData.append("expected", expected);

        try {
          const res = await fetch("/api/audio/pronunciation", { method: "POST", body: formData });
          const result = await res.json();
          onResult(result);
        } catch (err) {
          console.error("Pronunciation check failed:", err);
        } finally {
          setLoading(false);
          stream.getTracks().forEach((t) => t.stop());
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecording(true);
    } catch (err) {
      console.error("Microphone access denied:", err);
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  }

  return (
    <button
      onClick={recording ? stopRecording : startRecording}
      disabled={loading}
      className={`flex h-16 w-16 items-center justify-center rounded-full text-white transition-all ${
        recording
          ? "bg-red-500 animate-pulse"
          : loading
            ? "bg-slate-400"
            : "bg-primary-600 hover:bg-primary-700"
      }`}
      aria-label={recording ? "Stop recording" : "Press to speak"}
    >
      {loading ? "..." : recording ? "■" : "🎤"}
    </button>
  );
}
