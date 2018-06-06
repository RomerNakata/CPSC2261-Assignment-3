import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe/recipe.class';
import { Ingredient } from '../recipe/ingredient.class';
import { RecipeManagementServiceService } from '../recipe-management-service.service';

@Component({
  selector: 'app-fridge',
  templateUrl: './fridge.component.html',
  styleUrls: ['./fridge.component.css']
})
export class FridgeComponent implements OnInit {

  selectedIngredients: Array<Ingredient>;
  constructor(private recipeManagement : RecipeManagementServiceService){
  }

  ngOnInit() {
  }

  updateSelection(fridgeOptions: Element) {
    let checkboxes = fridgeOptions.querySelectorAll(".fridge-ingredient");
    this.selectedIngredients = [];

    for (let i = 0; i < checkboxes.length; i += 1) {
      if ((<HTMLInputElement>checkboxes[i]).checked) {
        this.selectedIngredients.push(this.recipeManagement.fridge.contents[i]);
      }
    }
  }

  removeFromFridge()
  {
    this.recipeManagement.removeIngredients(this.selectedIngredients);
  }

  addToFridge(fridgeOptions: Element)
  {
    let newIngredientName: HTMLInputElement = fridgeOptions.querySelector("#newFridgeIngredientName");
    let newIngredientQuantity: HTMLInputElement = fridgeOptions.querySelector("#newFridgeIngredientQuantity");
    newIngredientName.value = newIngredientName.value.trim();
    if(newIngredientName.value != "" && newIngredientQuantity.valueAsNumber > 0)
    {
      let newIngredient: Ingredient = new Ingredient(newIngredientName.value, newIngredientQuantity.valueAsNumber);
      this.recipeManagement.addIngredient(newIngredient);
    }
  }

}
