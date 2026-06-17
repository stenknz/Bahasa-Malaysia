CREATE TABLE IF NOT EXISTS "srs_data" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"vocabularyId" uuid NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"repetitions" integer DEFAULT 0 NOT NULL,
	"easeFactor" integer DEFAULT 250 NOT NULL,
	"interval" integer DEFAULT 0 NOT NULL,
	"lastReviewDate" date,
	"nextReviewDate" date,
	"lastGrade" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "srs_data" ADD CONSTRAINT "srs_data_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "srs_data" ADD CONSTRAINT "srs_data_vocabularyId_vocabulary_id_fk" FOREIGN KEY ("vocabularyId") REFERENCES "public"."vocabulary"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
