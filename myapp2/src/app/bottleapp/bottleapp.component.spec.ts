import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BottleappComponent } from './bottleapp.component';

describe('BottleappComponent', () => {
  let component: BottleappComponent;
  let fixture: ComponentFixture<BottleappComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BottleappComponent ],
      imports: [FormsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BottleappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
