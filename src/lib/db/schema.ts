import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const userSubscriptions = pgTable('user_subscriptions', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 256 }).notNull(),
  stripeCustomerId: varchar('stripe_customer_id', { length: 256 }).notNull(),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 256 }).notNull(),
  stripePriceId: varchar('stripe_price_id', { length: 256 }).notNull(),
  stripeCurrentPeriodEnd: timestamp('stripe_current_period_end').notNull(),
});

export const userFiles = pgTable('user_files', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 256 }).notNull(),
  fileName: varchar('file_name', { length: 256 }).notNull(),
  fileType: varchar('file_type', { length: 50 }).notNull(),
  filePath: varchar('file_path', { length: 512 }).notNull(),
  machineName: varchar('machine_name', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});