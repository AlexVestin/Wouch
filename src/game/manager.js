import * as THREE from 'three'
import Player from './player'
import PhysicsEngine from './physics'
import Particles from './particles';
import OrbitControls from './controls/orbitcontrols'
import RenderPass from './postprocessing/passes/renderpass'
import UnrealBloomPass from './postprocessing/passes/unrealbloompass'
import EffectComposer from './postprocessing/effectcomposer'
import Particle from './particle';

export default class Manager {

    constructor(renderer) {

        this.physicsEngine = new PhysicsEngine(0.15, 4.5);
        this.objects = [];
        this.players = {};
        this.renderer = renderer;
        this.isHosting = true;
        this.events = [];
        this.positions = [];
        this.postProcessing = true;
        this.setUpScene()

    }


    updatePlayersG = () => {
        this.objects.forEach(item => item.update(this.isHosting))
        for (var key in this.players) {
            // check if the property/key is defined in the object itself, not in parent
            if (this.players.hasOwnProperty(key)) {
                this.players[key].update(this.isHosting);

                
                }
            }
        
    }


    updateGame = () => {
        Object.keys(this.players).forEach(key => {
            if (this.players[key].is_dead) {
                this.players[key].is_dead = false;
                for (var i =  this.objects.length - 1; i >= 0; i--) {
                    let item = this.objects[i];
                    if (!item.is_player) {
                        this.scene.remove(item.mesh);
                        this.objects.splice(i, 1);
                    }
                }
            }
        })

        this.physicsEngine.applyElectroForce(this.objects, this.walls);
        this.physicsEngine.tick(this.objects, this.isHosting);

    }

    packageGameInfo = () => {
        this.gameInformation = [];
        this.objects.forEach(obj => {
            this.gameInformation.push(obj.discretize())
        });
    }

    loadGameFromInfo = (info) => {
        if (info) {
            this.objects.forEach(e => e.shouldKeep=false);

            info.forEach(obj => {
                obj.shouldKeep = true;
                let index = this.objects.findIndex(e => e.id === obj.id)
                // ADD PLAYER FIRST SINCE PARTICLES MIGHT NEED THEM
                if (index === -1) {
                    if (obj.i) {
                        let player = new Player(obj.x, obj.y, obj.c, obj.col, this, obj.name, this.scene, obj.id);
                        player.color = obj.col;
                        player.is_dead = obj.d;
                        player.direction = obj.dir;
                        player.shouldKeep = true;
                        this.players[player.id] = player;
                        this.objects.push(player)
                    }
                }else {
                    this.objects[index].shouldKeep = true;
                }
            });

            info.forEach(obj => {
                let i = this.objects.findIndex(e => e.id === obj.id);
                if (i === -1) {
                    let particle = new Particle(obj.x, obj.y, obj.s, obj.c, obj.m, obj.v, this.players[obj.pid], this.scene, obj.id);
                    particle.shouldKeep = true;
                    this.objects.push(particle);
                } else {

                    let o = this.objects[i];
                    o.lastUpdate = performance.now()
                    
                    o.x = obj.x;
                    o.y = obj.y;
                    o.v = obj.v;
                    o.mass = obj.m;
                    o.charge = obj.c;
                    o.shouldKeep = true;
                    o.mesh.position.x = o.x / 600;
                    o.mesh.position.y = o.y / 600;

                    if (o.is_player) {
                        o.score = obj.score;
                        o.name = obj.name;
                        o.direction = obj.dir;

                      
                        o.mesh.rotation.y = Math.sin(o.direction);
                        o.mesh.rotation.x = Math.cos(o.direction);
                    }
                }
            })

            for (var i = 0; i < this.objects.length; i++) {
                let o = this.objects[i];
                if (!o.shouldKeep) {
                    this.scene.remove(o.mesh);
                    this.objects.splice(i, 1);
                    if (o.id in this.players) {
                        delete this.players[o.id];
                    }
                }
            }
        }
    }

    render = (renderer) => {
        this.particles.animate();
        if(!this.postProcessing) {
            renderer.render(this.scene, this.camera)
        }else {
            this.composer.render()
        }
        
        //
    }

    update = (gameData) => {
        this.updatePlayersG()
        if (!gameData) {
            this.updateGame();
            this.packageGameInfo();
        } else {
            this.loadGameFromInfo(gameData);
        }
    }

    removePlayer = (id) => {
        this.objects = this.objects.filter(e => e !== this.players[id]);
        this.scene.remove(this.players[id].mesh);
        delete this.players[id];
    }

    setUpScene = () => {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera();
        this.camera.position.z = 5;

        this.controls = new OrbitControls(this.camera, this.renderer.domElement)

        this.starsGeometry = new THREE.Geometry();
        this.particles = new Particles(this.camera);
        this.scene.add(this.particles.mesh);

        const size = 2.5;
        this.camera.position.z = size*2.7;
        
        this.gridHelper = new THREE.GridHelper(size*2, size*6);

        this.gridHelper.position.z = 0;
        this.gridHelper.rotation.x = Math.PI / 2;
        this.scene.add(this.gridHelper);

        var renderScene = new RenderPass(this.scene, this.camera);
        var bloomPass = new UnrealBloomPass(2.2, 0.87, 0, new THREE.Vector2(800, 800));
        this.composer = new EffectComposer(this.renderer);
        this.composer.setSize(800, 800);
        this.composer.addPass(renderScene);
        bloomPass.renderToScreen = true;
        this.composer.addPass(bloomPass);

        this.gridBox = new THREE.Box3().setFromObject(this.gridHelper);
        this.gridBox.min.z = -2;
        this.gridBox.max.z = 2;

        let topBox = new THREE.Box3(new THREE.Vector3( -size, size, -size ), new THREE.Vector3( size, size*2, size ))
        let botBox = new THREE.Box3(new THREE.Vector3( -size, -size*2, -size ), new THREE.Vector3( size, -size, size ))
        let leftBox = new THREE.Box3(new THREE.Vector3( -size*2, -size, -size ), new THREE.Vector3( -size, size, size ))
        let rightBox = new THREE.Box3(new THREE.Vector3( size, -size, -size ), new THREE.Vector3( size*2, size, size ))

        var topHelper = new THREE.Box3Helper( topBox, 0xffff00 );
        //this.scene.add( topHelper );
        var botHelper = new THREE.Box3Helper( botBox, 0xffff00 );
        //this.scene.add( botHelper );
        var leftHelper = new THREE.Box3Helper( leftBox, 0xffff00 );
        //this.scene.add( leftHelper );
        var rightHelper = new THREE.Box3Helper( rightBox, 0xffff00 );
        //this.scene.add( rightHelper );

        this.walls = [
            topBox,
            botBox,
            leftBox,
            rightBox
        ]
    }

    addPlayer = (id, name) => {
        let x = 200 + Math.floor(Math.random() * 600);
        let y = 200 + Math.floor(Math.random() * 600);
        this.players[id] = new Player(x, y, 0.01, (0, 255, 0), this, name, this.scene, id);
        this.objects.push(this.players[id]);
    }
}