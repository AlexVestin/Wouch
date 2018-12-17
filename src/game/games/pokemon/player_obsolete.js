//import Particle from './particle'
//import * as THREE from 'three'
//import { normalise_vector, scale } from './helpers'
export default class Player extends Particle {
    constructor(x,y,charge,color,manager, name="", scene=null, id = null) {
        super(x, y, 20, charge, 100, [0,0], false);

    }


    discretize = () => {
        return {
            id: this.id,
            i: this.is_player,
            n: this.name,
            m: this.mass,
            s: this.score,
            x: this.x,
            y: this.y,
            c: this.charge,
            col: this.color,
            d: this.is_dead,
            dir: this.direction,
            v: this.v,
        }
    }

    respawn = () => {
        this.x = Math.random() * 2400 - 1200;
        this.y = Math.random() * 2400 - 1200;
        this.respawnCount = 180;
        this.respawning = true;
        this.saveCharge = this.charge;
        this.charge = 0;
        this.mesh.material.color = new THREE.Color(255,0,255);
    }

    create_bullet = () => {
        if(this.shootCounter <= 0 && !this.respawning) {
            let v = normalise_vector(this.dir_vec);
            if (v === [0,0]) {
                if(this.v_vector === [1,1]) {
                    this.v_vector = [1,1];
                }else {
                    this.v_vector = normalise_vector(this.v);
                }
                v = this.v_vector;
            }
                    
            let x = this.x+v[0]*this.size*5;
            let y = this.y+v[1]*this.size*5;
    
            let charge = this.charge / 6;
            let vec = scale(normalise_vector(this.dir_vec), 255);
            let bullet = new Particle(x, y, 10, charge, 10, vec, this, this.manager);
            this.manager.objects.push(bullet);
            this.shootCounter = this.shootCD;
        }
    }

    switchCharge(){
        
        if(this.switchChargeCounter <= 0 && !this.respawning) {
            this.charge = this.charge*-1;
            if(this.charge < 0) {
                this.mesh.material.color = new THREE.Color(0, 255, 0);
            }else {
                this.mesh.material.color = new THREE.Color(255, 0, 0);
            }

            this.switchChargeCounter = this.switchCD;
        }
    }

    updateRespawn() {
        if(this.respawnCount > 0) {
            this.mesh.material.opacity = (1 + Math.sin(this.respawnCount / 10)) / 2;
        }
        if(this.respawnCount <= 0 && this.respawning) {
            this.respawning = false;
            if(this.charge < 0) {
                this.mesh.material.color = new THREE.Color(0, 255, 0);
            }else {
                this.mesh.material.color = new THREE.Color(255, 0, 0);
            }

            this.charge = this.saveCharge;
        }
        this.respawnCount -= 1;
    }

    update(hosting) {
        
       
        if (this.joystick_down) {
            this.dir_vec = [Math.cos(this.direction) * this.speed, Math.sin(this.direction) * this.speed]
            this.forces.push(this.dir_vec)
            this.mesh.rotation.x = Math.cos(this.direction) 
            this.mesh.rotation.y = Math.sin(this.direction)
        }

        this.updateRespawn();
        this.switchChargeCounter -= 1;
        this.shootCounter -= 1;
        
    }
}
