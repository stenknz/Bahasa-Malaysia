const PICSUM_BASE = "https://picsum.photos/seed";

export function getVocabImageUrl(malay: string, english: string): string {
  const keyword = english.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return `${PICSUM_BASE}/${encodeURIComponent(keyword)}/400/300`;
}

export function getLessonImageUrl(slug: string): string {
  return `${PICSUM_BASE}/${encodeURIComponent(slug)}/1200/400`;
}

export function getCultureImageUrl(slug: string): string {
  return `${PICSUM_BASE}/${encodeURIComponent(slug)}/800/400`;
}
