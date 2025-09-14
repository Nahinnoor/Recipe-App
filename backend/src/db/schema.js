import { text } from "drizzle-orm/gel-core";
import { pgTable, serial, timestamp, integer } from "drizzle-orm/pg-core";

//schema for favorites table, all the fields are from drizzle-orm
export const favoritesTable = pgTable("favorites", {
    id: serial("id").primaryKey(),
    userId: text("user_id", { length: 255 }).notNull(),
    recipeId: integer("recipe_id").notNull(),
    title: text("title", { length: 255 }).notNull(),
    image: text("image", { length: 255 }).notNull(),
    cookingTime: text("cooking_time").notNull(),
    servings: text("servings").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});