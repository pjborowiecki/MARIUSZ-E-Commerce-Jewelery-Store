DO $$ BEGIN
 CREATE TYPE "category_visibility" AS ENUM('widoczna', 'ukryta');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "product_category" AS ENUM('naszyjniki', 'kolczyki', 'pierścionki', 'inne');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "product_status" AS ENUM('roboczy', 'aktywny', 'zarchiwizowany');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "user_role" AS ENUM('klient', 'administrator');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "accounts" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "accounts_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "addresses" (
	"id" text PRIMARY KEY NOT NULL,
	"line_1" varchar(128) NOT NULL,
	"line_2" varchar(128),
	"city" varchar(128) NOT NULL,
	"postal_code" varchar(128) NOT NULL,
	"country" varchar(128) DEFAULT 'Poland',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "carts" (
	"id" text PRIMARY KEY NOT NULL,
	"payment_intent_id" varchar(256),
	"client_secret" varchar(256),
	"items" json DEFAULT 'null'::json,
	"closed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "categories" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(32) NOT NULL,
	"description" text,
	"visibility" "category_visibility" DEFAULT 'widoczna' NOT NULL,
	"images" json DEFAULT 'null'::json,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp,
	CONSTRAINT "categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "emailPreferences" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"email" varchar(256) NOT NULL,
	"token" varchar(256) NOT NULL,
	"newsletter" boolean DEFAULT false NOT NULL,
	"marketing" boolean DEFAULT false NOT NULL,
	"transactional" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "newsletterSubscribers" (
	"email" varchar(128) PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notifications" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"email" varchar(256) NOT NULL,
	"token" varchar(256) NOT NULL,
	"referred_by" varchar(256),
	"newsletter" boolean DEFAULT false NOT NULL,
	"marketing" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp,
	CONSTRAINT "notifications_email_unique" UNIQUE("email"),
	CONSTRAINT "notifications_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders" (
	"id" text PRIMARY KEY NOT NULL,
	"items" json DEFAULT 'null'::json,
	"quantity" integer,
	"amount" numeric(10, 2) DEFAULT '0' NOT NULL,
	"stripe_payment_intent_id" varchar(256) NOT NULL,
	"stripe_payment_intent_status" varchar(256) NOT NULL,
	"name" varchar(256),
	"email" varchar(256),
	"address_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payments" (
	"id" text PRIMARY KEY NOT NULL,
	"stripe_account_id" varchar(256) NOT NULL,
	"stripe_account_created_at" integer,
	"stripe_account_expires_at" integer,
	"details_submitted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(128) NOT NULL,
	"description" text,
	"images" json DEFAULT 'null'::json,
	"status" "product_status" DEFAULT 'roboczy' NOT NULL,
	"tags" json DEFAULT 'null'::json,
	"price" numeric(10, 2) DEFAULT '0' NOT NULL,
	"inventory" integer DEFAULT 0 NOT NULL,
	"category_name" varchar(32) NOT NULL,
	"subcategory_name" varchar(32) NOT NULL,
	"category_id" text NOT NULL,
	"subcategory_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subcategories" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(32) NOT NULL,
	"description" text,
	"category_name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"role" "user_role" DEFAULT 'klient' NOT NULL,
	"name" varchar(128),
	"surname" varchar(128),
	"email" varchar(128) NOT NULL,
	"emailVerified" timestamp,
	"emailVerificationToken" text,
	"passwordHash" text,
	"resetPasswordToken" text,
	"resetPasswordTokenExpiry" timestamp,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_emailVerificationToken_unique" UNIQUE("emailVerificationToken"),
	CONSTRAINT "users_resetPasswordToken_unique" UNIQUE("resetPasswordToken")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verificationTokens" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationTokens_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "store_orders_id_idx" ON "orders" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "store_orders_address_id_idx" ON "orders" ("address_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "store_payments_id_idx" ON "payments" ("id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_address_id_addresses_id_fk" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_category_name_categories_name_fk" FOREIGN KEY ("category_name") REFERENCES "categories"("name") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_subcategory_name_subcategories_name_fk" FOREIGN KEY ("subcategory_name") REFERENCES "subcategories"("name") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
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
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subcategories" ADD CONSTRAINT "subcategories_category_name_categories_name_fk" FOREIGN KEY ("category_name") REFERENCES "categories"("name") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
