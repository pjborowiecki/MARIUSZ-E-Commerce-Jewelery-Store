ALTER TABLE "products" DROP CONSTRAINT "products_category_name_categories_name_fk";
--> statement-breakpoint
ALTER TABLE "products" DROP CONSTRAINT "products_subcategory_name_subcategories_name_fk";
--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "name" SET DATA TYPE varchar(32);--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "subcategory_name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "category_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "subcategory_id" text NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "store_products_category_id_idx" ON "products" ("category_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "store_products_subcategory_id_idx" ON "products" ("subcategory_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_subcategory_id_subcategories_id_fk" FOREIGN KEY ("subcategory_id") REFERENCES "subcategories"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN IF EXISTS "category_name";