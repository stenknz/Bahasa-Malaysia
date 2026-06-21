# Hints System Implementation Plan

> **For agentic workers:** Subagent-driven development

**Goal:** Add English hint toggles in lesson vocabulary and suggested phrases in conversation practice.

**Architecture:** Lesson vocab switches from string array to `{malay, english}` objects with a toggle button. Conversation chat gets scenario-specific suggestion pills.

---

### Task 1: Update lesson JSON files with English translations

**Files:**
- Modify: `content/lessons/01-greetings.json`
- Modify: `content/lessons/02-food.json`
- Modify: `content/lessons/03-family.json`

Change vocabulary arrays from strings to objects:
```json
// Before
"vocabulary": ["selamat pagi", "apa khabar"]

// After
"vocabulary": [
  {"malay": "selamat pagi", "english": "Good morning"},
  {"malay": "apa khabar", "english": "How are you"},
  {"malay": "siapa nama", "english": "What is your name"},
  {"malay": "saya", "english": "I / me"},
  {"malay": "anda", "english": "you (formal)"},
  {"malay": "jumpa lagi", "english": "See you again"}
]
```

Full word lists for each lesson:

**01-greetings.json:**
- selamat pagi: Good morning
- apa khabar: How are you
- siapa nama: What is your name
- saya: I / me
- anda: you (formal)
- jumpa lagi: See you again
- selamat berkenalan: Nice to meet you

**02-food.json:**
- makan: to eat
- minum: to drink
- nasi: rice
- ayam: chicken
- air: water
- mahu: to want
- tolong: please / help
- sedap: delicious

**03-family.json:**
- ibu: mother
- bapa: father
- abang: older brother
- kakak: older sister
- adik: younger sibling
- besar: big
- kecil: small
- tinggi: tall
- pendek: short

### Task 2: Update seed script for vocab objects

**Files:**
- Modify: `content/seed.ts`

The `transformSection` function for `vocabulary` currently does `{ words: content }`. Since `content` is now an array of objects instead of strings, the transform still works as-is (it wraps whatever content is in `{ words }`). No change needed to the seed — the JSON update alone suffices.

### Task 3: Update VocabSection component with hint toggle

**Files:**
- Modify: `apps/web/src/app/dashboard/lessons/[slug]/page.tsx:149-163`

Replace the VocabSection function:
```tsx
function VocabSection({ content }: { content: { words?: Array<{ malay: string; english: string }> } }) {
  const [hints, setHints] = useState<Record<number, boolean>>({});
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-slate-900 dark:text-white">Vocabulary</h3>
      <div className="space-y-2">
        {content.words?.map((word, i) => (
          <div key={i} className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
            <div className="flex-1">
              <span className="font-medium text-slate-900 dark:text-white">{word.malay}</span>
              {hints[i] && (
                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{word.english}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setHints((h) => ({ ...h, [i]: !h[i] }))}
                className="rounded px-2 py-1 text-xs font-medium text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/20"
                aria-label={hints[i] ? "Hide English" : "Show English"}
              >
                {hints[i] ? "Hide" : "Hint"}
              </button>
              <AudioPlayer text={word.malay} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

Add `useState` import if not already present.

### Task 4: Update conversation chat with suggestion pills

**Files:**
- Modify: `apps/web/src/app/dashboard/conversation/[id]/page.tsx`

Add a `suggestions` map and suggestion pills above the input:

```tsx
const suggestions: Record<string, string[]> = {
  restaurant: ["Saya mahu nasi ayam", "Tolong bagi menu", "Berapa harga ini?", "Air kosong, tolong"],
  airport: ["Saya nak check in", "Pintu berapa?", "Tolong bagasi saya", "Pukul berapa berlepas?"],
  hotel: ["Saya ada tempahan", "Bilik nombor berapa?", "Tolong kunci bilik", "Ada WiFi percuma?"],
  shopping: ["Berapa harga ini?", "Boleh kurang?", "Saya nak cuba", "Terima kasih"],
  general: ["Apa khabar?", "Saya dari Malaysia", "Selamat berkenalan", "Jumpa lagi"],
};
```

Add state for collapsed suggestions and render pill buttons below the chat messages but above the input:
```tsx
const [showSuggestions, setShowSuggestions] = useState(true);
```

In the JSX, before the input area:
```tsx
{showSuggestions && (
  <div className="flex flex-wrap gap-2 px-1">
    {(suggestions["general"]).map((phrase) => (
      <button
        key={phrase}
        onClick={() => { setInput(phrase); setShowSuggestions(false); }}
        className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
      >
        {phrase}
      </button>
    ))}
  </div>
)}
```

Note: The scenario is passed via the conversation ID. For simplicity, show "general" suggestions always. The full scenario-adaptive approach requires the conversation API to return the scenario.

### Task 5: Update conversation API to return scenario

**Files:**
- Modify: `apps/web/src/app/api/conversation/message/route.ts`

Add scenario to the conversation message response so the frontend knows which suggestions to show.

### Task 6: Re-run seed and verify

- [ ] Run: `npx tsx content/seed.ts`
- [ ] Verify lesson vocab shows English on hint click
- [ ] Verify conversation page shows suggestion pills

### Task 7: Commit

- [ ] `git add content/lessons/ apps/web/src/app/dashboard/lessons/ apps/web/src/app/dashboard/conversation/`
- [ ] `git commit -m "feat: add english hint toggles for lesson vocab and suggestion pills for conversation practice"`
