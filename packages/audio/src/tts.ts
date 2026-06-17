export type Voice = "male" | "female";
export type Speed = "normal" | "slow";

const GOOGLE_TTS_API = "https://texttospeech.googleapis.com/v1/text:synthesize";

export async function synthesizeSpeech(
  text: string,
  voice: Voice = "female",
  speed: Speed = "normal"
): Promise<ArrayBuffer> {
  const apiKey = process.env.GOOGLE_CLOUD_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_CLOUD_API_KEY is not set");

  const voiceName = voice === "male" ? "ms-MY-Standard-A" : "ms-MY-Standard-B";
  const speakingRate = speed === "slow" ? 0.7 : 1.0;

  const response = await fetch(`${GOOGLE_TTS_API}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      input: { text },
      voice: { languageCode: "ms-MY", name: voiceName },
      audioConfig: { audioEncoding: "MP3", speakingRate },
    }),
  });

  if (!response.ok) throw new Error(`TTS API error: ${response.statusText}`);

  const data = await response.json();
  const audioContent = data.audioContent as string;
  const binaryStr = atob(audioContent);
  const bytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);
  return bytes.buffer;
}
