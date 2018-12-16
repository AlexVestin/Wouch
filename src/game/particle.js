import GameObject from './gameobject'
import * as THREE from 'three'
import {makeId} from './helpers'

export default class Particle extends GameObject {
    
    constructor(x, y,size, charge, mass, velocity, player, manager=null, id = null) {
        super(x,y,velocity,mass);
        this.charge = charge;
        this.size = size;
        this.player = null;
        this.countThreshold = 30;
        this.switchChargeCounter = 0;
        if(!id) {
            this.id = makeId(4);
        }else {
            this.id = id;
        }
            
        
        if(player) {
            this.player = player;
            this.count = 120;
        }

        if(manager) {
            this.manager = manager;
            this.scene = manager.scene;
            var geometry = new THREE.CircleGeometry(0.02, 2);
            var material;
            if(this.charge > 0) {
                material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
            }else {
                material = new THREE.MeshBasicMaterial( { color: 0x00ff00} );
            }
            material.side = THREE.DoubleSide;
            this.mesh = new THREE.Mesh( geometry, material );
            
            this.scene.add(this.mesh);
        } 
    }

    update(isHosting) {
        this.count -= 1;
        
        this.mesh.rotation.z += 0.1;
        
        if(this.count <= 0 ) {
            const index = this.manager.objects.findIndex(e => this.id === e.id);
            this.manager.objects.splice(index, 1);
            this.scene.remove(this.mesh);
        }else if(this.count <= this.countThreshold) {
            const scale = this.count / this.countThreshold;
            this.mesh.scale.set(scale, scale, scale);
        }

        
    }

    discretize = () => {
        return {
            pid: this.player.id,
            id: this.id,
            i: this.is_player,
            m: this.mass,
            ttl: this.count,
            x: this.x,
            y: this.y,
            c: this.charge,
            d: this.is_dead,
            dir: this.direction,
            v: this.v,
        }
    }

    switchCharge(){
        this.charge = this.charge*-1;
        if(this.switchChargeCounter <= 0) {
            if(this.charge < 0) {
                this.mesh.material.color = new THREE.Color(0, 255, 0);
            }else {
                this.mesh.material.color = new THREE.Color(255, 0, 0);
            }

            this.switchChargeCounter = 5;
        }
       
        
    }
} 