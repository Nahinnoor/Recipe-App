import express from "express";
import { ENV } from "./config/env.js";
import { db } from "./config/db.js";
import { favoritesTable } from "./db/schema.js";
import { and, eq } from "drizzle-orm";

const app = express();
const PORT = ENV.PORT;

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

app.post("/api/favorites", async (req, res) => {
  try {
    const { userId, recipeId, title, image, cookingTime, servings } = req.body;

    if (!userId || !recipeId || !title) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const newFavorite = await db
      .insert(favoritesTable)
      .values({ userId, recipeId, title, image, cookingTime, servings })
      .returning();

    res.status(201).json(newFavorite);
    console.log("Favorite added successfully");
  } catch (error) {
    console.error("Error adding favorite:", error);
    res.status(500).json({ message: error.message });
  }
});

app.delete("/api/favorites/:userId/:recipeId", async (req, res) => {
  try {
    const { userId, recipeId } = req.params;
    const deletedFavorite = await db
      .delete(favoritesTable)
      .where(and(eq(favoritesTable.userId, userId), eq(favoritesTable.recipeId, recipeId)));

    res.status(200).json(deletedFavorite);
    console.log("Favorite deleted successfully");
  }
  catch (error) {
    console.error("Error deleting favorite:", error);
    res.status(500).json({ message: error.message });
  }
});