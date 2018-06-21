import { Component } from '@angular/core';
import { RecipeManagementServerService } from './recipe-management-server.service';
import { RecipeManagementServiceService } from './recipe-management-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [{provide: RecipeManagementServiceService, useClass: RecipeManagementServerService}],
})
export class AppComponent {
  title = 'app';
  constructor(private recipeService :RecipeManagementServerService ){
  }

  ngOnInit(){
    this.recipeService.init();
  }
}
