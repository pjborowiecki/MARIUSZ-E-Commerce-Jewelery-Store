ALTER TABLE "products" DROP CONSTRAINT "products_category_id_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "products" DROP CONSTRAINT "products_subcategory_id_subcategories_id_fk";
--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN IF EXISTS "category_id";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN IF EXISTS "subcategory_id";