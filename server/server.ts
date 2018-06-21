import express = require('express');
import cors = require('cors');
import bodyParser = require('body-parser');

export class Ingredient
{
    name : string;
    quantity : number;

    constructor(name : string, quantity : number = 0)
    {
        this.name = name;
        if(quantity < 0)
        {
            this.quantity = 0;
        }
        else
        {
            this.quantity = quantity;
        }
    }

    add(anotherIngredient : Ingredient)
    {
        if(anotherIngredient.name == this.name)
        {
            this.quantity += anotherIngredient.quantity;
        }
    }

    subtract(anotherIngredient : Ingredient)
    {
        if(anotherIngredient.name == this.name)
        {
            this.quantity -= anotherIngredient.quantity;
        }
        if(this.quantity < 0)
        {
            this.quantity = 0;
        }
    }
}

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

class Fridge
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

let app = express(); //Call express factory to create an 'app'
//An app can be thought of a http server, 
//that you can add end-points to.

let recipeList: Array<Recipe> = [];
let fridge: Fridge;

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

recipeList = [recipe1, recipe2];

fridge = new Fridge();
fridge.add(new Ingredient("potatoes", 10));
fridge.add(new Ingredient("cabbage", 3));
fridge.add(new Ingredient("eggs", 50));
fridge.add(new Ingredient("avocados", 6));
fridge.add(new Ingredient("apples", 5));

//setup app 'middleware'
//we need Cors and Body parser

var corsOptions = {
    origin: '*', //Allow all origins
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));
app.use(bodyParser.json()); //Parse json http bodies
let store = "";
app.param('store', function(res,req, next, value){
  (<any> req).data = (<any> req).data || {}; //Js magic, adding a data property
  (<any>req).data.store = value;  //JS magx, store the store
  next(); //Allows for redirection if store doesn't exist or something.
});

//Add end points
app.get("/test",function(req, res){
    //Good to have a simple one just to make
    //sure things work.
    res.send('{"test": 1 }');
    //event handler for echo endpiont
});

app.get("/menu/:store",function(req,res){
    res.header("Content-Type","application/json");
    //let menu = new BbtMenu((<any>res).data.store);
     //res.json(menu);
});
app.get("/recipelist", function(req,res){
   res.header("Content-Type","application/json");
   console.log("body",req.body); //should be request body
   //recipeList.push(req.body);
   console.log(recipeList);
   res.send(recipeList);
});
//Start the server
app.listen(8000,function(){
    console.log("server started");
})
console.log("Setup script finised. Notice console.log runs before the above one.");
