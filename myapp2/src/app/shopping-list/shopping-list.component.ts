import { Component, OnInit } from '@angular/core';
import { RecipeManagementServiceService } from '../recipe-management-service.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {

  selectedRecipeName: string = "";
  displayShoppingList: boolean = false;
  constructor(private recipeManagement : RecipeManagementServiceService) { }

  ngOnInit() {
  }

  showShoppingList()
  {
    if(this.recipeManagement.selectedRecipe)
    {
      this.selectedRecipeName = this.recipeManagement.selectedRecipe.name;
      this.recipeManagement.checkRecipe();
      this.displayShoppingList = true;
    }
  }

}
