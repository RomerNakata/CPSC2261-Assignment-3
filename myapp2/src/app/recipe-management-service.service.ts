import { Injectable } from '@angular/core';
import { Fridge } from "./recipe/fridge.class";
import { Ingredient } from "./recipe/ingredient.class";
import { Recipe } from "./recipe/recipe.class";

@Injectable({
  providedIn: 'root'
})
export class RecipeManagementServiceService {

  recipeList: Array<Recipe>;
  fridge: Fridge; 
  selectedRecipe = null;
  selectionMade = false;
  checkRecipeList = [];

  constructor() {
    let oranges = new Ingredient("oranges", 10);
    let cucumbers = new Ingredient("apples", 20);
    let lemons = new Ingredient("lemons", 10);
    let basil = new Ingredient("basil", 60);
    let eggs = new Ingredient("eggs", 30);
    let potatoes = new Ingredient("potatoes", 10);
    let olives = new Ingredient("olives", 40); 

    let recipe1Ingredients = [oranges, cucumbers, lemons, basil, eggs];
    let recipe2Ingredients = [olives, potatoes, lemons];
    let recipe1Instructions = ["move left", "move right", "bend over"];
    let recipe2Instructions = ["skin 'em", "boil 'em", "eat 'em"];

    let recipe1 = new Recipe(recipe1Ingredients, recipe1Instructions, 40, "Disgusting Dish");
    let recipe2 = new Recipe(recipe2Ingredients, recipe2Instructions, 80, "Potatoes With Olives");

    this.recipeList = [recipe1, recipe2];

    this.fridge = new Fridge();
    this.fridge.add(new Ingredient("potatoes", 10));
    this.fridge.add(new Ingredient("cabbage", 3));
    this.fridge.add(new Ingredient("eggs", 50));
    this.fridge.add(new Ingredient("avocados", 6));
    this.fridge.add(new Ingredient("apples", 5));
  }

  removeIngredients(ingredientsToRemove: Array<Ingredient>)
  {
    for(let ingredient of ingredientsToRemove)
    {
      this.fridge.remove(ingredient.name, ingredient.quantity);
    }
  }

  addIngredient(ingredientToAdd: Ingredient)
  {
    this.fridge.add(ingredientToAdd);
  }

  deleteRecipe(indexToDelete: number)
  {
    this.recipeList.splice(indexToDelete, 1);
  }

  addRecipe(tempNewRecipe: Recipe)
  {
    this.recipeList.push(tempNewRecipe);
  }

  editRecipe(indexToDelete: number, tempNewRecipe: Recipe)
  {
    this.recipeList.splice(indexToDelete, 1);
    this.recipeList.splice(indexToDelete, 0, tempNewRecipe);
  }

  selectRecipe(newRecipeSelection)
  {
    this.selectedRecipe = newRecipeSelection;
    this.selectionMade = true;
  }

  checkRecipe()
  {
    if(this.selectedRecipe != null)
    {
      this.checkRecipeList = this.fridge.checkRecipe(this.selectedRecipe);
    }
  }
}
