import * as THREE from 'three'
import Player from './player'
import PhysicsEngine from './physics'

export default class Manager {

    construcor() {
        this.setUpScene()
        this.physicsEngine = new PhysicsEngine(0.1, 3);
        this.objects = [];
        this.players = {};
    }

    update = (renderer) => {
        for (var key in this.players) {
            // check if the property/key is defined in the object itself, not in parent
            if (this.players.hasOwnProperty(key)) {
                this.players[key].update();
            }
        }
        this.physicsEngine.applyElectroForce(this.objects);
        this.physicsEngine.tick(this.objects);
        renderer.render(this.scene, this.camera);
    }

    setUpScene = () => {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera();
    }

    addPlayer = (id, name) => {
        this.players[id] = new Player(300,300, 0.01, (0,255,0), this, name, this.scene);
        this.objects.push(this.manager.players[id]);
    }
}