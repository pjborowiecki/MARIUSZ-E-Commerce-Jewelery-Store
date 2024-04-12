ALTER TYPE "user_role" ADD VALUE 'klient';--> statement-breakpoint
ALTER TYPE "user_role" ADD VALUE 'administrator';--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "store_owner";