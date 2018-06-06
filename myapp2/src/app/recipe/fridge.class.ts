import {Ingredient} from "./ingredient.class";
import {Recipe} from "./recipe.class";

export class Fridge
{
    contents : Array<Ingredient> = [];

    //Adds an ingredient to the contents of the fridge
    add(ingredient : Ingredient)
    {
        //Check if an ingredient with the same name already
        //exists. If it does we just add to its quantity.
        //Otherwise we add another item to the array
        let alreadyInContents = false;
        for(let i = 0; i < this.contents.length; i++)
        {
            if(this.contents[i].name == ingredient.name)
            {
                this.contents[i].quantity += ingredient.quantity;
                alreadyInContents = true;
            }
        }
        if(alreadyInContents == false)
        {
            this.contents.push(ingredient);
        }
    }

    //Removes a specified amount of an ingredient from the fridge
    remove(ingredientName : string, amount : number)
    {
        for(let i = 0; i < this.contents.length; i++)
        {
            if(this.contents[i].name == ingredientName)
            {
                this.contents[i].quantity -= amount;
                //Check if quantity of this ingredient is below zero.
                //If it is, we drop the ingredient from contents.
                if(this.contents[i].quantity <= 0)
                {
                    this.contents.splice(i, 1);
                }
            }
        }
    }

    //Checks what ingredients are already in the fridge for the given recipe.
    //Returns two lists - one with ingredients already in the fridge,
    //and another one with missing ingredients.
    //If an ingredient is in the fridge, but the quantity is not enough,
    //it will appear on both lists.
    checkRecipe(recipe : Recipe)
    {
        let ingredientsInTheRecipe : Ingredient[] = recipe.ingredients;
        let availableIngredients : Ingredient[] = [];
        let missingIngredients : Ingredient[] = [];
        let found : boolean;
        let differenceInQuantity : number;
        for(let i = 0; i < ingredientsInTheRecipe.length; i++)
        {
            found = false
            for(let j = 0; j < this.contents.length; j++)
            {
                if(ingredientsInTheRecipe[i].name == this.contents[j].name)
                {
                    //we found an ingredient
                    found = true;
                    //add the ingredient to the list of available ingredients
                    availableIngredients.push(this.contents[j]);
                    //Now check if the quantity is sufficient
                    differenceInQuantity = ingredientsInTheRecipe[i].quantity -
                    this.contents[j].quantity;
                    if(differenceInQuantity > 0)
                    {
                        //There's not enough, add to shopping list
                        let newName : string = ingredientsInTheRecipe[i].name;
                        let newQuantity : number = differenceInQuantity;
                        let missingIngredient = new Ingredient(newName, 
                        newQuantity);
                        missingIngredients.push(missingIngredient);
                    }
                }
            }
            //If we didn't find the ingredient, we should add it
            //to the shopping list here
            if(found == false)
            {
                missingIngredients.push(ingredientsInTheRecipe[i]);
            }
        }

        //Return a 2D array. First item is the array of available ingredients,
        //the second item is the array of missing ingredients.
        return [availableIngredients, missingIngredients];
    }
}