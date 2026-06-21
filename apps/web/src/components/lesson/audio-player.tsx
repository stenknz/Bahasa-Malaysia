"use client";

import { useState, useRef } from "react";
import { speak, stop } from "@malay/audio";

interface AudioPlayerProps {
  text: string;
  voice?: "male" | "female";
  speed?: "normal" | "slow";
}

export function AudioPlayer({ text, voice = "female", speed = "normal" }: AudioPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentText = useRef(text);

  async function play() {
    if (playing) {
      stop();
      setPlaying(false);
      return;
    }

    if (!("speechSynthesis" in window)) {
      setError("Speech synthesis not supported");
      return;
    }

    currentText.current = text;
    setLoading(true);
    setError(null);
    try {
      await speak(text, voice, speed);
      if (currentText.current === text) setPlaying(false);
    } catch (err) {
      if (currentText.current === text) {
        setError("Audio failed");
        setPlaying(false);
      }
    } finally {
      if (currentText.current === text) setLoading(false);
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
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
