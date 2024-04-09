DO $$ BEGIN
 CREATE TYPE "product_status" AS ENUM('roboczy', 'aktywny', 'zarchiwizowany');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "status" "product_status" DEFAULT 'roboczy' NOT NULL;