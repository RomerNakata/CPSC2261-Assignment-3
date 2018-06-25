import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RecipeManagementComponent } from './recipe-management.component';

describe('RecipeManagementComponent', () => {
  let component: RecipeManagementComponent;
  let fixture: ComponentFixture<RecipeManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecipeManagementComponent ],
      imports: [FormsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //Check if show/hide button works
  it('show/hide form', () => {
    //First check if the form is hidden to begin with
    let recipeContainer = fixture.debugElement.nativeElement.querySelector('#new-recipe-container');
    //let recipeContainer = document.getElementById('new-recipe-container');
    expect(recipeContainer.className).toBe('hide');

    //click the show button - should show the form
    let showHideButton = fixture.debugElement.nativeElement.querySelector('#show-hide-form');

    showHideButton.click();

    fixture.detectChanges();
    //The form should now be visible (.hide class should be gone)
    expect(recipeContainer.className).toBe('');

    //Let's try to toggle it back
    showHideButton.click();
    fixture.detectChanges();

    //It should be hidden again
    expect(recipeContainer.className).toBe('hide');
  });

  //Check the Fill In Form button
  it('checking if fill in form button works', () => {
    //First check if the form is hidden to begin with
    let recipeContainer = fixture.debugElement.nativeElement.querySelector('#new-recipe-container');
    //let recipeContainer = document.getElementById('new-recipe-container');
    expect(recipeContainer.className).toBe('hide');

    //check that no recipes are selected
    let radioButtons = fixture.debugElement.nativeElement.querySelectorAll('input[type="radio"]');

    for(let button of radioButtons)
    {
      expect(button.checked).toBe(false);
    }

    //Let's try clicking on the fill in form button.
    //Since no recipes are selected, the form shouldn't appear.
    let fillFormButton = fixture.debugElement.nativeElement.querySelector('#fill-form');
    fillFormButton.click();
    fixture.detectChanges();

    expect(recipeContainer.className).toBe('hide');

    //Now we'll click on the first radio buttons
    radioButtons[0].click();
    fixture.detectChanges();
    expect(radioButtons[0].checked).toBe(true);
    expect(radioButtons[1].checked).toBe(false);

    //Now if we click the fillForm button, the form should appear
    fillFormButton.click();
    fixture.detectChanges();

    expect(recipeContainer.className).toBe('');

    //Now let's see if the input fields got populated properly
    //with the data from the seleted recipe
    //First we'll the che recipe name
    expect(component.recipeList[0].name).toEqual(component.newRecipeName);

    //Next we'll check if ingredient list matches and is correctly formatted
    let ingredientString = "";
    for(let ingredient of component.recipeList[0].ingredients)
    {
      ingredientString += ingredient.quantity + " " + ingredient.name + ", ";
    }
    ingredientString = ingredientString.trim();
    ingredientString = ingredientString.slice(0, -1);

    expect(ingredientString).toEqual(component.newRecipeIngredientsList);

    //Next up is instructions list
    let instructionsString = "";
    for(let instruction of component.recipeList[0].instructions)
    {
      instructionsString += instruction + "; ";
    }
    instructionsString = instructionsString.trim();
    instructionsString = instructionsString.slice(0, -1);

    expect(instructionsString).toEqual(component.newRecipeInstructionsList);

    //Now check if estimated time is correct
    expect(component.recipeList[0].estimatedTime).toEqual(component.newRecipeEstimatedTime);

    //Now let's pick a different recipe and repeat the process
    //Click on another radio button
    radioButtons[1].click();
    fixture.detectChanges();

    expect(radioButtons[1].checked).toBe(true);
    expect(radioButtons[0].checked).toBe(false);

    fillFormButton.click();
    fixture.detectChanges();

    expect(component.recipeList[1].name).toEqual(component.newRecipeName);
    ingredientString = "";
    for(let ingredient of component.recipeList[1].ingredients)
    {
      ingredientString += ingredient.quantity + " " + ingredient.name + ", ";
    }
    ingredientString = ingredientString.trim();
    ingredientString = ingredientString.slice(0, -1);

    expect(ingredientString).toEqual(component.newRecipeIngredientsList);

    instructionsString = "";
    for(let instruction of component.recipeList[1].instructions)
    {
      instructionsString += instruction + "; ";
    }
    instructionsString = instructionsString.trim();
    instructionsString = instructionsString.slice(0, -1);

    expect(instructionsString).toEqual(component.newRecipeInstructionsList);

    expect(component.recipeList[1].estimatedTime).toEqual(component.newRecipeEstimatedTime);

    //Let's clear the form
    let clearButton = fixture.debugElement.nativeElement.querySelector('#clear');
    clearButton.click();
    fixture.detectChanges();

    expect(component.newRecipeName).toEqual("");
    expect(component.newRecipeIngredientsList).toEqual("");
    expect(component.newRecipeInstructionsList).toEqual("");
    expect(component.newRecipeEstimatedTime).toEqual(0);
  });

  //Check the delete selected recipe button
  it('deleting recipes', () => {
    //check that no recipes are selected
    let radioButtons = fixture.debugElement.nativeElement.querySelectorAll('input[type="radio"]');
    let initialRecipeListLength = component.recipeList.length;
    for(let button of radioButtons)
    {
      expect(button.checked).toBe(false);
    }

    //Let's try clicking the delete selected recipe button
    //Since no recipes are selected nothing should get deleted
    let deleteButton = fixture.debugElement.nativeElement.querySelector('#delete');
    deleteButton.click();
    fixture.detectChanges();
    let recipeListLength = component.recipeList.length;
    expect(initialRecipeListLength).toEqual(recipeListLength);

    //Now let's select the first recipe
    let firstRecipe = component.recipeList[0];
    radioButtons[0].click();
    fixture.detectChanges();
    //Click the delete button
    deleteButton.click();
    fixture.detectChanges();
    expect(component.recipeList.includes(firstRecipe)).toBe(false);

    //Let's do the same with the remaining recipe
    radioButtons = fixture.debugElement.nativeElement.querySelectorAll('input[type="radio"]');
    expect(radioButtons.length).toBe(1);
    firstRecipe = component.recipeList[0];
    radioButtons[0].click();
    fixture.detectChanges();
    //Click the delete button
    deleteButton.click();
    fixture.detectChanges();
    expect(component.recipeList.includes(firstRecipe)).toBe(false);
  });

  //Adding new recipes
  it('creating new recipes', () => {
    //console.log(component.recipeList);

    //Show the form
    let recipeContainer = fixture.debugElement.nativeElement.querySelector('#new-recipe-container');
    let showForm = fixture.debugElement.nativeElement.querySelector('#show-hide-form');
    let addButton = fixture.debugElement.nativeElement.querySelector('#add');
    let clearButton = fixture.debugElement.nativeElement.querySelector('#clear');
    showForm.click();
    fixture.detectChanges();
    expect(recipeContainer.className).toBe('');

    //Try to create a recipe
    component.newRecipeName = "Mashed Potatoes";
    component.newRecipeIngredientsList = "10 potatoes, 6 onions, " + 
    "1 cucumber, 1 2-litre milk carton";
    component.newRecipeInstructionsList = "Boil potatoes; chop onions into " + 
      "thin slices; pour milk on potatoes when boiled; mash potatoes;" + 
      "eat a cucumber while doing it";
    component.newRecipeEstimatedTime = 90;

    addButton.click();
    fixture.detectChanges();
    //Check if the newly selected recipe has what we expected
    let newRecipe = component.recipeList[2];
    expect(newRecipe.name).toEqual("Mashed Potatoes");
    expect(newRecipe.ingredients.length).toEqual(4);
    expect(newRecipe.ingredients[0].quantity).toEqual(10);
    expect(newRecipe.ingredients[0].name).toEqual("potatoes");
    expect(newRecipe.ingredients[1].quantity).toEqual(6);
    expect(newRecipe.ingredients[1].name).toEqual("onions");
    expect(newRecipe.ingredients[2].quantity).toEqual(1);
    expect(newRecipe.ingredients[2].name).toEqual("cucumber");
    expect(newRecipe.ingredients[3].quantity).toEqual(1);
    expect(newRecipe.ingredients[3].name).toEqual("2-litre milk carton");
    expect(newRecipe.instructions.length).toEqual(5);
    expect(newRecipe.instructions[0]).toEqual("Boil potatoes");
    expect(newRecipe.instructions[1]).toEqual("chop onions into thin slices");
    expect(newRecipe.instructions[2]).toEqual("pour milk on potatoes when boiled");
    expect(newRecipe.instructions[3]).toEqual("mash potatoes");
    expect(newRecipe.instructions[4]).toEqual("eat a cucumber while doing it");
    expect(newRecipe.estimatedTime).toEqual(90);
    //console.log(component.recipeList);

    //Let's try to add an empty recipe
    clearButton.click();
    fixture.detectChanges();

    addButton.click();
    fixture.detectChanges();

    expect(component.errorMessage).not.toBe("");
    expect(component.recipeList.length).toBe(3);
    //Trying to add a recipe using improper ingredient list format
    component.newRecipeIngredientsList = "1";
    addButton.click();
    fixture.detectChanges();
    expect(component.errorMessage).not.toBe("");
    expect(component.recipeList.length).toBe(3);

    component.newRecipeIngredientsList = "cucumber";
    addButton.click();
    fixture.detectChanges();
    expect(component.errorMessage).not.toBe("");
    expect(component.recipeList.length).toBe(3);

    component.newRecipeIngredientsList = "1 cucumber, 5";
    addButton.click();
    fixture.detectChanges();
    expect(component.errorMessage).not.toBe("");
    expect(component.recipeList.length).toBe(3);

    //Let's try to add a valid recipe
    component.newRecipeName = "Udon";
    component.newRecipeIngredientsList = "5 instant udon packages, " +
      "400 grams of ground pork, 1 cabbage head, 1 teaspoon of red pepper, " +
      "1 teaspoon of grated ginger, 0.33 cup of soy sauce, 0.33 cup of mirin";
    component.newRecipeInstructionsList = "chop cabbage; fry chopped cabbage; " + 
      "put udon in boiling water for 3 minutes; add cabbage to udon; " + 
      "fry pork on high heat; add pork to udon; add soy sauce and mirin";
    component.newRecipeEstimatedTime = 40;

    addButton.click();
    fixture.detectChanges();

    expect(component.errorMessage).toBe("");
    //console.log(component.recipeList);
    newRecipe = component.recipeList[3];
    expect(newRecipe.name).toEqual("Udon");
    expect(newRecipe.ingredients.length).toEqual(7);
    expect(newRecipe.ingredients[0].quantity).toEqual(5);
    expect(newRecipe.ingredients[0].name).toEqual("instant udon packages");
    expect(newRecipe.ingredients[1].quantity).toEqual(400);
    expect(newRecipe.ingredients[1].name).toEqual("grams of ground pork");
    expect(newRecipe.ingredients[2].quantity).toEqual(1);
    expect(newRecipe.ingredients[2].name).toEqual("cabbage head");
    expect(newRecipe.ingredients[3].quantity).toEqual(1);
    expect(newRecipe.ingredients[3].name).toEqual("teaspoon of red pepper");
    expect(newRecipe.ingredients[4].quantity).toEqual(1);
    expect(newRecipe.ingredients[4].name).toEqual("teaspoon of grated ginger");
    expect(newRecipe.ingredients[5].quantity).toEqual(0.33);
    expect(newRecipe.ingredients[5].name).toEqual("cup of soy sauce");
    expect(newRecipe.ingredients[6].quantity).toEqual(0.33);
    expect(newRecipe.ingredients[6].name).toEqual("cup of mirin");
    expect(newRecipe.instructions.length).toEqual(7);
    expect(newRecipe.instructions[0]).toEqual("chop cabbage");
    expect(newRecipe.instructions[1]).toEqual("fry chopped cabbage");
    expect(newRecipe.instructions[2]).toEqual("put udon in boiling water for 3 minutes");
    expect(newRecipe.instructions[3]).toEqual("add cabbage to udon");
    expect(newRecipe.instructions[4]).toEqual("fry pork on high heat");
    expect(newRecipe.instructions[5]).toEqual("add pork to udon");
    expect(newRecipe.instructions[6]).toEqual("add soy sauce and mirin");
    expect(newRecipe.estimatedTime).toEqual(40);
  });

  //Check update selected recipe button
  it('updating recipes', () => {
    //Make sure no recipes are selected
    let radioButtons = fixture.debugElement.nativeElement.querySelectorAll('input[type="radio"]');
    let showForm = fixture.debugElement.nativeElement.querySelector('#show-hide-form');
    let updateButton = fixture.debugElement.nativeElement.querySelector('#update');
    let initialRecipeListLength = component.recipeList.length;
    showForm.click();
    fixture.detectChanges();

    let initialRecipe1 = component.recipeList[0];
    let initialRecipe2 = component.recipeList[1];
    for(let button of radioButtons)
    {
      expect(button.checked).toBe(false);
    }

    component.newRecipeName = "random Dish";
    component.newRecipeIngredientsList = "5 random items";
    component.newRecipeInstructionsList = "do whatever you like";
    component.newRecipeEstimatedTime = 99;

    //Now let's click on update button, nothing should happen
    updateButton.click();
    fixture.detectChanges();

    expect(initialRecipe1).toBe(component.recipeList[0]);
    expect(initialRecipe2).toBe(component.recipeList[1]);
    expect(initialRecipeListLength).toBe(component.recipeList.length);

    //Now let's select the second recipe and try to update it
    radioButtons[1].click();
    fixture.detectChanges();
    updateButton.click();
    fixture.detectChanges();

    expect(initialRecipeListLength).toBe(component.recipeList.length);
    expect(initialRecipe1).toBe(component.recipeList[0]);
    expect(initialRecipe2).not.toBe(component.recipeList[1]);
    expect(component.recipeList[1].name).toBe("random Dish");
    expect(component.recipeList[1].ingredients.length).toBe(1);
    expect(component.recipeList[1].ingredients[0].quantity).toBe(5);
    expect(component.recipeList[1].ingredients[0].name).toBe("random items");
    expect(component.recipeList[1].instructions.length).toBe(1);
    expect(component.recipeList[1].instructions[0]).toBe("do whatever you like");
    expect(component.recipeList[1].estimatedTime).toBe(99);

    component.newRecipeName = "Watermelon Heaven";
    component.newRecipeIngredientsList = "1 watermelon, 1 melon";
    component.newRecipeInstructionsList = "slice the watermelon; " + 
      "dice the melon; mix in a bowl; serve";
    component.newRecipeEstimatedTime = 20;

    //Now let's select the first recipe and try to update it
    radioButtons[0].click();
    fixture.detectChanges();
    updateButton.click();
    fixture.detectChanges();

    expect(initialRecipeListLength).toBe(component.recipeList.length);
    expect(initialRecipe1).not.toBe(component.recipeList[0]);
    expect(initialRecipe2).not.toBe(component.recipeList[1]);
    expect(component.recipeList[0].name).toBe("Watermelon Heaven");
    expect(component.recipeList[0].ingredients.length).toBe(2);
    expect(component.recipeList[0].ingredients[0].quantity).toBe(1);
    expect(component.recipeList[0].ingredients[0].name).toBe("watermelon");
    expect(component.recipeList[0].ingredients[1].quantity).toBe(1);
    expect(component.recipeList[0].ingredients[1].name).toBe("melon");
    expect(component.recipeList[0].instructions.length).toBe(4);
    expect(component.recipeList[0].instructions[0]).toBe("slice the watermelon");
    expect(component.recipeList[0].instructions[1]).toBe("dice the melon");
    expect(component.recipeList[0].instructions[2]).toBe("mix in a bowl");
    expect(component.recipeList[0].instructions[3]).toBe("serve");
    expect(component.recipeList[0].estimatedTime).toBe(20);

    radioButtons = fixture.debugElement.nativeElement.querySelectorAll('input[type="radio"]');
    for(let button of radioButtons)
    {
      expect(button.checked).toBe(false);
    }
  });

  //Adding, editing and removing recipes
  it('adding, editing and removing recipes', () => {
    let showForm = fixture.debugElement.nativeElement.querySelector('#show-hide-form');
    let addButton = fixture.debugElement.nativeElement.querySelector('#add');
    let clearButton = fixture.debugElement.nativeElement.querySelector('#clear');
    let deleteButton = fixture.debugElement.nativeElement.querySelector('#delete');
    let updateButton = fixture.debugElement.nativeElement.querySelector('#update');
    let initialRecipesLength = component.recipeList.length;

    showForm.click();
    fixture.detectChanges();

    //First let's try to add a recipe
    component.newRecipeName = "Tomato Cucumber Salad";
    component.newRecipeIngredientsList = "1 cucumber, 1 tomato";
    component.newRecipeInstructionsList = "chop up the tomato; " + 
      "chop up the cucumber; mix in a bowl";
    component.newRecipeEstimatedTime = -5;

    addButton.click();
    fixture.detectChanges();

    //console.log(component.recipeList);
    expect(component.recipeList.length).toBe(initialRecipesLength + 1);

    expect(component.recipeList[2].name).toBe("Tomato Cucumber Salad");
    expect(component.recipeList[2].ingredients.length).toBe(2);
    expect(component.recipeList[2].ingredients[0].quantity).toBe(1);
    expect(component.recipeList[2].ingredients[0].name).toBe("cucumber");
    expect(component.recipeList[2].ingredients[1].quantity).toBe(1);
    expect(component.recipeList[2].ingredients[1].name).toBe("tomato");
    expect(component.recipeList[2].instructions.length).toBe(3);
    expect(component.recipeList[2].instructions[0]).toBe("chop up the tomato");
    expect(component.recipeList[2].instructions[1]).toBe("chop up the cucumber");
    expect(component.recipeList[2].instructions[2]).toBe("mix in a bowl");
    expect(component.recipeList[2].estimatedTime).toBe(0);

    //Clear the form
    clearButton.click();
    fixture.detectChanges();

    expect(component.newRecipeName).toEqual("");
    expect(component.newRecipeIngredientsList).toEqual("");
    expect(component.newRecipeInstructionsList).toEqual("");
    expect(component.newRecipeEstimatedTime).toEqual(0);

    //Select the newly created recipe
    let radioButtons = fixture.debugElement.nativeElement.querySelectorAll('input[type="radio"]');
    expect(radioButtons.length).toBe(initialRecipesLength + 1);
    radioButtons[2].click();
    fixture.detectChanges();
    for(let i = 0; i < radioButtons.length; i++)
    {
      if(i == 2)
      {
        expect(radioButtons[i].checked).toBe(true);
      }
      else
      {
        expect(radioButtons[i].checked).toBe(false);
      }
    }

    //Let's edit the selected recipe
    component.newRecipeName = "Tomato No Cucumber Salad";
    component.newRecipeIngredientsList = "1 tomato";
    component.newRecipeInstructionsList = "chop up the tomato; " + 
      "put in a bowl";
    component.newRecipeEstimatedTime = 1;

    updateButton.click();
    fixture.detectChanges();

    expect(component.recipeList.length).toBe(initialRecipesLength + 1);
    //console.log(component.recipeList);
    
    expect(component.recipeList[2].name).toBe("Tomato No Cucumber Salad");
    expect(component.recipeList[2].ingredients.length).toBe(1);
    expect(component.recipeList[2].ingredients[0].quantity).toBe(1);
    expect(component.recipeList[2].ingredients[0].name).toBe("tomato");
    expect(component.recipeList[2].instructions.length).toBe(2);
    expect(component.recipeList[2].instructions[0]).toBe("chop up the tomato");
    expect(component.recipeList[2].instructions[1]).toBe("put in a bowl");
    expect(component.recipeList[2].estimatedTime).toBe(1);
    let editedRecipe = component.recipeList[2];
    //Let's select the newly edited
    radioButtons = fixture.debugElement.nativeElement.querySelectorAll('input[type="radio"]');
    radioButtons[2].click();
    fixture.detectChanges();
    //And delete it
    deleteButton.click();
    fixture.detectChanges();
    expect(component.recipeList.length).toBe(initialRecipesLength);
    expect(component.recipeList.includes(editedRecipe)).toBe(false);
  });
});
