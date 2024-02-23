CREATE TABLE IF NOT EXISTS "addresses" (
	"id" text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders" (
	"id" text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"images" json DEFAULT 'null'::json,
	"category" text NOT NULL,
	"subcategory" text,
	"price" numeric(10, 2) DEFAULT '0' NOT NULL,
	"inventory" integer DEFAULT 0 NOT NULL,
	"tags" json DEFAULT 'null'::json,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
