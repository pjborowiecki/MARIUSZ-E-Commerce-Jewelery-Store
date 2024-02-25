DO $$ BEGIN
 CREATE TYPE "product_category" AS ENUM('kolczyki', 'pierścionki', 'naszyjniki', 'łańcuszki', 'inne');
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
	"street" varchar(128) NOT NULL,
	"line2" varchar(128),
	"city" varchar(128) NOT NULL,
	"postal_code" varchar(128) NOT NULL,
	"country" varchar(128) DEFAULT 'Poland' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "carts" (
	"id" text PRIMARY KEY NOT NULL,
	"payment_intent_id" varchar(256),
	"client_secret" varchar(256),
	"items" json DEFAULT 'null'::json,
	"closed" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "email_preferences" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" varchar(256),
	"email" varchar(256) NOT NULL,
	"token" varchar(256) NOT NULL,
	"newsletter" boolean DEFAULT false NOT NULL,
	"marketing" boolean DEFAULT false NOT NULL,
	"transactional" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "newsletterSubscribers" (
	"email" varchar(128) PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
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
	"addressId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payments" (
	"id" text PRIMARY KEY NOT NULL,
	"stripe_account_id" varchar(256) NOT NULL,
	"stripe_account_created_at" integer,
	"stripe_account_expires_at" integer,
	"details_submitted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(128) NOT NULL,
	"description" text,
	"images" json DEFAULT 'null'::json,
	"category" "product_category" DEFAULT 'kolczyki' NOT NULL,
	"subcategory" varchar(256),
	"tags" json DEFAULT 'null'::json,
	"price" numeric(10, 2) DEFAULT '0' NOT NULL,
	"inventory" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(128),
	"surname" varchar(128),
	"email" varchar(128) NOT NULL,
	"emailVerified" timestamp,
	"emailVerificationToken" text,
	"passwordHash" text,
	"resetPasswordToken" text,
	"resetPasswordTokenExpiry" timestamp,
	"image" text,
	"store_owner" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
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
DO $$ BEGIN
 ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_addressId_addresses_id_fk" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
