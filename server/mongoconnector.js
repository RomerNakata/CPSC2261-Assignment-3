"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Mongo = require("mongodb");
const classes = require("./classes.js");
const Ingredient = classes.Ingredient;
const Fridge = classes.Fridge;
const Recipe = classes.Recipe;
const mc = Mongo.MongoClient; //Short name of mongo client

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

class MongoConnector {
    constructor(connectionString, dbName) {
        this.connectionString = connectionString;
        this.dbName = dbName;
        this.dbCollections = {};
        this.storename = "Recipes";
    }

    connect() {
        this.database = this.database || new Promise((resolve, reject) => {
            //resolve and reject are functions
            mc.connect(this.connectionString, (err, client) => {
                if (!err) {
                    console.log("Database was connected successfully");
                    console.log(client.db(this.dbName)); //creates database if it does not exist
                    resolve(client.db(this.dbName));
                }
                else {
                    reject(err);
                    console.log("Error connecting");
                }
            });
        });
        return this.database;
    }

    getCollection(collectionName) {
        //Since only want one promise per a collection
        console.log(this.dbCollections[collectionName]);
        this.dbCollections[collectionName] = this.dbCollections[collectionName] || new Promise((resolve, reject) => {
            this.connect().then((db) => {
                let collection = db.collection(collectionName); //creates collection if it does not exist                            
                console.log(collection);
                resolve(collection);
            }, (reason) => {
                console.log("Error, cannot get collection, no Database", reason);
                reject(reason);
            });
        });
        return this.dbCollections[collectionName];
    }

    getRecipeCollection() {
        return this.getCollection("recipeCollection");
    }

    getRecipeByName(recipeName) {
        return new Promise((resolve, reject) => {
            this.getRecipeCollection().then((recipeCollection) => {
                recipeCollection.find({'name': recipeName}).next().then((foundRecipe) => {
                    console.log("Recipe Found: ", foundRecipe);
                    if (foundRecipe) {
                        resolve(foundRecipe);
                    }
                    else {
                        reject("No recipe with name " +  recipeName + " found!");
                    }
                });
            }, (reason) => {
                reject(reason);
            });
        });
    }

    getRecipeList() {
        return new Promise((resolve, reject) => {
            this.getRecipeCollection().then((recipeCollection) => {
                recipeCollection.find({}).toArray(function (err, recipeList) {
                    console.log("Recipe List Found: ", recipeList);
                    if (recipeList) {
                        resolve(recipeList);
                    }
                    else {
                        reject("No recipe list found!");
                    }
                });
            }, (reason) => {
                reject(reason);
            });
        });
    }

    addRecipe(newRecipe) {
        return this.getRecipeCollection()
            .then((recipeCollection) => {
            //Step 1: Insert
            return new Promise((resolve, reject) => {
                recipeCollection.insertOne(newRecipe, null, (error, result) => {
                    if (error) {
                        reject(recipeCollection);
                        console.log(error.message);
                    }
                    else {
                        resolve(recipeCollection); //Send the recipeCollection to the next then handler
                    }
                });
            });
        }) //Chaining
            .then((recipeCollection) => {
            //Step 2: retrieve orders
            return new Promise((resolve, reject) => {
                recipeCollection.find({}).toArray(function (error, recipeList) {
                    if (error) {
                        reject(error);
                        console.log("Could not get collection data:", error);
                    }
                    else {
                        resolve(recipeList); //Resolve to the array
                    }
                });
            });
        });
    }

    reset() {
        return this.getRecipeCollection()
            .then((recipeCollection) => {
            //Step 1: Delete all recipes
            return new Promise((resolve, reject) => {
                recipeCollection.remove({}, function(error, result) {
                    if (error) {
                        reject(error);
                        console.log(error.message);
                    }
                    else {
                        resolve(recipeCollection); //Send the recipeCollection to the next then handler
                    }
                });
            });
        }) //Chaining
        .then((recipeCollection) => {
            //Step 2: Insert default recipes
            return new Promise((resolve, reject) => {
                recipeCollection.insertMany(recipeList, (docs, insertResult) => {
                    //console.log("Insert docs", docs);
                    //console.log("Insert result", insertResult);
                    if(insertResult)
                    {
                        resolve(recipeCollection);
                    }
                    else
                    {
                        console.log("Failed to reset recipes");
                    }
                });
            });
        })
        .then((recipeCollection) => {
            //Step 3: retrieve recipes
            return new Promise((resolve, reject) => {
                recipeCollection.find({}).toArray(function (error, recipeList) {
                    if (error) {
                        reject(error);
                        console.log("Could not get collection data:", error);
                    }
                    else {
                        console.log("Successfully reset the recipe list");
                        resolve(recipeList); //Resolve to the array
                    }
                });
            });
        });
    }

    deleteRecipeByName(recipeName) {
        return this.getRecipeCollection()
            .then((recipeCollection) => {
            //Step 1: Delete
            return new Promise((resolve, reject) => {
                recipeCollection.deleteOne({'name': recipeName}, function(error, result) {
                    if (error) {
                        reject(error);
                        console.log(error.message);
                    }
                    else {
                        resolve(recipeCollection); //Send the recipeCollection to the next then handler
                    }
                });
            });
        }) //Chaining
            .then((recipeCollection) => {
            //Step 2: retrieve recipe list
            return new Promise((resolve, reject) => {
                recipeCollection.find({}).toArray((error, result) => {
                    if (error) {
                        reject(error);
                        console.log("Could not get collection data:", error);
                    }
                    else {
                        console.log("successfully deleted a recipe and retrieved the recipe list");
                        console.log(result);
                        resolve(result); //Resolve to the array
                    }
                });
            })
        });
    }

    init() {
        return this.getRecipeCollection().then((recipeCollection) => {
            return this.getRecipeList().catch((reason) => {
                console.log("reason for getRecipeList failure:", reason);
                console.log("inserting stuff.............");
                console.log(recipeList);
                recipeCollection.insertMany(recipeList, (docs, insertResult) => {
                    console.log("Recipe list not found", docs);
                    console.log("Insert docs", docs);
                    console.log("Insert result", insertResult);
                    return insertResult;
                });
            });
        });
    }
}
exports.MongoConnector = MongoConnector;
