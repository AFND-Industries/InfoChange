CREATE TABLE "payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"kind" text NOT NULL,
	"asset" text DEFAULT 'USDT' NOT NULL,
	"amount" numeric(38, 18) NOT NULL,
	"method" text NOT NULL,
	"method_reference" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "payments_kind_check" CHECK ("payments"."kind" in ('DEPOSIT', 'WITHDRAWAL')),
	CONSTRAINT "payments_amount_positive" CHECK ("payments"."amount" > 0)
);
--> statement-breakpoint
CREATE TABLE "security_questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"prompt" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trades" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"symbol" text NOT NULL,
	"side" text NOT NULL,
	"paid_asset" text NOT NULL,
	"paid_amount" numeric(38, 18) NOT NULL,
	"received_asset" text NOT NULL,
	"received_amount" numeric(38, 18) NOT NULL,
	"fee" numeric(38, 18) NOT NULL,
	"price" numeric(38, 18) NOT NULL,
	"executed_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "trades_side_check" CHECK ("trades"."side" in ('BUY', 'SELL')),
	CONSTRAINT "trades_paid_amount_positive" CHECK ("trades"."paid_amount" > 0)
);
--> statement-breakpoint
CREATE TABLE "transfers" (
	"id" serial PRIMARY KEY NOT NULL,
	"sender_id" integer NOT NULL,
	"recipient_id" integer NOT NULL,
	"asset" text DEFAULT 'USDT' NOT NULL,
	"amount" numeric(38, 18) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "transfers_amount_positive" CHECK ("transfers"."amount" > 0),
	CONSTRAINT "transfers_not_self" CHECK ("transfers"."sender_id" <> "transfers"."recipient_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" text DEFAULT 'user' NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"birth_date" date NOT NULL,
	"gender" text NOT NULL,
	"security_question_id" integer,
	"security_answer_hash" text,
	"address" text NOT NULL,
	"city" text NOT NULL,
	"zip_code" text NOT NULL,
	"country" text NOT NULL,
	"phone" text NOT NULL,
	"document_id" text NOT NULL,
	"ui_mode" smallint DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_role_check" CHECK ("users"."role" in ('user', 'admin'))
);
--> statement-breakpoint
CREATE TABLE "wallets" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"asset" text NOT NULL,
	"quantity" numeric(38, 18) DEFAULT '0' NOT NULL,
	CONSTRAINT "wallets_quantity_non_negative" CHECK ("wallets"."quantity" >= 0)
);
--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trades" ADD CONSTRAINT "trades_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_recipient_id_users_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_security_question_id_security_questions_id_fk" FOREIGN KEY ("security_question_id") REFERENCES "public"."security_questions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "payments_user_idx" ON "payments" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "security_questions_prompt_unique" ON "security_questions" USING btree ("prompt");--> statement-breakpoint
CREATE INDEX "trades_user_idx" ON "trades" USING btree ("user_id","executed_at");--> statement-breakpoint
CREATE INDEX "transfers_sender_idx" ON "transfers" USING btree ("sender_id","created_at");--> statement-breakpoint
CREATE INDEX "transfers_recipient_idx" ON "transfers" USING btree ("recipient_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "users_username_unique" ON "users" USING btree (lower("username"));--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_unique" ON "users" USING btree (lower("email"));--> statement-breakpoint
CREATE UNIQUE INDEX "wallets_user_asset_unique" ON "wallets" USING btree ("user_id","asset");