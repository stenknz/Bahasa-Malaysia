"use client";

import { useState, useRef } from "react";

interface AudioPlayerProps {
  text: string;
  voice?: "male" | "female";
  speed?: "normal" | "slow";
}

export function AudioPlayer({ text, voice = "female", speed = "normal" }: AudioPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  async function play() {
    if (playing && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlaying(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/audio/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice, speed }),
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      if (audioRef.current) {
        audioRef.current.src = url;
        await audioRef.current.play();
        setPlaying(true);
      }
    } catch (err) {
      console.error("Audio playback failed:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={play}
        disabled={loading}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700 hover:bg-primary-200 disabled:opacity-50 dark:bg-primary-900/30 dark:text-primary-400"
        aria-label={loading ? "Loading audio" : playing ? "Stop audio playback" : "Play audio"}
        title={loading ? "Loading..." : playing ? "Stop" : "Play"}
      >
        {loading ? "..." : playing ? "■" : "▶"}
      </button>
      <audio ref={audioRef} onEnded={() => setPlaying(false)} />
    </div>
  );
}
