import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe/recipe.class';
import { Ingredient } from '../recipe/ingredient.class';

@Component({
  selector: 'app-recipe-management',
  templateUrl: './recipe-management.component.html',
  styleUrls: ['./recipe-management.component.css']
})
export class RecipeManagementComponent implements OnInit {

  oranges = new Ingredient("oranges", 10);
  cucumbers = new Ingredient("apples", 20);
  lemons = new Ingredient("lemons", 10);
  basil = new Ingredient("basil", 60);
  eggs = new Ingredient("eggs", 30);
  potatoes = new Ingredient("potatoes", 10);
  olives = new Ingredient("olives", 40);

  recipe1Ingredients = [this.oranges, this.cucumbers, this.lemons, this.basil, this.eggs];
  recipe2Ingredients = [this.olives, this.potatoes, this.lemons];
  recipe1Instructions = ["move left", "move right", "bend over"];
  recipe2Instructions = ["skin 'em", "boil 'em", "eat 'em"];
  recipe1 = new Recipe(this.recipe1Ingredients, this.recipe1Instructions, 40, "Disgusting Dish");
  recipe2 = new Recipe(this.recipe2Ingredients, this.recipe2Instructions, 80, "Potatoes With Olives");
  recipeList = [this.recipe1, this.recipe2];

  newRecipeName = "";
  newRecipeIngredientsList = "";
  newRecipeInstructionsList = "";
  newRecipeEstimatedTime = 0;
  errorMessage = "";
  showNewRecipe = false;
  selectedRecipe = null;
  selectionMade = false;

  constructor() { }

  ngOnInit() {
  }

  manageRecipe(edit = false)
  {
    this.errorMessage = "";
    //parse through instructions
    let newInstructions = this.newRecipeInstructionsList.split(";");
    for(let i = 0; i < newInstructions.length; i++)
    {
      newInstructions[i] = newInstructions[i].trim();
    }
    //parse through ingredients
    let newIngredients = this.newRecipeIngredientsList.split(",");
    let parsedIngredients = [];
    let tempNewIngredients = [];
    for (let singleIngredient of newIngredients) 
    {
      let parsedIngredient = singleIngredient.split(" ");
      //Get rid of any empty values in the array
      for(let i = 0; i < parsedIngredient.length; i++)
      {
        if(parsedIngredient[i] == "")
        {
          parsedIngredient.splice(i, 1);
        }
      }
      if(parsedIngredient.length < 2) //In this case we need to concatenate
      {
        //Wrong format. Exit out.
        this.errorMessage = "Wrong format provided for an ingredient. Expected quantity and a name.";
        return;
      }
      let tempIngredientQuantity = Number(parsedIngredient[0]);
      if(isNaN(tempIngredientQuantity))
      {
        //Wrong format. Exit out.
        this.errorMessage = "Wrong format provided for an ingredient. First value should be a number.";
        return;
      }
      let tempIngredientName = "";
      if(parsedIngredient.length > 2) //Name consists of separate words
      {
        for(let i = 1; i < parsedIngredient.length; i++)
        {
          tempIngredientName += parsedIngredient[i] + " ";
        }
        tempIngredientName = tempIngredientName.trim();
      }
      else 
      {
        tempIngredientName = parsedIngredient[1];
      }

      let tempIngredient = new Ingredient(tempIngredientName, tempIngredientQuantity);
      tempNewIngredients.push(tempIngredient);
    }
    let tempNewRecipe = new Recipe(tempNewIngredients, newInstructions, 
      this.newRecipeEstimatedTime, this.newRecipeName);
    if(!edit)
    {
      this.recipeList.push(tempNewRecipe);
    }
    else
    {
      if(this.selectedRecipe != null && this.selectionMade)
      {
        let indexToDelete = this.recipeList.indexOf(this.selectedRecipe);
        this.recipeList.splice(indexToDelete, 1);
        this.recipeList.splice(indexToDelete, 0, tempNewRecipe);
        this.selectionMade = false;      
      }
    }
  }

  toggleNewRecipeForm()
  {
    if(this.showNewRecipe)
    {
      this.showNewRecipe = false;
    }
    else
    {
      this.showNewRecipe = true;
    }
  }

  clearNewRecipeForm()
  {
    this.newRecipeName = "";
    this.newRecipeIngredientsList = "";
    this.newRecipeInstructionsList = "";
    this.newRecipeEstimatedTime = 0;
    this.errorMessage = "";
  }

  deleteSelectedRecipe()
  {
    if(this.selectedRecipe != null && this.selectionMade)
    {
      let indexToDelete = this.recipeList.indexOf(this.selectedRecipe);
      this.recipeList.splice(indexToDelete, 1);
      this.selectionMade = false;
    }
  }

  selectRecipe(newRecipeSelection)
  {
    this.selectedRecipe = newRecipeSelection;
    this.selectionMade = true;
  }

  transferDataToForm()
  {
    if(this.selectedRecipe != null && this.selectionMade)
    {
      this.showNewRecipe = true;
      this.newRecipeName = this.selectedRecipe.name;
      this.newRecipeIngredientsList = "";
      this.newRecipeInstructionsList = "";
      this.newRecipeEstimatedTime = this.selectedRecipe.estimatedTime;

      //concatenate the array of instructions into a string
      for(let instruction of this.selectedRecipe.instructions)
      {
        this.newRecipeInstructionsList += instruction + "; ";
      }
      this.newRecipeInstructionsList = this.newRecipeInstructionsList.trim();
      this.newRecipeInstructionsList = this.newRecipeInstructionsList.slice(0, -1);
      
      //concatenate the array of ingredients into a string
      for(let ingredient of this.selectedRecipe.ingredients)
      {
        this.newRecipeIngredientsList += ingredient.quantity + " " + ingredient.name + ", ";
      }
      this.newRecipeIngredientsList = this.newRecipeIngredientsList.trim();
      this.newRecipeIngredientsList = this.newRecipeIngredientsList.slice(0, -1);
    }
  }
}
