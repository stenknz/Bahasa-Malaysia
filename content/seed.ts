import { readFileSync, readdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { db, schema } from "@malay/db";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sectionTypeMap: Record<string, "vocab" | "grammar" | "dialogue" | "exercise"> = {
  vocabulary: "vocab",
  grammar: "grammar",
  dialogue: "dialogue",
  exercise: "exercise",
};

async function seed() {
  console.log("Seeding from content files...");

  await db.delete(schema.srsData);
  await db.delete(schema.userProgress);
  await db.delete(schema.lessons);
  await db.delete(schema.vocabulary);

  const vocabDir = join(__dirname, "vocabulary");
  const files = readdirSync(vocabDir).sort();
  for (const file of files) {
    const data = JSON.parse(readFileSync(join(vocabDir, file), "utf8"));
    const words = data.words.map((w: any) => ({
      malay: w.malay,
      english: w.english,
      category: data.topicEnglish.toLowerCase().replace(/\s+/g, "-"),
      difficulty: "beginner" as const,
      exampleSentenceMalay: w.exampleSentence || null,
      exampleSentenceEnglish: w.exampleEnglish || null,
    }));
    await db.insert(schema.vocabulary).values(words);
    console.log(`  ${data.topic}: ${words.length} words`);
  }

  const lessonDir = join(__dirname, "lessons");
  if (existsSync(lessonDir)) {
    const lessonFiles = readdirSync(lessonDir).sort();
    for (const file of lessonFiles) {
      const lesson = JSON.parse(readFileSync(join(lessonDir, file), "utf8"));

      const sections = Object.entries(lesson.sections)
        .filter(([key]) => sectionTypeMap[key])
        .map(([key, content], index) => ({
          type: sectionTypeMap[key],
          content: content as Record<string, unknown>,
          order: index + 1,
        }));

      await db.insert(schema.lessons).values({
        slug: lesson.slug,
        title: lesson.title,
        description: lesson.description,
        order: lesson.order,
        level: lesson.level,
        status: "published",
        topic: lesson.slug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
        sections: sections as any,
      });
      console.log(`  Lesson: ${lesson.title}`);
    }
  }

  console.log("Seed complete!");
}

seed().catch(console.error);
