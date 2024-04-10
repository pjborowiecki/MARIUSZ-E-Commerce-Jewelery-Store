CREATE TABLE IF NOT EXISTS "categories" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(32) NOT NULL,
	"description" text,
	"menu_item" boolean DEFAULT false NOT NULL,
	"images" json DEFAULT 'null'::json,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
