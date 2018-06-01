import { Component, OnInit } from '@angular/core';
import { Bottle } from '../bottle_problem/bottle.class';
@Component({
  selector: 'bottleapp',
  templateUrl: './bottleapp.component.html',
  styleUrls: ['./bottleapp.component.css']
})
export class BottleappComponent implements OnInit {
  
  bottleName : string = "The greatest bottle in the world";
  //Example 1
  example : Array<string> = ["Bill","bob","Teddy","sarah123","1234567890111"];

  //Example 2 stuff 
  people : Array<InternalData> = [new InternalData("Terry", 5),
  new InternalData("Berry", 5),
  new InternalData("Tony", 3),
  new InternalData("Temmy", 12)];

  formBinding: InternalData = new InternalData("",0);

  //Example 3
  selectedItem : InternalData = null; //null instead of undefined
                                      //because undefined in JS causes properties
                                      //to dissapear

  example3 : Array<InternalData> = [new InternalData("Terry", 5),
  new InternalData("Berry", 5),
  new InternalData("Tony", 3),
  new InternalData("Temmy", 12)];

   
  constructor() { }

  ngOnInit() {
  }
  //Example using two-way binding
  addPerson(){

    this.people.push(new InternalData(this.formBinding.name,this.formBinding.age)); 
  }

  //Example of selecting an item
  select(person){
    this.selectedItem = person;
    
  }

}

class InternalData {
  constructor(public name : string, public age : number){}
}

