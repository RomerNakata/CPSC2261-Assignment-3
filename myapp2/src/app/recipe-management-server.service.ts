import { Injectable } from '@angular/core';
import { Fridge } from "./recipe/fridge.class";
import { Ingredient } from "./recipe/ingredient.class";
import { Recipe } from "./recipe/recipe.class";
import { HttpRequest, HttpClient, HttpResponse } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeManagementServerService {

  recipeList: Array<Recipe> = [];
  fridge: Fridge; 
  selectedRecipe: Recipe = null;
  selectionMade = false;
  checkRecipeList = [];

  constructor(private http : HttpClient) {
    let oranges = new Ingredient("oranges", 10);
    let cucumbers = new Ingredient("apples", 20);
    let lemons = new Ingredient("lemons", 10);
    let basil = new Ingredient("basil", 60);
    let eggs = new Ingredient("eggs", 30);
    let potatoes = new Ingredient("potatoes", 10);
    let olives = new Ingredient("olives", 40); 

    /*let recipe1Ingredients = [oranges, cucumbers, lemons, basil, eggs];
    let recipe2Ingredients = [olives, potatoes, lemons];
    let recipe1Instructions = ["move left", "move right", "bend over"];
    let recipe2Instructions = ["skin 'em", "boil 'em", "eat 'em"];

    let recipe1 = new Recipe(recipe1Ingredients, recipe1Instructions, 40, "Disgusting Dish");
    let recipe2 = new Recipe(recipe2Ingredients, recipe2Instructions, 80, "Potatoes With Olives");

    this.recipeList = [recipe1, recipe2];
    */
    this.fridge = new Fridge();
    this.fridge.add(new Ingredient("potatoes", 10));
    this.fridge.add(new Ingredient("cabbage", 3));
    this.fridge.add(new Ingredient("eggs", 50));
    this.fridge.add(new Ingredient("avocados", 6));
    this.fridge.add(new Ingredient("apples", 5));
  }

  retrieveRecipes() : Promise<any>{

   let request = this.http
    .request(new HttpRequest("GET","http://localhost:8000/recipelist"))
    .toPromise().catch((reason)=>{
      //console.log(reason);
      return reason;
    });

    
    request.then((response: any)=>{
      //debugging code
      //console.log(response.body);
      return response;
    });
    return request;     

  }

  retrieveRecipe(name) : Promise<any>{

    let request = this.http
     .request(new HttpRequest("GET","http://localhost:8000/retrieverecipe/" + name))
     .toPromise().catch((reason)=>{
       return reason;
     });
     
     request.then((response: any)=>{
       return response;
     });
     return request;     
   }

   addRecipeServer(newRecipe: Recipe) : Promise<any>{

    let request = this.http.post("http://localhost:8000/addrecipe", newRecipe)
     .toPromise().catch((reason)=>{
       return reason;
     });
     
     request.then((response: any)=>{
       return response;
     });
     return request;     
   }

   deleteRecipeServer(name) : Promise<any>{

    let request = this.http
    .request(new HttpRequest("GET", "http://localhost:8000/deleterecipe/" + name))
     .toPromise().catch((reason)=>{
       return reason;
     });
     
     request.then((response: any)=>{
       return response;
     });
     return request;     
   }

  init(){
    this.retrieveRecipes().then((response: any)=>{
     this.recipeList = [];
     for (let recipe of response.body)
     {
       let ingredients = [];
       for(let ingredient of recipe.ingredients)
       {
        ingredients.push(new Ingredient(ingredient.name, ingredient.quantity));
       }
       this.recipeList.push(new Recipe(ingredients, recipe.instructions, 
        recipe.estimatedTime, recipe.name));
     }
     return response;
    }).catch(()=>{})
    //Quick debugging message
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

  deleteRecipe(name)
  {
    this.deleteRecipeServer(name).then((response: any)=>{
      if(response.body[0] == true)
      {
        for(let i = 0; i < this.recipeList.length; i++)
        {
          if(this.recipeList[i].name == name)
          {
            this.recipeList.splice(i, 1);
          }
        }
      }

      console.log(response.body);
     }).catch(()=>{})
     //Quick debugging message
  }

  addRecipe(newRecipe: Recipe)
  {
    this.addRecipeServer(newRecipe).then((response: any)=>{
      console.log(response);
      if(response[0] == true)
      {
        this.recipeList.push(newRecipe);
      }
      else
      {
        console.log(response[1]);
      }
      return response;
    }).catch(()=>{})
    //Quick debugging message
  }

  editRecipe(indexToDelete: number, tempNewRecipe: Recipe)
  {
    this.recipeList.splice(indexToDelete, 1);
    this.recipeList.splice(indexToDelete, 0, tempNewRecipe);
  }

  selectRecipe(newRecipeSelection)
  {
    this.retrieveRecipe(newRecipeSelection.name).then((response: any)=>{
      let recipe = response.body;

      let ingredients = [];
      for(let ingredient of recipe.ingredients)
      {
        ingredients.push(new Ingredient(ingredient.name, ingredient.quantity));
      }

      this.selectedRecipe = new Recipe(ingredients, recipe.instructions, 
        recipe.estimatedTime, recipe.name);
      this.selectionMade = true;
      return response;
    }).catch(()=>{})
    //Quick debugging message
  }

  checkRecipe()
  {
    if(this.selectedRecipe != null)
    {
      this.checkRecipeList = this.fridge.checkRecipe(this.selectedRecipe);
    }
  }
}
