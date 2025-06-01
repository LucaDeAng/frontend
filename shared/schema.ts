import { pgTable, text, serial, timestamp, integer, boolean, jsonb, varchar, index, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Enhanced Articles table with advanced features
export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  summary: text("summary").notNull(),
  author: text("author").notNull(),
  category: text("category").notNull(),
  tags: jsonb("tags").$type<string[]>().default([]),
  metaDescription: text("meta_description"),
  metaKeywords: text("meta_keywords"),
  featuredImage: text("featured_image"),
  readingTime: integer("reading_time").default(5),
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  published: boolean("published").default(true),
  date: timestamp("date").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  titleIdx: index("articles_title_idx").on(table.title),
  categoryIdx: index("articles_category_idx").on(table.category),
  tagsIdx: index("articles_tags_idx").on(table.tags),
}));

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
});

export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect;

// Newsletter subscribers table
export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertSubscriberSchema = createInsertSchema(subscribers).omit({
  id: true,
  createdAt: true,
});

export type InsertSubscriber = z.infer<typeof insertSubscriberSchema>;
export type Subscriber = typeof subscribers.$inferSelect;

// Newsletter campaigns table
export const newsletterCampaigns = pgTable("newsletter_campaigns", {
  id: serial("id").primaryKey(),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  htmlContent: text("html_content"),
  recipientsCount: integer("recipients_count").default(0),
  sentCount: integer("sent_count").default(0),
  openCount: integer("open_count").default(0),
  clickCount: integer("click_count").default(0),
  status: text("status").notNull().default('draft'), // 'draft', 'sending', 'sent', 'failed'
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  statusIdx: index("newsletter_campaigns_status_idx").on(table.status),
  sentAtIdx: index("newsletter_campaigns_sent_at_idx").on(table.sentAt),
}));

// Newsletter sends tracking table
export const newsletterSends = pgTable("newsletter_sends", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").notNull().references(() => newsletterCampaigns.id, { onDelete: 'cascade' }),
  subscriberId: integer("subscriber_id").notNull().references(() => subscribers.id, { onDelete: 'cascade' }),
  sentAt: timestamp("sent_at").notNull().defaultNow(),
  opened: boolean("opened").default(false),
  openedAt: timestamp("opened_at"),
  clicked: boolean("clicked").default(false),
  clickedAt: timestamp("clicked_at"),
}, (table) => ({
  campaignSubscriberUnique: unique("campaign_subscriber_send").on(table.campaignId, table.subscriberId),
  campaignIdx: index("newsletter_sends_campaign_idx").on(table.campaignId),
  subscriberIdx: index("newsletter_sends_subscriber_idx").on(table.subscriberId),
}));

// Enhanced Users table for authentication and personalization
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  password: text("password"),
  displayName: text("display_name"),
  avatar: text("avatar"),
  bio: text("bio"),
  preferences: jsonb("preferences").$type<{
    theme: 'light' | 'dark';
    emailNotifications: boolean;
    categories: string[];
  }>().default({ theme: 'dark', emailNotifications: true, categories: [] }),
  isVerified: boolean("is_verified").default(false),
  loginProvider: text("login_provider").default('email'), // 'email', 'google', 'github'
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  emailIdx: index("users_email_idx").on(table.email),
  usernameIdx: index("users_username_idx").on(table.username),
}));

// Comments table
export const comments: any = pgTable("comments", {
  id: serial("id").primaryKey(),
  articleId: integer("article_id").notNull().references(() => articles.id, { onDelete: 'cascade' }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  content: text("content").notNull(),
  parentId: integer("parent_id").references((): any => comments.id, { onDelete: 'cascade' }),
  likes: integer("likes").default(0),
  isEdited: boolean("is_edited").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  articleIdx: index("comments_article_idx").on(table.articleId),
  userIdx: index("comments_user_idx").on(table.userId),
  parentIdx: index("comments_parent_idx").on(table.parentId),
}));

// Bookmarks table
export const bookmarks = pgTable("bookmarks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  articleId: integer("article_id").notNull().references(() => articles.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  userArticleUnique: unique("user_article_bookmark").on(table.userId, table.articleId),
  userIdx: index("bookmarks_user_idx").on(table.userId),
  articleIdx: index("bookmarks_article_idx").on(table.articleId),
}));

// Article ratings table
export const articleRatings = pgTable("article_ratings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  articleId: integer("article_id").notNull().references(() => articles.id, { onDelete: 'cascade' }),
  rating: integer("rating").notNull(), // 1-5 stars
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  userArticleUnique: unique("user_article_rating").on(table.userId, table.articleId),
  userIdx: index("ratings_user_idx").on(table.userId),
  articleIdx: index("ratings_article_idx").on(table.articleId),
}));

