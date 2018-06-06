import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/Forms';

import { AppComponent } from './app.component';
import { RecipeManagementComponent } from './recipe-management/recipe-management.component';
import { FridgeComponent } from './fridge/fridge.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';

import { RecipeManagementServiceService } from './recipe-management-service.service';


@NgModule({
  declarations: [
    AppComponent,
    RecipeManagementComponent,
    FridgeComponent,
    ShoppingListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [RecipeManagementServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
