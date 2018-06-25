const Server = require("./server.js");
const Ingredient = Server.Ingredient;
const Recipe = Server.Recipe;
const Fridge = Server.Fridge;

console.log("I am running");
describe("Recipe system testing", function(){
    
    it("testing created ingredients", function() {
        //Testing ingredients
        let carrots = new Ingredient("carrots", 5);
        let potatoes = new Ingredient("potatoes", 2);
        let oranges = new Ingredient("oranges", 0);
        let blueberries = new Ingredient("blueberries", -8);
        let strawberries = new Ingredient("strawberries");
        let lettuce = new Ingredient("lettuce", 3);

        expect(carrots.name).toBe("carrots");
        expect(carrots.quantity).toBe(5);

        expect(potatoes.name).toBe("potatoes");
        expect(potatoes.quantity).toBe(2);

        expect(oranges.name).toBe("oranges");
        expect(oranges.quantity).toBe(0);

        expect(blueberries.name).toBe("blueberries");
        expect(blueberries.quantity).toBe(0);

        expect(strawberries.name).toBe("strawberries");
        expect(strawberries.quantity).toBe(0);

        expect(lettuce.name).toBe("lettuce");
        expect(lettuce.quantity).toBe(3);
    });

    it("testing add function for Ingredient", function(){

        //Now we will test adding and subtracting ingredients
        let potatoes2 = new Ingredient("potatoes", 7);
        let oranges2 = new Ingredient("oranges", 3);
        let potatoes = new Ingredient("potatoes", 2);
        let oranges = new Ingredient("oranges", 0);
        let lettuce = new Ingredient("lettuce", 3);

        //adding 2 + 7
        potatoes.add(potatoes2);
        expect(potatoes.quantity).toBe(9);

        //adding 0 + 3
        oranges.add(oranges2);
        expect(oranges.quantity).toBe(3);

        //add two different ingredients (quantity should still be 3)
        oranges2.add(lettuce);
        expect(oranges2.quantity).toBe(3);
    });

    it("testing subtract function for Ingredient", function(){

        let strawberries2 = new Ingredient("strawberries", 30);
        let strawberries3 = new Ingredient("strawberries", 10);
        let oranges2 = new Ingredient("oranges", 3);

        //30 - 10
        strawberries2.subtract(strawberries3);
        expect(strawberries2.quantity).toBe(20);

        //10 - different ingredient
        strawberries3.subtract(oranges2);
        expect(strawberries3.quantity).toBe(10);

        //10 - 20 should return 0 (can't have negative quantity)
        strawberries3.subtract(strawberries2);
        expect(strawberries3.quantity).toBe(0);
    });

    it("test recipe", function(){

        //Now we will test the recipe class
        let carrots = new Ingredient("carrots", 5);
        let potatoes = new Ingredient("potatoes", 9);
        let strawberries = new Ingredient("strawberries");
        let oranges = new Ingredient("oranges", 3);

        let ingredientsForRecipe = [
            carrots, 
            potatoes
        ];

        let instructionsForRecipe = [
            "Chop carrots",
            "Boil potatoes",
            "Add chopped carrots to boiling potatoes",
            "Add salt to taste"
        ];

        let potatoesWithCarrots = new Recipe(ingredientsForRecipe,
        instructionsForRecipe, 30);

        expect(potatoesWithCarrots.ingredients.length).toBe(2);

        //add two more ingredients
        potatoesWithCarrots.addIngredient(strawberries);
        potatoesWithCarrots.addIngredient(oranges);

        expect(potatoesWithCarrots.ingredients.length).toBe(4);

        //checking instructions
        expect(potatoesWithCarrots.instructions.length).toBe(4);

        potatoesWithCarrots.addInstruction("Eat the whole thing");
        expect(potatoesWithCarrots.instructions.length).toBe(5);
        expect(potatoesWithCarrots.instructions.
        indexOf("Eat the whole thing") > 0).toBe(true);
    });

    //Now we will check the fridge class
    //Adding ingredients to the fridge
    it("testing add function for Fridge", function() {
        let fridge = new Fridge();
        let carrots = new Ingredient("carrots", 5);
        let oranges = new Ingredient("oranges", 3);
        let lettuce = new Ingredient("lettuce", 3);
        fridge.add(carrots);
        fridge.add(oranges);
        fridge.add(lettuce);

        expect(fridge.contents.length).toBe(3);

        //check if the quantity of lettuce is 3
        for(let i = 0; i < fridge.contents.length; i++)
        {
            if(fridge.contents[i].name == "lettuce")
            {
                expect(fridge.contents[i].quantity).toBe(3);
            }
        }

        //Now we will add an ingredient that's already in the fridge
        fridge.add(lettuce);

        //number of ingredients should still be the same
        expect(fridge.contents.length).toBe(3);

        //Quantity of lettuce should now be 6
        for(let i = 0; i < fridge.contents.length; i++)
        {
            if(fridge.contents[i].name == "lettuce")
            {
                expect(fridge.contents[i].quantity).toBe(6);
            }
        }

    });

    it("testing remove function for Fridge", function(){
        let fridge = new Fridge();
        let carrots = new Ingredient("carrots", 5);
        let oranges = new Ingredient("oranges", 3);
        let lettuce = new Ingredient("lettuce", 6);
        fridge.add(carrots);
        fridge.add(oranges);
        fridge.add(lettuce);
        //Before removing anything, we will check that there are still
        //3 ingredients in the fridge
        expect(fridge.contents.length).toBe(3);

        //Now we will try to remove an ignredient which is not in the fridge
        fridge.remove("pineapples", 3);

        //Should still be 3
        expect(fridge.contents.length).toBe(3);

        //Let's remove an ingredient which is in the fridge reducing its quantity by 1
        //Quantity of lettuce will be 6 - 1 = 5
        fridge.remove("lettuce", 1);
        for(let i = 0; i < fridge.contents.length; i++)
        {
            if(fridge.contents[i].name == "lettuce")
            {
                expect(fridge.contents[i].quantity).toBe(5);
            }
        }

        //Now we will remove lettuce reducing its quantity to 0
        //and removing it from the fridge
        fridge.remove("lettuce", 5);

        //Should still be 3
        expect(fridge.contents.length).toBe(2);
        for(let i = 0; i < fridge.contents.length; i++)
        {
            expect(fridge.contents[i].name).not.toBe("lettuce");
        }
    });

    it("testing check recipe function for Fridge", function(){

        let fridge2 = new Fridge();

        let carrots = new Ingredient("carrots", 5);
        let potatoes = new Ingredient("potatoes", 9);
        let strawberries = new Ingredient("strawberries");
        let oranges = new Ingredient("oranges", 3);
        let lettuce = new Ingredient("lettuce", 6);

        let ingredientsForRecipe = [
            carrots, 
            potatoes,
            strawberries,
            oranges
        ];

        let instructionsForRecipe = [
            "Chop carrots",
            "Boil potatoes",
            "Add chopped carrots to boiling potatoes",
            "Add salt to taste",
            "Eat the whole thing"
        ];

        let potatoesWithCarrots = new Recipe(ingredientsForRecipe,
        instructionsForRecipe, 30);

        //If fridge is empty, everything from the recipe
        //should appear on the shopping list, and the list of
        //available ingredients should be empty
        let firstCase = fridge2.checkRecipe(potatoesWithCarrots);
        //console.log(firstCase);
        expect(firstCase[0].length).toBe(0);
        expect(firstCase[1].length).toEqual(potatoesWithCarrots.ingredients.length);
        expect(firstCase[1]).toEqual(potatoesWithCarrots.ingredients);

        //Now we will add the required number of carrots to the fridge
        fridge2.add(carrots);
        //Now we list of available items should include carrots, and
        //they should disappear from the shopping list
        let secondCase = fridge2.checkRecipe(potatoesWithCarrots);
        //console.log(secondCase);
        expect(secondCase[0].length).toBe(1);
        expect(secondCase[1].length).toBe(potatoesWithCarrots.ingredients.length - 1);

        //Add another ingredient to the fridge which is not on the recipe
        //It should be ignored in terms of the recipe
        fridge2.add(lettuce);
        let thirdCase = fridge2.checkRecipe(potatoesWithCarrots);
        //console.log(secondCase);
        expect(thirdCase[0].length).toBe(1);
        expect(thirdCase[1].length).toBe(potatoesWithCarrots.ingredients.length - 1);

        //Now we will add an ingredient which is on the recipe
        //in insufficient quantity (should appear on both lists)
        let potatoes5 = new Ingredient("potatoes", 5);

        fridge2.add(potatoes5);
        let fourthCase = fridge2.checkRecipe(potatoesWithCarrots);
        //console.log(fourthCase);

        //there should be 5 potatoes in available list
        let potatoesInFridgeRightAmount = false;
        for(let i = 0; i < fourthCase[0].length; i++)
        {
            if(fourthCase[0][i].name == "potatoes" &&
            fourthCase[0][i].quantity == 5)
            {
                potatoesInFridgeRightAmount = true;
            }
        }
        expect(potatoesInFridgeRightAmount).toBe(true);
        //There should be 4 potatoes on the shopping list now
        let potatoesToBuyRightAmount = false;
        for(let i = 0; i < fourthCase[1].length; i++)
        {
            if(fourthCase[1][i].name == "potatoes" &&
            fourthCase[1][i].quantity == 4)
            {
                potatoesToBuyRightAmount = true;
            }
        }
        expect(potatoesToBuyRightAmount).toBe(true);

        //Add all remaining ingredients in sufficient quantity
        //so that the list of available ingredients contains everything
        //from the recipe, and the shopping list is empty
        fridge2.add(potatoes5);
        fridge2.add(strawberries);
        fridge2.add(oranges);
        let fifthCase = fridge2.checkRecipe(potatoesWithCarrots);
        //console.log(fifthCase);
        expect(fifthCase[0].length).toEqual(potatoesWithCarrots.ingredients.length);
        expect(fifthCase[1].length).toBe(0);

    });
});