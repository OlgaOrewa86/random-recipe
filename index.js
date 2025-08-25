import express from "express";
import axios from "axios";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Serve static assets from the 'public' folder
app.use(express.static("public"));

app.get("/", (req, res) => {
  // Render the homepage with a default message and no recipe
  res.render("index.ejs", {
    message: "Search for a random recipe",
    recipe: null,
    ingredients: [],
  });
});

app.get("/random", async (req, res) => {
  // Fetch a random recipe from TheMealDB API
  try {
    const result = await axios.get(
      "https://www.themealdb.com/api/json/v1/1/random.php"
    );

    const meal = result.data.meals[0];

    if (!meal) {
      return res.render("index.ejs", {
        recipe: null,
        message: "Recipe not found",
      });
    }

    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push(`${measure} ${ingredient}`);
      }
    }

    res.render("index.ejs", {
      recipe: meal,
      ingredients: ingredients,
      message: "",
    });
  } catch (error) {
    console.error(error.message);
    res.render("index.ejs", {
      recipe: null,
      ingredients: [],
      message: "Failed to fetch a random recipe. Please try again.",
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
