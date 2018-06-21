import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe/recipe.class';
import { Ingredient } from '../recipe/ingredient.class';
import { RecipeManagementServiceService } from '../recipe-management-service.service';
import { RecipeManagementServerService } from '../recipe-management-server.service';

@Component({
  selector: 'app-recipe-management',
  templateUrl: './recipe-management.component.html',
  styleUrls: ['./recipe-management.component.css']
})
export class RecipeManagementComponent implements OnInit {

  newRecipeName = "";
  newRecipeIngredientsList = "";
  newRecipeInstructionsList = "";
  newRecipeEstimatedTime = 0;
  errorMessage = "";
  showNewRecipe = false;

  constructor(private recipeManagement : RecipeManagementServerService) { }

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
      this.recipeManagement.addRecipe(tempNewRecipe);
    }
    else
    {
      if(this.recipeManagement.selectedRecipe != null && this.recipeManagement.selectionMade)
      {
        let indexToUpdate = -1;
        for(let i = 0; i < this.recipeManagement.recipeList.length; i++)
        {
          if(JSON.stringify(this.recipeManagement.recipeList[i]).toLowerCase() === 
            JSON.stringify(this.recipeManagement.selectedRecipe).toLowerCase())
          {
            indexToUpdate = i;
            break;
          }
        }
        this.recipeManagement.editRecipe(indexToUpdate, tempNewRecipe);
        this.recipeManagement.selectionMade = false;      
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
    if(this.recipeManagement.selectedRecipe != null && this.recipeManagement.selectionMade)
    {
      let indexToDelete = this.recipeManagement.recipeList.indexOf(this.recipeManagement.selectedRecipe);
      this.recipeManagement.deleteRecipe(this.recipeManagement.selectedRecipe.name);
      this.recipeManagement.selectionMade = false;
    }
  }

  transferDataToForm()
  {
    if(this.recipeManagement.selectedRecipe != null && this.recipeManagement.selectionMade)
    {
      this.showNewRecipe = true;
      this.newRecipeName = this.recipeManagement.selectedRecipe.name;
      this.newRecipeIngredientsList = "";
      this.newRecipeInstructionsList = "";
      this.newRecipeEstimatedTime = this.recipeManagement.selectedRecipe.estimatedTime;

      //concatenate the array of instructions into a string
      for(let instruction of this.recipeManagement.selectedRecipe.instructions)
      {
        this.newRecipeInstructionsList += instruction + "; ";
      }
      this.newRecipeInstructionsList = this.newRecipeInstructionsList.trim();
      this.newRecipeInstructionsList = this.newRecipeInstructionsList.slice(0, -1);
      
      //concatenate the array of ingredients into a string
      for(let ingredient of this.recipeManagement.selectedRecipe.ingredients)
      {
        this.newRecipeIngredientsList += ingredient.quantity + " " + ingredient.name + ", ";
      }
      this.newRecipeIngredientsList = this.newRecipeIngredientsList.trim();
      this.newRecipeIngredientsList = this.newRecipeIngredientsList.slice(0, -1);
    }
  }
}
