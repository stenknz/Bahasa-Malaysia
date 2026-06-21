CREATE TABLE IF NOT EXISTS "daily_activity" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"date" date NOT NULL,
	"xpEarned" integer DEFAULT 0 NOT NULL,
	"lessonsCompleted" integer DEFAULT 0 NOT NULL,
	"wordsReviewed" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "daily_activity" ADD CONSTRAINT "daily_activity_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
