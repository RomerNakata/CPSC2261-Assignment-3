export class Ingredient
{
    name : string;
    quantity : number;

    constructor(name : string, quantity : number = 0)
    {
        this.name = name;
        if(quantity < 0)
        {
            this.quantity = 0;
        }
        else
        {
            this.quantity = quantity;
        }
    }

    add(anotherIngredient : Ingredient)
    {
        if(anotherIngredient.name == this.name)
        {
            this.quantity += anotherIngredient.quantity;
        }
    }

    subtract(anotherIngredient : Ingredient)
    {
        if(anotherIngredient.name == this.name)
        {
            this.quantity -= anotherIngredient.quantity;
        }
        if(this.quantity < 0)
        {
            this.quantity = 0;
        }
    }
}