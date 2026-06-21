# Hints System Design

## Overview
Add hint systems to two areas: lesson vocabulary (English translation toggle) and conversation practice (scenario-specific suggested phrases).

## 1. Lesson Vocabulary Hints

### Current
Vocab section stores words as string array: `["selamat pagi", "apa khabar"]`

### Change
Switch to object array with malay + english:
```json
{"words": [
  {"malay": "selamat pagi", "english": "Good morning"},
  {"malay": "apa khabar", "english": "How are you"}
]}
```

### UI
Each word card shows:
```
selamat pagi        [Hint] ▶
```
Clicking Hint toggles English visible below the Malay:
```
selamat pagi        [Hide] ▶
Good morning
```

### Implementation
- Update 3 lesson JSON files in `content/lessons/` (vocab section arrays)
- Update `content/seed.ts` section transform (vocabulary → words, already wraps in `{words}`, just needs to handle objects)
- Update `VocabSection` component with `useState` per-word hint toggle
- Re-run seed

## 2. Conversation Practice Hints

### Current
Conversation chat has a blank text input. Beginners don't know what to type.

### Change
Add a "Suggested Phrases" panel above the input with clickable Malay phrases. Each scenario gets ~4 suggested starter phrases. Clicking one sends it immediately.

### Suggested Phrases by Scenario

| Scenario | Phrases |
|----------|---------|
| Restaurant | "Saya mahu nasi ayam", "Tolong bagi menu", "Berapa harga ini?", "Air kosong, tolong" |
| Airport | "Saya nak check in", "Pintu berapa?", "Tolong bagasi saya", "Pukul berapa berlepas?" |
| Hotel | "Saya ada tempahan", "Bilik nombor berapa?", "Tolong kunci bilik", "Ada WiFi percuma?" |
| Shopping | "Berapa harga ini?", "Boleh kurang?", "Saya nak cuba", "Terima kasih" |
| General | "Apa khabar?", "Saya dari Malaysia", "Selamat berkenalan", "Jumpa lagi" |

### UI
Collapsible "Suggested Phrases" bar above the chat input. Shows 4 pill buttons per scenario. Clicking one sends the message to the AI. Collapses after first use (can be re-expanded).

### Implementation
- Add `suggestedPhrases` map in the conversation chat page
- Update conversation chat UI with suggestion pills
- No API changes needed (hints are client-side)

## Implementation Order
1. Update 3 lesson JSON files with english field
2. Update VocabSection component
3. Re-run seed
4. Update conversation chat page with suggestion pills
