DO $$ BEGIN
 CREATE TYPE "product_importance" AS ENUM('wyróżniony', 'standardowy');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "importance" "product_importance" DEFAULT 'standardowy' NOT NULL;