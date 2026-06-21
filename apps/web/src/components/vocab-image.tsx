"use client";

import { useState } from "react";

interface VocabImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function VocabImage({ src, alt, className = "" }: VocabImageProps) {
  const [error, setError] = useState(false);

  if (error) {
    const letter = alt.charAt(0).toUpperCase();
    const colors = [
      "from-blue-400 to-blue-600",
      "from-emerald-400 to-emerald-600",
      "from-amber-400 to-amber-600",
      "from-rose-400 to-rose-600",
      "from-violet-400 to-violet-600",
      "from-cyan-400 to-cyan-600",
    ];
    const colorIndex = alt.length % colors.length;
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br ${colors[colorIndex]} ${className}`}>
        <span className="text-2xl font-bold text-white">{letter}</span>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        onError={() => setError(true)}
        loading="lazy"
      />
    </div>
  );
}
