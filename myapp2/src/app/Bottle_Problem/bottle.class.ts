export class Bottle {

    private liquidInside = 0;

    constructor(public size : number) {
        this.size = size;
    }

    public fill() {
        this.liquidInside = this.size;
    }

    public empty() {
        this.liquidInside = 0;
    }

    public getLiquidInside() {
        return this.liquidInside;
    }

    public getSize() {
        return this.size;
    }

    public setLiquidInside(liquidVolume : number) {
        this.liquidInside = liquidVolume;
    }

    //Pour from this bottle into another bottle
    public pour(anotherBottle : Bottle) {
        if(this.getLiquidInside() == 0 || anotherBottle.getLiquidInside() == anotherBottle.getSize()) {
            //Don't do anything if this bottle is empty of the other one is full
        } else {
            //Find how much volume is left in another bottle
            var leftInAnotherBottle = anotherBottle.getSize() - anotherBottle.getLiquidInside();
            var currentlyInAnotherBottle = anotherBottle.getLiquidInside();

            //If this bottle has less or more liquid than we can pour into another bottle, we pour it completely
            if(leftInAnotherBottle >= this.getLiquidInside()) {
                anotherBottle.setLiquidInside(currentlyInAnotherBottle + this.getLiquidInside());
                this.empty();
            } else {
                anotherBottle.fill();
                this.setLiquidInside(this.getLiquidInside() - leftInAnotherBottle);
            }
        }
    }
}