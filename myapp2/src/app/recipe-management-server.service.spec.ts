import { TestBed, inject } from '@angular/core/testing';

import { RecipeManagementServerService } from './recipe-management-server.service';

describe('RecipeManagementServerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RecipeManagementServerService]
    });
  });

  it('should be created', inject([RecipeManagementServerService], (service: RecipeManagementServerService) => {
    expect(service).toBeTruthy();
  }));
});
