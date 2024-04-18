ALTER TABLE "categories" DROP CONSTRAINT "categories_slug_unique";--> statement-breakpoint
ALTER TABLE "subcategories" DROP CONSTRAINT "subcategories_slug_unique";--> statement-breakpoint
ALTER TABLE "categories" DROP COLUMN IF EXISTS "slug";--> statement-breakpoint
ALTER TABLE "subcategories" DROP COLUMN IF EXISTS "slug";