// Search queries tracking
export const searchQueries = pgTable("search_queries", {
  id: serial("id").primaryKey(),
  query: text("query").notNull(),
  userId: integer("user_id").references(() => users.id),
  resultsCount: integer("results_count").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  queryIdx: index("search_queries_query_idx").on(table.query),
  userIdx: index("search_queries_user_idx").on(table.userId),
}));

// Social shares tracking
export const socialShares = pgTable("social_shares", {
  id: serial("id").primaryKey(),
  articleId: integer("article_id").notNull().references(() => articles.id, { onDelete: 'cascade' }),
  platform: text("platform").notNull(), // 'twitter', 'facebook', 'linkedin', 'copy'
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  articleIdx: index("shares_article_idx").on(table.articleId),
  platformIdx: index("shares_platform_idx").on(table.platform),
}));

// Define relationships
export const usersRelations = relations(users, ({ many }) => ({
  comments: many(comments),
  bookmarks: many(bookmarks),
  ratings: many(articleRatings),
  searchQueries: many(searchQueries),
}));

export const articlesRelations = relations(articles, ({ many }) => ({
  comments: many(comments),
  bookmarks: many(bookmarks),
  ratings: many(articleRatings),
  shares: many(socialShares),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  article: one(articles, {
    fields: [comments.articleId],
    references: [articles.id],
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
  }),
  replies: many(comments),
}));

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  user: one(users, {
    fields: [bookmarks.userId],
    references: [users.id],
  }),
  article: one(articles, {
    fields: [bookmarks.articleId],
    references: [articles.id],
  }),
}));

export const ratingsRelations = relations(articleRatings, ({ one }) => ({
  user: one(users, {
    fields: [articleRatings.userId],
    references: [users.id],
  }),
  article: one(articles, {
    fields: [articleRatings.articleId],
    references: [articles.id],
  }),
}));

// Newsletter relations
export const subscribersRelations = relations(subscribers, ({ many }) => ({
  sends: many(newsletterSends),
}));

export const newsletterCampaignsRelations = relations(newsletterCampaigns, ({ many }) => ({
  sends: many(newsletterSends),
}));

export const newsletterSendsRelations = relations(newsletterSends, ({ one }) => ({
  campaign: one(newsletterCampaigns, {
    fields: [newsletterSends.campaignId],
    references: [newsletterCampaigns.id],
  }),
  subscriber: one(subscribers, {
    fields: [newsletterSends.subscriberId],
    references: [subscribers.id],
  }),
}));

// Updated schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLoginAt: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  likes: true,
  isEdited: true,
});

export const insertBookmarkSchema = createInsertSchema(bookmarks).omit({
  id: true,
  createdAt: true,
});

export const insertRatingSchema = createInsertSchema(articleRatings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSearchQuerySchema = createInsertSchema(searchQueries).omit({
  id: true,
  createdAt: true,
  resultsCount: true,
});

export const insertSocialShareSchema = createInsertSchema(socialShares).omit({
  id: true,
  createdAt: true,
});

export const insertNewsletterCampaignSchema = createInsertSchema(newsletterCampaigns).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  recipientsCount: true,
  sentCount: true,
  openCount: true,
  clickCount: true,
  sentAt: true,
});

export const insertNewsletterSendSchema = createInsertSchema(newsletterSends).omit({
  id: true,
  sentAt: true,
  opened: true,
  openedAt: true,
  clicked: true,
  clickedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;
export type InsertBookmark = z.infer<typeof insertBookmarkSchema>;
export type Bookmark = typeof bookmarks.$inferSelect;
export type InsertRating = z.infer<typeof insertRatingSchema>;
export type Rating = typeof articleRatings.$inferSelect;
export type InsertSearchQuery = z.infer<typeof insertSearchQuerySchema>;
export type SearchQuery = typeof searchQueries.$inferSelect;
export type InsertSocialShare = z.infer<typeof insertSocialShareSchema>;
export type SocialShare = typeof socialShares.$inferSelect;
export type InsertNewsletterCampaign = z.infer<typeof insertNewsletterCampaignSchema>;
export type NewsletterCampaign = typeof newsletterCampaigns.$inferSelect;
export type InsertNewsletterSend = z.infer<typeof insertNewsletterSendSchema>;
export type NewsletterSend = typeof newsletterSends.$inferSelect;
