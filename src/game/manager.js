import * as THREE from 'three'
import Player from './player'
import PhysicsEngine from './physics'
import Particles from './particles';
import OrbitControls from './controls/orbitcontrols'
import RenderPass from './postprocessing/passes/renderpass'
import UnrealBloomPass from './postprocessing/passes/unrealbloompass'
import EffectComposer from './postprocessing/effectcomposer'

export default class Manager {

    constructor(renderer, updatePlayers) {
        
        this.physicsEngine = new PhysicsEngine(0.15, 4.5);
        this.objects = [];
        this.players = {};
        this.updatePlayers = updatePlayers;
        this.renderer = renderer;
        this.setUpScene()
    }

    update = (renderer) => {
        for (var key in this.players) {
            // check if the property/key is defined in the object itself, not in parent
            if (this.players.hasOwnProperty(key)) {
                this.players[key].update();
            }
        }

        Object.keys(this.players).forEach(key => {
            if(this.players[key].is_dead) {
                this.players[key].is_dead = false;
                for(var i =0; i < this.objects.length; i++) {
                    let item = this.objects[i];
                    if(!item.is_player) {
                        this.scene.remove(item.mesh);
                        this.objects.splice(i, 1);
                    }
                }
                this.players[key].score -= 1;
                this.updatePlayers({[key]: {name: this.players[key].name, score: this.players[key].score}});
            }
        })


        this.physicsEngine.applyElectroForce(this.objects);
        this.physicsEngine.tick(this.objects);
        this.particles.animate();
        this.composer.render()
        //renderer.render(this.scene, this.camera);
    }

    removePlayer = (id) => {
        this.objects = this.objects.filter(e => e !== this.players[id]);
        console.log(this.scene.children)
        this.scene.remove(this.players[id].mesh);
        console.log(this.scene.children)
        delete this.players[id];
        
    }


    setUpScene = () => {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera();

        this.camera.position.z = 5;

        this.controls =  new OrbitControls(this.camera, this.renderer.domElement)

        //controls.update() must be called after any manual changes to the camera's transform
        this.controls.update();

        this.starsGeometry = new THREE.Geometry();
        this.particles = new Particles(this.camera);
        this.scene.add(this.particles.mesh);


        var gridHelper = new THREE.GridHelper(400, 10);
        
        gridHelper.position.z = - 520;
        gridHelper.rotation.x = Math.PI/2;
        this.scene.add( gridHelper );

        var renderScene = new RenderPass( this.scene, this.camera );
        var bloomPass = new UnrealBloomPass(3.2, 0.87, 0,  new THREE.Vector2(800, 800) );
        this.composer = new EffectComposer( this.renderer );
        this.composer.setSize( 800, 800 );
        this.composer.addPass( renderScene );
        bloomPass.renderToScreen = true;
        this.composer.addPass( bloomPass );
    }

    addPlayer = (id, name) => {
        let x = 200+Math.floor(Math.random() * 600);
        let y = 200+Math.floor(Math.random() * 600);
        this.players[id] = new Player(x,y, 0.01, (0,255,0), this, name, this.scene);
        this.objects.push(this.players[id]);
    }
}