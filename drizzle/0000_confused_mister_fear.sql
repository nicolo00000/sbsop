CREATE TABLE IF NOT EXISTS "user_files" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"file_name" varchar(256) NOT NULL,
	"file_type" varchar(50) NOT NULL,
	"file_path" varchar(512) NOT NULL,
	"machine_name" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"stripe_customer_id" varchar(256) NOT NULL,
	"stripe_subscription_id" varchar(256) NOT NULL,
	"stripe_price_id" varchar(256) NOT NULL,
	"stripe_current_period_end" timestamp NOT NULL
);
