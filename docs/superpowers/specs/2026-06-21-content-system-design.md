# Content System Design

## Overview
Replace hardcoded seed data with a file-based content system using JSON source files and a seed script. Contents include vocabulary (200 words), lessons (10+), grammar topics, and cultural content.

## Architecture

```
content/
  vocabulary/          # One JSON file per topic
  lessons/             # One JSON file per lesson
  grammar/             # Grammar reference topics
  culture/             # Cultural content
  seed.ts              # Reads all JSON, inserts via Drizzle
```

All files at project root (`content/`). The seed script uses `tsx` to run and reads files from disk via `fs`.

## Vocabulary Schema

Each vocabulary JSON file:
```json
{
  "topic": "Nombor",
  "topicEnglish": "Numbers",
  "order": 1,
  "words": [
    {
      "malay": "satu",
      "english": "one",
      "exampleSentence": "Saya ada satu buku.",
      "exampleEnglish": "I have one book."
    }
  ]
}
```

| # | Topic | Malay | Words |
|---|-------|-------|-------|
| 1 | Numbers | Nombor | 15 |
| 2 | Food & Drink | Makanan & Minuman | 25 |
| 3 | Family | Keluarga | 15 |
| 4 | Places & Directions | Tempat & Arah | 20 |
| 5 | Time & Weather | Masa & Cuaca | 20 |
| 6 | Shopping | Belanja | 20 |
| 7 | Transport | Pengangkutan | 20 |
| 8 | Career | Kerjaya | 20 |
| 9 | Health | Kesihatan | 25 |
| 10 | Daily Activities | Aktiviti Harian | 20 |

**Total: 200 words**

## Lesson Schema

Each lesson JSON file:
```json
{
  "slug": "greetings",
  "title": "Greetings & Introductions",
  "description": "Learn how to greet people and introduce yourself",
  "order": 1,
  "level": "beginner",
  "sections": {
    "vocabulary": ["selamat pagi", "apa khabar", ...],
    "grammar": { "title": "...", "explanation": "...", "examples": [...] },
    "dialogue": [{ "speaker": "Ali", "malay": "...", "english": "..." }],
    "exercise": [{ "question": "...", "options": [...], "correct": 0 }]
  }
}
```

Lessons reference vocabulary by malay word. The seed script looks up word IDs to populate the lesson-vocabulary mapping.

## Grammar Schema

```json
{
  "slug": "pronouns",
  "title": "Personal Pronouns",
  "category": "basics",
  "explanation": "Malay pronouns...",
  "rules": [...],
  "examples": [{ "malay": "Saya", "english": "I/me" }],
  "commonMistakes": [...]
}
```

## Seed Strategy

- `content/seed.ts` reads all JSON files via `fs.readFileSync`
- Clears existing data in dependency order (child tables first)
- Inserts vocabulary first (to get IDs for lesson references)
- Then inserts lessons
- Then grammar and culture content
- Idempotent: running multiple times produces the same result

## Implementation Order

1. Create `content/` directory structure with empty placeholder files
2. Write vocabulary JSON files (10 topics, 200 words)
3. Write lesson JSON files (3-5 beginner lessons)
4. Write grammar and culture JSON files
5. Write `content/seed.ts`
6. Update root `package.json` with seed script entry
7. Run seed and verify in app
