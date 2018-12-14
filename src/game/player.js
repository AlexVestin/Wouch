import Particle from './particle'
import * as THREE from 'three'
import { normalise_vector, scale } from './helpers'
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
        this.speed = 850 * this.mass
        this.is_player = true
        this.is_dead = false
        this.shooting_cooldown = false
        this.shooting_ticks = 0

        this.switch = false
        this.switch_cooldown = false
        this.switch_ticks = 0
        this.score = 0

        if(scene) {
            this.scene = scene;
            var geometry = new THREE.CircleGeometry( 0.1, 6 );
            var material = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe:true } );
            material.side = THREE.DoubleSide;

            this.mesh = new THREE.Mesh( geometry, material );
            scene.add(this.mesh);
        }
    }


    create_bullet = () => {
        let v = normalise_vector(this.dir_vec);
        if (v === [0,0]) {
            if(this.v_vector === [1,1]) {
                this.v_vector = [1,1];
            }else {
                this.v_vector = normalise_vector(this.v);
            }
            v = this.v_vector;
        }
                
        let x = this.x+v[0]*this.size*4;
        let y = this.y+v[1]*this.size*4;

        let charge = this.charge / 3;
        let vec = scale(normalise_vector(this.dir_vec), 170);
        let bullet = new Particle(x, y, 10, charge, 10, vec, this, this.scene);
        this.manager.objects.push(bullet);
    }

    update() {
        if (this.joystick_down) {
            this.dir_vec = [Math.cos(this.direction) * this.speed, Math.sin(this.direction) * this.speed]
            this.forces.push(this.dir_vec)
            this.mesh.rotation.x = Math.cos(this.direction)
            this.mesh.rotation.y = Math.sin(this.direction)
        }
    }
}
