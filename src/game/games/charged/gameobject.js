export default class GameObject {
    constructor(x, y, velocity, mass) {
        this.x = x;
        this.y = y;
        this.v = velocity;
        this.forces = [];
        this.mass = mass;
        this.is_player = false;
        this.max_speed = 140;
        this.lastUpdate = performance.now();
    }

    
}