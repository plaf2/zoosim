'use strict'
class Animal {
    constructor(name) {
        this._health = 100.00;
        this._isDead = false;
        this.name = name;
    }

    get isDead() {
        return this._isDead;
    }

    set isDead(value) {
        this._isDead = value;
    }

    get health() {
        return this._health;
    }

    set health(value) {
        this._health = value;
    }


    calculateHealth(value) {
        if (!this.isDead) {
            // set health to value so long as it is less than 100 percent
            this.health = value <= 100 ? value : 100;
        }
    }

    // returns true if the animal will die
    willDie() {
        return false;
    }

    // increases health by value (a percentage)
    feed(value) {
        let percent = this.health * value;
        let health = this.health + percent;
        this.calculateHealth(health);
    }

    reduceHealth(value) {
        let percent = this.health * value;
        let health = this.health - percent;
        this.calculateHealth(health);
    }

    // once called sets the animal to be dead :(
    die() {
        this.isDead = true;
    }
}

class Elephant extends Animal {
    constructor(name){
        super(name);
        this.canWalk = true;
    }

    willDie() {
        if (this.canWalk) {
            this.canWalk = this.health < 70;
            return false;
        } else if (this.health >= 70){
            this.canWalk = true;
            return false;
        } else {
            this.canWalk = false;
            return true;
        }
    }
}

class Monkey extends Animal {
    constructor(name) {
        super(name);
    }

    willDie() {
        return this.health < 30;
    }
}

class Giraffe extends Animal {
    constructor(name) {
        super(name);
    }

    willDie() {
        return this.health < 50;
    }
}

class Zoo {
    constructor() {
        this.animals = [];
        this.hoursElapsed = 0;
        this._site;
        this._timeElapsedElement;
    }

    initZoo() {
        // initializes 5 of each animal
        for (let i = 0; i < 5; i++) {
            let n = i + 1;
            this.animals.push(new Elephant("Elephant " + n));
        }

        for (let i = 0; i < 5; i++) {
            let n = i + 1;
            this.animals.push(new Monkey("Monkey " + n));
        }

        for (let i = 0; i < 5; i++) {
            let n = i + 1;
            this.animals.push(new Giraffe("Giraffe " + n));
        }
        
        // attach to dom element
        this._site = document.getElementById("zoo");
        this.animals.forEach(animal => {
            let li = document.createElement("li");
            li.id = animal.name;
            li.innerText = animal.name + " " + animal.health + "%";
            this._site.appendChild(li);    
        });

        let feedButton = document.getElementById("feed_button");
        feedButton.addEventListener("click", () => this.feedAnimals());

        let timeElapsedButton = document.getElementById("time_button");
        timeElapsedButton.addEventListener("click", () => this.elapseHour());

        this._timeElapsedElement = document.getElementById("time_elapsed");
    }

    getLiveAnimals(){
        return this.animals.filter(animal => !animal.isDead);
    }

    feedAnimals() {
        // generate 3 random percentages from numbers 10 - 25
        let getRand = () => {
            return (Math.floor(Math.random() * 25) + 10) / 100;
        }

        let elephantRand = getRand();
        let monkeyRand = getRand();
        let giraffeRand = getRand();
        let alive = this.getLiveAnimals();

        // animal of each type increases its health by the value
        for (let animal of alive) {
            if (animal instanceof Elephant) {
                animal.feed(elephantRand);
            } else if (animal instanceof Monkey) {
                animal.feed(monkeyRand);
            } else {
                animal.feed(giraffeRand);
            }
        }
        this.updateAnimals();
    }

    elapseHour() {
        this.hoursElapsed += 1;
        // TOOD: check if this is kosher
        this._timeElapsedElement.innerText = "You have spent " + this.hoursElapsed + " hours in the zoo";
        
        // reduce each animal's health by a random percentage between 0-20;
        this.getLiveAnimals().forEach(animal => {
            let reduceBy = Math.floor(Math.random() * 21) / 100;
            animal.reduceHealth(reduceBy);
        });
        this.updateAnimals();
    }

    updateAnimals() {
        for (let animal of this.animals) {
            // update which animals have died
            if (animal.willDie()){
                animal.die();
            }

            // update ui
            let li = document.getElementById(animal.name);
            if (animal.isDead) {
                li.innerText = animal.name + " DEAD at " + animal.health + "%";
            } else {
                li.innerText = animal.name + " " + animal.health + "%";
            }
        }
    }

}

let sim = new Zoo();
sim.initZoo();

