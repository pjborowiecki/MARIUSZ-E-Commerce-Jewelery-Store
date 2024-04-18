ALTER TABLE "subcategories" DROP CONSTRAINT "subcategories_category_id_categories_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "store_subcategories_category_id_idx";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "store_subcategories_category_name_idx" ON "subcategories" ("category_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subcategories" ADD CONSTRAINT "subcategories_category_id_categories_name_fk" FOREIGN KEY ("category_id") REFERENCES "categories"("name") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
