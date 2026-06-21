export type Voice = "male" | "female";
export type Speed = "normal" | "slow";

let voiceCache: SpeechSynthesisVoice[] = [];

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (voiceCache.length > 0) return Promise.resolve(voiceCache);
  return new Promise((resolve) => {
    const voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
      voiceCache = voices;
      resolve(voices);
      return;
    }
    speechSynthesis.onvoiceschanged = () => {
      voiceCache = speechSynthesis.getVoices();
      resolve(voiceCache);
    };
  });
}

function findBestVoice(voices: SpeechSynthesisVoice[], preferred: Voice): SpeechSynthesisVoice | null {
  const lang = "ms-MY";
  const maleKeywords = ["male", "laki", "daniel", "david"];
  const femaleKeywords = ["female", "perempuan", "zira", "samantha", "sarah"];

  const malayVoices = voices.filter((v) => v.lang.startsWith("ms") || v.lang.startsWith("zsm"));
  if (malayVoices.length > 0) {
    const preferredMatches = malayVoices.filter((v) =>
      preferred === "male"
        ? maleKeywords.some((k) => v.name.toLowerCase().includes(k))
        : femaleKeywords.some((k) => v.name.toLowerCase().includes(k))
    );
    if (preferredMatches.length > 0) return preferredMatches[0];
    return malayVoices[0];
  }

  const indonesianVoices = voices.filter((v) => v.lang.startsWith("id"));
  if (indonesianVoices.length > 0) return indonesianVoices[0];

  const englishVoices = voices.filter((v) => v.lang.startsWith("en"));
  if (preferred === "male") {
    const male = englishVoices.find((v) => maleKeywords.some((k) => v.name.toLowerCase().includes(k)));
    if (male) return male;
  } else {
    const female = englishVoices.find((v) => femaleKeywords.some((k) => v.name.toLowerCase().includes(k)));
    if (female) return female;
  }
  return englishVoices[0] || voices[0] || null;
}

export async function speak(text: string, voice: Voice = "female", speed: Speed = "normal"): Promise<void> {
  return new Promise(async (resolve, reject) => {
    if (!("speechSynthesis" in window)) {
      reject(new Error("Speech synthesis not supported"));
      return;
    }

    if (speechSynthesis.speaking) speechSynthesis.cancel();

    const voices = await loadVoices();
    const selected = findBestVoice(voices, voice);
    const utterance = new SpeechSynthesisUtterance(text);
    if (selected) utterance.voice = selected;
    utterance.lang = "ms-MY";
    utterance.rate = speed === "slow" ? 0.7 : 0.9;
    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(e);
    speechSynthesis.speak(utterance);
  });
}

export function stop(): void {
  if ("speechSynthesis" in window) speechSynthesis.cancel();
}

export async function getAvailableVoices(): Promise<SpeechSynthesisVoice[]> {
  return loadVoices();
}
