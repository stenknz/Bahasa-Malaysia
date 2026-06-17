import { db } from "./index";
import { schema } from "./index";

async function seed() {
  console.log("Seeding database...");

  const vocabularyData = [
    { malay: "Selamat pagi", english: "Good morning", category: "Greetings", difficulty: "beginner" as const, partOfSpeech: "phrase" as const },
    { malay: "Selamat petang", english: "Good afternoon", category: "Greetings", difficulty: "beginner" as const, partOfSpeech: "phrase" as const },
    { malay: "Selamat malam", english: "Good night", category: "Greetings", difficulty: "beginner" as const, partOfSpeech: "phrase" as const },
    { malay: "Apa khabar", english: "How are you", category: "Greetings", difficulty: "beginner" as const, partOfSpeech: "phrase" as const },
    { malay: "Terima kasih", english: "Thank you", category: "Greetings", difficulty: "beginner" as const, partOfSpeech: "phrase" as const },
    { malay: "Sama-sama", english: "You're welcome", category: "Greetings", difficulty: "beginner" as const, partOfSpeech: "phrase" as const },
    { malay: "Selamat tinggal", english: "Goodbye", category: "Greetings", difficulty: "beginner" as const, partOfSpeech: "phrase" as const },
    { malay: "Jumpa lagi", english: "See you again", category: "Greetings", difficulty: "beginner" as const, partOfSpeech: "phrase" as const },
    { malay: "Ya", english: "Yes", category: "Greetings", difficulty: "beginner" as const, partOfSpeech: "interjection" as const },
    { malay: "Tidak", english: "No", category: "Greetings", difficulty: "beginner" as const, partOfSpeech: "interjection" as const },
    { malay: "Saya", english: "I / me / my", category: "Introductions", difficulty: "beginner" as const, partOfSpeech: "pronoun" as const },
    { malay: "Nama", english: "Name", category: "Introductions", difficulty: "beginner" as const, partOfSpeech: "noun" as const },
    { malay: "Dari", english: "From", category: "Introductions", difficulty: "beginner" as const, partOfSpeech: "preposition" as const },
    { malay: "Awak", english: "You", category: "Introductions", difficulty: "beginner" as const, partOfSpeech: "pronoun" as const },
    { malay: "Satu", english: "One", category: "Numbers", difficulty: "beginner" as const, partOfSpeech: "noun" as const },
    { malay: "Dua", english: "Two", category: "Numbers", difficulty: "beginner" as const, partOfSpeech: "noun" as const },
    { malay: "Tiga", english: "Three", category: "Numbers", difficulty: "beginner" as const, partOfSpeech: "noun" as const },
    { malay: "Empat", english: "Four", category: "Numbers", difficulty: "beginner" as const, partOfSpeech: "noun" as const },
    { malay: "Lima", english: "Five", category: "Numbers", difficulty: "beginner" as const, partOfSpeech: "noun" as const },
    { malay: "Enam", english: "Six", category: "Numbers", difficulty: "beginner" as const, partOfSpeech: "noun" as const },
  ];

  for (const word of vocabularyData) {
    await db.insert(schema.vocabulary).values(word).onConflictDoNothing();
  }
  console.log(`Inserted ${vocabularyData.length} vocabulary words`);

  const lessonsData = [
    {
      slug: "greetings",
      title: "Greetings",
      description: "Learn common Malaysian greetings and polite expressions",
      order: 1,
      level: "beginner" as const,
      topic: "Greetings",
      xpReward: 100,
      sections: [
        { type: "vocab" as const, order: 1, content: { words: ["Selamat pagi", "Apa khabar", "Terima kasih", "Sama-sama", "Selamat tinggal"] } },
        { type: "grammar" as const, order: 2, content: { explanation: "Selamat means 'safe' or 'peaceful'. It is used in all time-based greetings: Selamat pagi (morning), Selamat petang (afternoon), Selamat malam (night)." } },
        { type: "dialogue" as const, order: 3, content: { lines: [
          { speaker: "Ali", malay: "Selamat pagi! Apa khabar?", english: "Good morning! How are you?" },
          { speaker: "Betty", malay: "Selamat pagi! Khabar baik. Terima kasih.", english: "Good morning! I'm fine. Thank you." },
          { speaker: "Ali", malay: "Sama-sama. Jumpa lagi!", english: "You're welcome. See you again!" },
        ]} },
        { type: "exercise" as const, order: 4, content: { questions: [
          { malay: "Apa khabar", options: ["How are you", "Good morning", "Thank you", "Goodbye"], correct: 0 },
          { malay: "Terima kasih", options: ["You're welcome", "Thank you", "Good morning", "Goodbye"], correct: 1 },
          { malay: "Selamat pagi", options: ["Good night", "Good afternoon", "Good morning", "Goodbye"], correct: 2 },
        ]} },
      ],
      status: "published" as const,
    },
    {
      slug: "introductions",
      title: "Introductions",
      description: "Introduce yourself and ask others about themselves",
      order: 2,
      level: "beginner" as const,
      topic: "Introductions",
      xpReward: 100,
      sections: [
        { type: "vocab" as const, order: 1, content: { words: ["Saya", "Nama", "Dari", "Awak"] } },
        { type: "grammar" as const, order: 2, content: { explanation: "In Malay, word order is similar to English: Subject + Verb + Object. 'Saya' means I/me/my. 'Awak' means you (informal). 'Nama' means name. To say 'My name is...' use 'Nama saya...'" } },
        { type: "dialogue" as const, order: 3, content: { lines: [
          { speaker: "Ali", malay: "Nama saya Ali. Nama awak?", english: "My name is Ali. What's your name?" },
          { speaker: "Betty", malay: "Saya Betty. Saya dari Amerika.", english: "I'm Betty. I'm from America." },
          { speaker: "Ali", malay: "Selamat datang ke Malaysia!", english: "Welcome to Malaysia!" },
        ]} },
        { type: "exercise" as const, order: 4, content: { questions: [
          { malay: "Nama saya...", options: ["My name is...", "Your name is...", "His name is...", "Her name is..."], correct: 0 },
          { malay: "Saya dari...", options: ["I am going to...", "I am from...", "I like...", "I want..."], correct: 1 },
          { malay: "Apa khabar?", options: ["What is your name?", "Where are you from?", "How are you?", "Good morning"], correct: 2 },
        ]} },
      ],
      status: "published" as const,
    },
    {
      slug: "numbers",
      title: "Numbers 1-10",
      description: "Count from one to ten in Bahasa Malaysia",
      order: 3,
      level: "beginner" as const,
      topic: "Numbers",
      xpReward: 100,
      sections: [
        { type: "vocab" as const, order: 1, content: { words: ["Satu", "Dua", "Tiga", "Empat", "Lima", "Enam"] } },
        { type: "grammar" as const, order: 2, content: { explanation: "Numbers in Malay are straightforward. Satu (1), Dua (2), Tiga (3), Empat (4), Lima (5), Enam (6), Tujuh (7), Lapan (8), Sembilan (9), Sepuluh (10). To ask 'How many?' say 'Berapa?'" } },
        { type: "dialogue" as const, order: 3, content: { lines: [
          { speaker: "A", malay: "Berapa harga ini?", english: "How much is this?" },
          { speaker: "B", malay: "Lima ringgit.", english: "Five ringgit." },
          { speaker: "A", malay: "Saya mahu dua.", english: "I want two." },
        ]} },
        { type: "exercise" as const, order: 4, content: { questions: [
          { malay: "Satu + Dua = ?", options: ["Tiga", "Empat", "Lima", "Enam"], correct: 0 },
          { malay: "Berapa means...", options: ["Where", "When", "How many", "Why"], correct: 2 },
          { malay: "Tiga + Tiga = ?", options: ["Lima", "Enam", "Tujuh", "Lapan"], correct: 1 },
        ]} },
      ],
      status: "published" as const,
    },
  ];

  for (const lesson of lessonsData) {
    await db.insert(schema.lessons).values(lesson).onConflictDoNothing();
  }
  console.log(`Inserted ${lessonsData.length} lessons`);

  console.log("Seed complete!");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => process.exit(0));
