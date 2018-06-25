"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
class Ingredient {
    constructor(name, quantity = 0) {
        this.name = name;
        if (quantity < 0) {
            this.quantity = 0;
        }
        else {
            this.quantity = quantity;
        }
    }
    add(anotherIngredient) {
        if (anotherIngredient.name == this.name) {
            this.quantity += anotherIngredient.quantity;
        }
    }
    subtract(anotherIngredient) {
        if (anotherIngredient.name == this.name) {
            this.quantity -= anotherIngredient.quantity;
        }
        if (this.quantity < 0) {
            this.quantity = 0;
        }
    }
}
exports.Ingredient = Ingredient;
class Recipe {
    constructor(ingredients, instructions, estimatedTime = 0, name = "") {
        this.ingredients = [];
        this.instructions = [];
        this.ingredients = ingredients;
        this.instructions = instructions;
        if (estimatedTime > 0) {
            this.estimatedTime = estimatedTime;
        }
        else {
            this.estimatedTime = 0;
        }
        this.name = name;
    }
    addIngredient(ingredient) {
        this.ingredients.push(ingredient);
    }
    addInstruction(instruction) {
        this.instructions.push(instruction);
    }
}
exports.Recipe = Recipe;
class Fridge {
    constructor() {
        this.contents = [];
    }
    //Adds an ingredient to the contents of the fridge
    add(ingredient) {
        //Check if an ingredient with the same name already
        //exists. If it does we just add to its quantity.
        //Otherwise we add another item to the array
        let alreadyInContents = false;
        for (let i = 0; i < this.contents.length; i++) {
            if (this.contents[i].name == ingredient.name) {
                this.contents[i].quantity += ingredient.quantity;
                alreadyInContents = true;
            }
        }
        if (alreadyInContents == false) {
            this.contents.push(ingredient);
        }
    }
    //Removes a specified amount of an ingredient from the fridge
    remove(ingredientName, amount) {
        for (let i = 0; i < this.contents.length; i++) {
            if (this.contents[i].name == ingredientName) {
                this.contents[i].quantity -= amount;
                //Check if quantity of this ingredient is below zero.
                //If it is, we drop the ingredient from contents.
                if (this.contents[i].quantity <= 0) {
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
    checkRecipe(recipe) {
        let ingredientsInTheRecipe = recipe.ingredients;
        let availableIngredients = [];
        let missingIngredients = [];
        let found;
        let differenceInQuantity;
        for (let i = 0; i < ingredientsInTheRecipe.length; i++) {
            found = false;
            for (let j = 0; j < this.contents.length; j++) {
                if (ingredientsInTheRecipe[i].name == this.contents[j].name) {
                    //we found an ingredient
                    found = true;
                    //add the ingredient to the list of available ingredients
                    availableIngredients.push(this.contents[j]);
                    //Now check if the quantity is sufficient
                    differenceInQuantity = ingredientsInTheRecipe[i].quantity -
                        this.contents[j].quantity;
                    if (differenceInQuantity > 0) {
                        //There's not enough, add to shopping list
                        let newName = ingredientsInTheRecipe[i].name;
                        let newQuantity = differenceInQuantity;
                        let missingIngredient = new Ingredient(newName, newQuantity);
                        missingIngredients.push(missingIngredient);
                    }
                }
            }
            //If we didn't find the ingredient, we should add it
            //to the shopping list here
            if (found == false) {
                missingIngredients.push(ingredientsInTheRecipe[i]);
            }
        }
        //Return a 2D array. First item is the array of available ingredients,
        //the second item is the array of missing ingredients.
        return [availableIngredients, missingIngredients];
    }
}
exports.Fridge = Fridge;
let app = express(); //Call express factory to create an 'app'
//An app can be thought of a http server, 
//that you can add end-points to.
let recipeList = [];
let fridge;
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
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
app.use(bodyParser.json()); //Parse json http bodies
let store = "";
app.param('name', function (res, req, next, value) {
    req.data = req.data || {}; //Js magic, adding a data property
    req.data.name = value; //JS magx, store the store
    next(); //Allows for redirection if store doesn't exist or something.
});

app.get("/recipelist", function (req, res) {
    res.header("Content-Type", "application/json");
    res.send(recipeList);
});

app.get("/reset", function (req, res) {
    recipeList = [recipe1, recipe2];
    res.send(true);
});

app.get("/retrieverecipe/:name", function (req, res){
    var recipe_name = res.data.name;
    var found_recipe;
    console.log(recipeList);
    for(var i = 0; i < recipeList.length; i++)
    {
        console.log(recipeList[i]);
        if(recipeList[i].name == recipe_name)
        {
            found_recipe = recipeList[i];
            break;
        }
    }
    
    //console.log(found_recipe);
    res.send(found_recipe);
});

app.get("/deleterecipe/:name", function (req, res){
    res.header("Content-Type", "application/json");
    var recipe_name = res.data.name;
    var found_recipe;
    var couldDelete = [false, recipeList];
    console.log(recipeList);
    for(var i = 0; i < recipeList.length; i++)
    {
        console.log(recipeList[i]);
        if(recipeList[i].name == recipe_name)
        {
            console.log("Deleting");
            recipeList.splice(i, 1);
            couldDelete = [true, recipeList];
            break;
        }
    }
    if(couldDelete)
    {
        console.log("deleted");
    }
    else
    {
        console.log("not deleted");
    }
    res.send(couldDelete);
});

app.post("/addrecipe", function (req, res) {
    console.log("body", req.body); //should be request body
    let tempRecipe = req.body;
    let tempIngredients = [];
    let sizeBefore = recipeList.length;
    for(let i = 0; i < tempRecipe.ingredients.length; i++)
    {
        tempIngredients.push(new Ingredient(tempRecipe.ingredients[i].name, 
            tempRecipe.ingredients[i].quantity));
    }
    //randomly decide whether we should add the recipe or not
    let random = Math.floor(Math.random() * 2);
    if(random == 1) 
    {
        recipeList.push(new Recipe(tempIngredients, tempRecipe.instructions, 
            tempRecipe.estimatedTime, tempRecipe.name));
    }
    let sizeAfter = recipeList.length;
    //orderList.push(req.body);
    console.log(recipeList);
    let returnArray;
    if(sizeBefore == sizeAfter - 1)
    {
        console.log("added successfully");
        returnArray = [true, recipeList];
    }
    else
    {
        console.log("Failed to add");
        returnArray = [false, "Failed because of the random number"];
    }
    console.log(returnArray);
    res.send(returnArray);
});

//Start the server
app.listen(8000, function () {
    console.log("server started");
});

console.log("Setup script finised. Notice console.log runs before the above one.");
//# sourceMappingURL=server.js.map