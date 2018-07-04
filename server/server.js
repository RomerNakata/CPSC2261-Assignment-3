"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const classes = require("./classes.js");
const Ingredient = classes.Ingredient;
const Fridge = classes.Fridge;
const Recipe = classes.Recipe;
let app = express(); //Call express factory to create an 'app'
const mongoConnector = require("./mongoconnector.js");
let database = new mongoConnector.MongoConnector("mongodb://localhost:27017", "Recipes");

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
    database.getRecipeList().then((recipeList) => {
        console.log("here's the response from the database");
        console.log(recipeList);
        res.send(recipeList);
        return true; 
    }).catch((reason) => {
        console.log(reason);
        res.status(404); 
        res.render('error', { error: reason });
        return false; 
    });

});

app.get("/reset", function (req, res) {
    database.reset().then((result) => {
        res.send(true);
    });
});

app.get("/retrieverecipe/:name", function (req, res){
    var recipe_name = res.data.name;
    res.header("Content-Type", "application/json");
    database.getRecipeByName(recipe_name).then((obtainedRecipe) => {
        console.log("here's the response from the database");
        console.log(obtainedRecipe);
        res.send(obtainedRecipe);
        return true; 
    }).catch((reason) => {
        console.log(reason);
        res.status(404); 
        res.render('error', { error: reason });
        return false;
    });
});

app.get("/deleterecipe/:name", function (req, res){
    res.header("Content-Type", "application/json");
    var recipe_name = res.data.name;
    var couldDelete = [false, null];
    database.deleteRecipeByName(recipe_name).then((newRecipeList) => {
        console.log("Deleted");
        console.log("After deleting:");
        console.log(newRecipeList);
        couldDelete = [true, newRecipeList];
        res.send(couldDelete);
    }).catch((reason) => {
        console.log(reason);
        console.log("Not deleted");
        couldDelete = [false, "Failed because of " + reason];
        res.send(couldDelete);
        return false;
    });
});

app.post("/addrecipe", function (req, res) {
    console.log("body", req.body); //should be request body
    let tempRecipe = req.body;
    let returnArray;
    //randomly decide whether we should add the recipe or not
    let random = Math.floor(Math.random() * 2);
    if(random == 1) 
    {
        res.header("Content-Type", "application/json");
        database.addRecipe(tempRecipe).then((newRecipeList) => {
            console.log("here's the response from the database");
            console.log(newRecipeList);
            console.log("added successfully");
            returnArray = [true, newRecipeList];
            res.send(returnArray);
            return true; 
        }).catch((reason) => {
            console.log(reason);
            console.log("Failed to add");
            returnArray = [false, "Failed because of " + reason];
            res.send(returnArray);
            return false; 
        });
    }
    else
    {
        console.log("Failed to add");
        returnArray = [false, "Failed because of the random number"];
        console.log(returnArray);
        res.send(returnArray);
    }
});

database.init().then((recipeList) => {
    //Start the server
    app.listen(8000, function () {
        console.log("server started:", recipeList);
    });
}).catch((reason) => {
    console.log("server not started", reason);
});

console.log("Setup script finised. Notice console.log runs before the above one.");
//# sourceMappingURL=server.js.map