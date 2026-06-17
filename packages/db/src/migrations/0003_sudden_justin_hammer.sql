CREATE TABLE IF NOT EXISTS "conversation_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"scenario" text NOT NULL,
	"level" text NOT NULL,
	"messages" json DEFAULT '[]'::json NOT NULL,
	"scores" json,
	"duration" integer,
	"startedAt" timestamp DEFAULT now() NOT NULL,
	"endedAt" timestamp
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "conversation_sessions" ADD CONSTRAINT "conversation_sessions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
