import {Ingredient} from "./ingredient.class";

export class Recipe
{
    ingredients : Array<Ingredient> = [];
    instructions : Array<string> = [];
    estimatedTime : number;//in minutes
    name : string;

    constructor(ingredients : Array<Ingredient>, instructions : Array<string>,
    estimatedTime : number = 0, name : string = "")
    {
        this.ingredients = ingredients;
        this.instructions = instructions;
        if(estimatedTime > 0)
        {
            this.estimatedTime = estimatedTime;
        }
        else
        {
            this.estimatedTime = 0;
        }
        this.name = name;
    }

    addIngredient(ingredient : Ingredient)
    {
        this.ingredients.push(ingredient);
    }

    addInstruction(instruction : string)
    {
        this.instructions.push(instruction);
    }
}