ALTER TABLE "products" ADD COLUMN "color" varchar(64);--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "material" varchar(64);--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "stone" varchar(64);--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "stone_size" numeric(10, 2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "length" numeric(10, 2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "weight" numeric(10, 2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "processing_time" integer DEFAULT 1;