import GameObject from './gameobject'

export default class Particle extends GameObject {
    constructor(x, y,size, charge, mass, velocity, bullet) {
        super(x,y,velocity,mass);
        this.charge = charge;
        this.size = size;
        if(bullet) {
            this.count = 200;
        }else {
            this.count = "nope";
        }
    }
    draw(){
        console.log("draw");
    }

    switchCharge(){
        this.charge = this.charge*-1;
    }
} 