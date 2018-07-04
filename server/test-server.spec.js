let request = require("request");
describe("Recipe server testing", () => {
    it("testing recipelist endpoint", (done) => {
        request.get("http://localhost:8000/reset", (error, response, body) => {
            request.get("http://localhost:8000/recipelist", (error, response, body) => {
                console.log("Stuff in here will likely happen after, the console.log outside the function");
                expect(error).toBe(null);

                let recipeList = JSON.parse(body);
                console.log(recipeList);

                expect(recipeList.length).toBe(2);

                expect(recipeList[0].name).toBe("Disgusting Dish");
                expect(recipeList[0].estimatedTime).toBe(40);
                expect(recipeList[0].ingredients.length).toBe(5);
                expect(recipeList[0].ingredients).toContain({name: "oranges", quantity: 10});
                expect(recipeList[0].ingredients).toContain({name: "apples", quantity: 20});
                expect(recipeList[0].ingredients).toContain({name: "lemons", quantity: 10});
                expect(recipeList[0].ingredients).toContain({name: "basil", quantity: 60});
                expect(recipeList[0].ingredients).toContain({name: "eggs", quantity: 30});
                expect(recipeList[0].instructions.length).toBe(3);
                expect(recipeList[0].instructions).toContain("move left");
                expect(recipeList[0].instructions).toContain("move right");
                expect(recipeList[0].instructions).toContain("bend over");

                expect(recipeList[1].name).toBe("Potatoes With Olives");
                expect(recipeList[1].estimatedTime).toBe(80);
                expect(recipeList[1].ingredients.length).toBe(3);
                expect(recipeList[1].ingredients).toContain({name: "olives", quantity: 40});
                expect(recipeList[1].ingredients).toContain({name: "potatoes", quantity: 10});
                expect(recipeList[1].ingredients).toContain({name: "lemons", quantity: 10});
                expect(recipeList[1].instructions.length).toBe(3);
                expect(recipeList[1].instructions).toContain("skin 'em");
                expect(recipeList[1].instructions).toContain("boil 'em");
                expect(recipeList[1].instructions).toContain("eat 'em");

                done();
            });
            console.log("Now testing recipelist endpoint.");
        });
    });

    it("testing retrieverecipe/:name endpoint", (done) => {
        request.get("http://localhost:8000/reset", (error, response, body) => {
            request.get("http://localhost:8000/retrieverecipe/" + "Disgusting Dish", (error, response, body) => {
                expect(error).toBe(null);

                let recipe = JSON.parse(body);
                console.log(recipe);

                expect(recipe.name).toBe("Disgusting Dish");
                expect(recipe.estimatedTime).toBe(40);
                expect(recipe.ingredients.length).toBe(5);
                expect(recipe.ingredients).toContain({name: "oranges", quantity: 10});
                expect(recipe.ingredients).toContain({name: "apples", quantity: 20});
                expect(recipe.ingredients).toContain({name: "lemons", quantity: 10});
                expect(recipe.ingredients).toContain({name: "basil", quantity: 60});
                expect(recipe.ingredients).toContain({name: "eggs", quantity: 30});
                expect(recipe.instructions.length).toBe(3);
                expect(recipe.instructions).toContain("move left");
                expect(recipe.instructions).toContain("move right");
                expect(recipe.instructions).toContain("bend over");

                done();
            });
            request.get("http://localhost:8000/retrieverecipe/" + "Potatoes With Olives", (error, response, body) => {
                expect(error).toBe(null);

                let recipe = JSON.parse(body);
                console.log(recipe);

                expect(recipe.name).toBe("Potatoes With Olives");
                expect(recipe.estimatedTime).toBe(80);
                expect(recipe.ingredients.length).toBe(3);
                expect(recipe.ingredients).toContain({name: "olives", quantity: 40});
                expect(recipe.ingredients).toContain({name: "potatoes", quantity: 10});
                expect(recipe.ingredients).toContain({name: "lemons", quantity: 10});
                expect(recipe.instructions.length).toBe(3);
                expect(recipe.instructions).toContain("skin 'em");
                expect(recipe.instructions).toContain("boil 'em");
                expect(recipe.instructions).toContain("eat 'em");

                done();
            });
            //Trying to get a recipe that doesn't exist
            request.get("http://localhost:8000/retrieverecipe/" + "Mashed Vanilla", (error, response, body) => {
                expect(error).toBe(null);

                let recipe = body;
                console.log(recipe);
                expect(recipe).toBe("");

                done();
            });
            console.log("Now testing retrieverecipe/:name endpoint.");
        });
    });

    it("Testing addrecipe endpoint", (done) => {
        request.get("http://localhost:8000/reset", (error, response, body) => {
            let newRecipe = {  
                name : "Brand New Recipe",
                estimatedTime : 30,
                ingredients : [{name: "paprika", quantity: 300}, {name: "dates", quantity: 20}, 
                    {name: "pork", quantity: 500}],
                instructions: ["prepare pork", "prepare paprika", "prepare dates"]
            }; 
            let options = {
                uri: "http://localhost:8000/addrecipe",
                method: "POST",
                json: newRecipe
            }
            request.post(options, (error, response, body) => {
                if(response.body[0] == true)
                {
                    console.log("added a new recipe");
                    let newRecipeList = response.body[1];
                    expect(newRecipeList.length).toBe(3);
                    expect(newRecipeList).toContain(jasmine.objectContaining(newRecipe));
                }
                else
                {
                    console.log("Didn't add a new recipe");
                    expect(response.body[1]).toBe("Failed because of the random number");
                }

                done(); //need to call done at the end of a test, if there are callbacks.
            });
            console.log("Now testing addrecipe endpoint.");
        });
    });

    it("Testing deleterecipe/:name endpoint", (done) => {
        request.get("http://localhost:8000/reset", (error, response, body) => {
            request.get("http://localhost:8000/deleterecipe/" + "Disgusting Dish", (error, response, body) => {
                expect(error).toBe(null);
                deleteRecipeRes = JSON.parse(body);
                expect(deleteRecipeRes[0]).toBe(true);
                console.log("after deleting a recipe");
                console.log(body);
                done();
            });
            //Trying to delete a recipe that isn't on the recipe list
            request.get("http://localhost:8000/deleterecipe/" + "Mashed Vanilla", (error, response, body) => {
                expect(error).toBe(null);
                deleteRecipeRes = JSON.parse(body);
                expect(deleteRecipeRes[0]).toBe(false);
                let recipeList = deleteRecipeRes[1];
                done();
            });
            request.get("http://localhost:8000/deleterecipe/" + "Potatoes With Olives", (error, response, body) => {
                expect(error).toBe(null);
                deleteRecipeRes = JSON.parse(body);
                expect(deleteRecipeRes[0]).toBe(true);
                let recipeList = deleteRecipeRes[1];
                done();
            });
            console.log("Now testing deleterecipe endpoint.");
        });
    });
});