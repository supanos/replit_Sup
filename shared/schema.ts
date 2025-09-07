import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, jsonb, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Menu Categories
export const menuCategories = pgTable("menu_categories", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  displayOrder: integer("order").notNull(),
});

// Menu Items
export const menuItems = pgTable("menu_items", {
  id: varchar("id").primaryKey(),
  categoryId: varchar("category_id").notNull().references(() => menuCategories.id),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  image: text("image"),
  badges: jsonb("badges").$type<string[]>(),
  allergens: jsonb("allergens").$type<string[]>(),
});

// Events
export const events = pgTable("events", {
  id: varchar("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  startDate: timestamp("start").notNull(),
  endDate: timestamp("end").notNull(),
  image: text("image"),
  description: text("description"),
  tags: jsonb("tags").$type<string[]>(),
});

// Games Schedule
export const games = pgTable("games", {
  id: varchar("id").primaryKey(),
  league: text("league").notNull(),
  homeTeam: text("home_team").notNull(),
  awayTeam: text("away_team").notNull(),
  homeAbbr: text("home_abbr").notNull(),
  awayAbbr: text("away_abbr").notNull(),
  startTime: timestamp("datetime").notNull(),
  channel: text("channel"),
});

// Reservations
export const reservations = pgTable("reservations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  partySize: integer("party_size").notNull(),
  date: timestamp("date").notNull(),
  time: text("time").notNull(),
  specialRequests: text("special_requests"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Settings table
export const settings = pgTable("settings", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  hours: jsonb("hours").$type<Array<{ day: string; open: string; close: string }>>()
    .default(sql`'[]'::jsonb`),
  socials: jsonb("socials").$type<{
    facebook?: string;
    instagram?: string;
    twitter?: string;
    yelp?: string;
  }>().default(sql`'{}'::jsonb`),
  hero: jsonb("hero").$type<{
    backgroundImage: string;
    title: string;
    subtitle: string;
  }>().default(sql`'{"backgroundImage":"","title":"","subtitle":""}'::jsonb`),
  footer: jsonb("footer").$type<{
    description: string;
    links: Array<{ title: string; url: string }>;
    copyright: string;
  }>().default(sql`'{"description":"","links":[],"copyright":""}'::jsonb`),
});

// Promotions table
export const promotions = pgTable("promotions", {
  id: varchar("id").primaryKey(),
  landing: jsonb("landing").$type<{
    enabled: boolean;
    start: string;
    end: string;
    redirectAllRoutes: boolean;
  }>().default(sql`'{"enabled":false,"start":"","end":"","redirectAllRoutes":false}'::jsonb`),
  sideBanner: jsonb("side_banner").$type<{
    enabled: boolean;
    start: string;
    end: string;
    message: string;
    link: string;
    placement: string;
  }>().default(sql`'{"enabled":false,"start":"","end":"","message":"","link":"","placement":""}'::jsonb`),
  happyHour: jsonb("happy_hour").$type<{
    enabled: boolean;
    title: string;
    subtitle: string;
    description: string;
    days: string;
    timeRange: string;
    offers: Array<{
      icon: string;
      title: string;
      description: string;
      discount: string;
    }>;
  }>().default(sql`'{"enabled":false,"title":"","subtitle":"","description":"","days":"","timeRange":"","offers":[]}'::jsonb`),
});

// Landing table
export const landing = pgTable("landing", {
  id: varchar("id").primaryKey(),
  popup: jsonb("popup").$type<{
    enabled: boolean;
    duration: number;
    autoRedirect: boolean;
    redirectUrl: string;
  }>().default(sql`'{"enabled":false,"duration":0,"autoRedirect":false,"redirectUrl":""}'::jsonb`),
});

// Zod schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertMenuCategorySchema = createInsertSchema(menuCategories);
export const insertMenuItemSchema = createInsertSchema(menuItems);
export const insertEventSchema = createInsertSchema(events);
export const insertGameSchema = createInsertSchema(games);
export const insertReservationSchema = createInsertSchema(reservations).omit({ id: true, createdAt: true });
export const insertSettingsSchema = createInsertSchema(settings);
export const insertPromotionsSchema = createInsertSchema(promotions);
export const insertLandingSchema = createInsertSchema(landing);

// Types matching client expectations
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type MenuCategory = typeof menuCategories.$inferSelect;
export type InsertMenuCategory = z.infer<typeof insertMenuCategorySchema>;

export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

export type Game = typeof games.$inferSelect;
export type InsertGame = z.infer<typeof insertGameSchema>;

export type Reservation = typeof reservations.$inferSelect;
export type InsertReservation = z.infer<typeof insertReservationSchema>;

export type Settings = typeof settings.$inferSelect;
export type InsertSettings = z.infer<typeof insertSettingsSchema>;

export type Promotions = typeof promotions.$inferSelect;
export type InsertPromotions = z.infer<typeof insertPromotionsSchema>;

export type Landing = typeof landing.$inferSelect;
export type InsertLanding = z.infer<typeof insertLandingSchema>;

// Legacy types for backward compatibility
export type SiteSettings = Settings;
export type LandingContent = Landing;

// Schema validators
export const siteSettingsSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  phone: z.string(),
  email: z.string().email(),
  hours: z.array(z.object({
    day: z.string(),
    open: z.string(),
    close: z.string()
  })),
  socials: z.object({
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    twitter: z.string().optional(),
    yelp: z.string().optional()
  }),
  hero: z.object({
    backgroundImage: z.string(),
    title: z.string(),
    subtitle: z.string()
  }),
  footer: z.object({
    description: z.string(),
    links: z.array(z.object({
      title: z.string(),
      url: z.string()
    })),
    copyright: z.string()
  })
});

export const landingContentSchema = z.object({
  popup: z.object({
    enabled: z.boolean(),
    duration: z.number(),
    autoRedirect: z.boolean()
  }),
  hero: z.object({
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    backgroundImage: z.string(),
    ctaText: z.string(),
    ctaLink: z.string()
  }),
  features: z.array(z.object({
    icon: z.string(),
    title: z.string(),
    description: z.string()
  })),
  specialOffer: z.object({
    enabled: z.boolean(),
    title: z.string(),
    description: z.string(),
    badge: z.string()
  })
});

export const promotionsSchema = z.object({
  landing: z.object({
    enabled: z.boolean(),
    start: z.string(),
    end: z.string(),
    redirectAllRoutes: z.boolean()
  }),
  sideBanner: z.object({
    enabled: z.boolean(),
    start: z.string(),
    end: z.string(),
    message: z.string(),
    link: z.string(),
    placement: z.string()
  }),
  happyHour: z.object({
    enabled: z.boolean(),
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    days: z.string(),
    timeRange: z.string(),
    offers: z.array(z.object({
      icon: z.string(),
      title: z.string(),
      description: z.string(),
      discount: z.string()
    }))
  })
});