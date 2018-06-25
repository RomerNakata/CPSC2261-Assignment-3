import { TestBed, inject } from '@angular/core/testing';

import { RecipeManagementServiceService } from './recipe-management-service.service';

describe('RecipeManagementServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RecipeManagementServiceService]
    });
  });

  it('should be created', inject([RecipeManagementServiceService], (service: RecipeManagementServiceService) => {
    expect(service).toBeTruthy();
  }));
});
