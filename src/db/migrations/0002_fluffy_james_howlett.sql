DO $$ BEGIN
 CREATE TYPE "order_status" AS ENUM('nowe', 'w trakcie realizacji', 'oczekuje wysyłki', 'wysłane', 'dostarczone', 'zamknięte');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "payment_status" AS ENUM('nieopłacone', 'opłacone');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "user_role" AS ENUM('customer', 'owner');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "customer" "user_role";