import GameObject from './gameobject'
import * as THREE from 'three'

export default class Particle extends GameObject {
    constructor(x, y,size, charge, mass, velocity, player, scene=null) {
        super(x,y,velocity,mass);
        this.charge = charge;
        this.size = size;
        this.player = null;
        
        if(player) {
            this.player = player;
            this.count = 200;
        }

        if(scene) {
            this.scene =scene;
            var geometry = new THREE.CircleGeometry(0.02, 2);
            var material;
            if(this.charge > 0) {
                material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
            }else {
                material = new THREE.MeshBasicMaterial( { color: 0x0000ff} );
            }
            material.side = THREE.DoubleSide;
            this.mesh = new THREE.Mesh( geometry, material );
            scene.add(this.mesh);
        } 
    }
    draw(){
        console.log("draw");
    }

    switchCharge(){
        this.charge = this.charge*-1;
        if(this.charge < 0) {
            this.mesh.material.color = new THREE.Color(0, 0, 255);
        }else {
            this.mesh.material.color = new THREE.Color(255, 0, 0);
        }
    }
} 