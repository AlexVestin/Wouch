import Particle from './particle'
import * as THREE from 'three'

export default class Player extends Particle {
    constructor(x,y,charge,color,manager, name="", scene=null) {
        super(x, y, 20, charge, 100, [0,0], false);
        this.name = name
        this.charge = charge
        this.manager = manager
        this.color = color
        this.up = false
        this.down = false
        this.left = false
        this.right = false
        this.score = 0
        this.max_speed = 140

        this.direction = 0
        this.joystick_down = false
        this.dir_vec = [0,0]

        this.shoot = false
        this.mass = 80
        this.speed = 850* this.mass
        this.is_player = true
        this.is_dead = false
        this.shooting_cooldown = false
        this.shooting_ticks = 0

        this.switch = false
        this.switch_cooldown = false
        this.switch_ticks = 0
        this.score = 0
        if(scene) {
            var geometry = new THREE.BoxGeometry( 1, 1, 1 );
            var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
            this.mesh = new THREE.Mesh( geometry, material );
            scene.add(this.mesh);
        }
    }

    update() {
        if (this.joystick_down) {
            this.dir_vec = [Math.cos(this.direction) * this.speed, Math.sin(this.direction) * this.speed]
            this.forces.push(this.dir_vec)
        }
    }
}
