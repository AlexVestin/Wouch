import * as THREE from 'three'
import Player from './player'
import PhysicsEngine from './physics'
import Particles from './particles';
import OrbitControls from './controls/orbitcontrols'
import RenderPass from './postprocessing/passes/renderpass'
import UnrealBloomPass from './postprocessing/passes/unrealbloompass'
import EffectComposer from './postprocessing/effectcomposer'
import Particle from './particle';
import Enemy from './enemy'
import { makeId } from './helpers'
import { intersects } from './helpers'
import DeathAnimation from './deathanimation'


export default class Manager {

    constructor(renderer, textCtx, updatePlayers) {
        this.textCtx = textCtx;
        this.physicsEngine = new PhysicsEngine(0.13, 4.5);
        this.objects = [];
        this.players = {};
        this.renderer = renderer;
        this.isHosting = true;
        this.events = [];
        this.positions = [];
        this.deathAnimations = [];
        this.postProcessing = true;
        this.textCtx.font = "13px Arial";
        this.setUpScene();
        this.points = [];

    }

    createDeathAnimation = (player) => {
        const verts = [];
        const geo = player.mesh.geometry;
        geo.faces.forEach(face => {
            var geometry = new THREE.Geometry();

            const a = geo.vertices[face.a].clone();
            const b = geo.vertices[face.b].clone();
            const c = geo.vertices[face.c].clone();
            geometry.vertices.push(a);
            geometry.vertices.push(b);
            geometry.vertices.push(c);
            geometry.faces.push(new THREE.Face3(0, 1, 2));
            const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: player.mesh.material.color, wireframe: true, transparent: true }))
            mesh.position.copy(player.mesh.position);
            verts.push(mesh);
            this.scene.add(mesh);
        })

        
        this.deathAnimations.push(new DeathAnimation(verts, this));
    }

    convertToPixelPosition = (obj) => {
        const width = 800;
        const height = 800;
        var pos = obj.position.clone();
        pos.project(this.camera);
        pos.x = ( pos.x * width/2 ) + width/2;
        pos.y = - ( pos.y * height/2) + height/2;
        return pos;
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

    updateText = () => {
        
        this.textCtx.clearRect(0, 0, 800, 800);
        Object.keys(this.players).forEach(key => {
            let player = this.players[key];
            this.textCtx.save()
            this.textCtx.rotate(player.rotation);

            this.textCtx.fillStyle ="rgb("+player.color[0]+","+player.color[1]+","+player.color[2]+")";
            const pos = this.convertToPixelPosition(player.mesh);
            
            this.textCtx.fillText(player.name.substr(0,5), pos.x+5, pos.y-10);
            this.textCtx.restore()
        })

        this.points.forEach(point =>{
            this.textCtx.save()
            this.textCtx.fillStyle ="rgb("+point[2][0]+","+point[2][1]+","+point[2][2]+")";
            const pos = point[0];
            this.textCtx.strokeStyle="rgb("+point[2][0]+","+point[2][1]+","+point[2][2]+")";
            this.textCtx.shadowColor="rgb("+point[2][0]+","+point[2][1]+","+point[2][2]+")";
            this.textCtx.shadowOffsetX=0;
            this.textCtx.shadowOffsetY=0;
            this.textCtx.shadowBlur=25;

            this.textCtx.globalAlpha = point[1] / 100;
            this.textCtx.strokeText(point[3] > 0 ? "+"+point[3] : point[3], pos.x, pos.y);
            point[1] -=1;
            this.textCtx.restore()
        })

        this.points = this.points.filter(p => p[1] >= 0);
    }

    pointsTextAnimation = (scoringPlayer, deadPlayer, points) => {
        if(scoringPlayer === deadPlayer) {
            this.points.push([this.convertToPixelPosition(scoringPlayer.mesh), 100, scoringPlayer.color, points])
        }else {
            this.points.push([this.convertToPixelPosition(deadPlayer.mesh), 100, scoringPlayer.color, points])
        }
    }


    updateGame = () => {
        Object.keys(this.players).forEach(key => {
            if (this.players[key].is_dead) {
                this.createDeathAnimation(this.players[key])
                
                this.players[key].respawn()
                this.findClearSpawnPoint(this.players[key]);
                this.players[key].is_dead = false;
                //const index = this.objects.findIndex(e => e.id === this.players[key].i)

                /*
                for (var i = this.objects.length - 1; i >= 0; i--) {
                    let item = this.objects[i];
                    if (!item.is_player) {
                        this.scene.remove(item.mesh);
                        this.objects.splice(i, 1);
                    }
                }
                */
            }
        })
        for(var i = this.objects.length - 1; i >= 0; i--) {
            let obj = this.objects[i]
            if(!obj.is_player && obj.is_dead) {
                this.scene.remove(obj.mesh);
                this.objects.splice(i, 1)
            }
        }




        this.physicsEngine.applyElectroForce(this.objects, this.walls, this.pointsTextAnimation);
        this.physicsEngine.tick(this.objects, this.isHosting);
        this.deathAnimations.forEach(d => d.update())
        this.updateText()
    }

    packageGameInfo = () => {
        this.gameInformation = [];
        this.objects.forEach(obj => {
            this.gameInformation.push(obj.discretize())
        });
    }

    loadGameFromInfo = (info) => {
        if (info) {
            this.objects.forEach(e => e.shouldKeep = false);

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
                } else {
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
        if (!this.postProcessing) {
            renderer.render(this.scene, this.camera)
        } else {
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
        this.camera.position.z = size * 2.7;

        this.gridHelper = new THREE.GridHelper(size * 2, size * 6);

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

        let topBox = new THREE.Box3(new THREE.Vector3(-size, size, -size), new THREE.Vector3(size, size * 2, size))
        let botBox = new THREE.Box3(new THREE.Vector3(-size, -size * 2, -size), new THREE.Vector3(size, -size, size))
        let leftBox = new THREE.Box3(new THREE.Vector3(-size * 2, -size, -size), new THREE.Vector3(-size, size, size))
        let rightBox = new THREE.Box3(new THREE.Vector3(size, -size, -size), new THREE.Vector3(size * 2, size, size))
        /*
        var topHelper = new THREE.Box3Helper( topBox, 0xffff00 );
        this.scene.add( topHelper );
        var botHelper = new THREE.Box3Helper( botBox, 0xffff00 );
        this.scene.add( botHelper );
        var leftHelper = new THREE.Box3Helper( leftBox, 0xffff00 );
        this.scene.add( leftHelper );
        var rightHelper = new THREE.Box3Helper( rightBox, 0xffff00 );
        this.scene.add( rightHelper );
        */
        this.walls = [
            topBox,
            botBox,
            leftBox,
            rightBox
        ]
        this.addPlayer(makeId(4), "Comp1", true);
        this.addPlayer(makeId(4), "Comp2", true);
    }

    updateNrComputers  = (nr) => {
        let count = 0;
        const keys = Object.keys(this.players); 
        keys.forEach(e => count = this.players[e].is_comp ? count + 1 : count);

        console.log(nr, count)
        if(count > nr) {
            for(var i = keys.length - 1; i >= 0; i--) {
                if(this.players[ keys[i]].is_comp) {
                    this.removePlayer(keys[i]);
                    break;
                }
            }
        }else {
            this.addPlayer(makeId(4), "Comp2", true);
        }
    }

    findClearSpawnPoint = (obj) => {
        let intsects = true;
        while (intsects) {

            obj.x = Math.random() * 2400 - 1200;
            obj.y = Math.random() * 2400 - 1200;
            obj.setMeshPos();

            console.log(obj.x, obj.y);

            intsects = false;
            for(var i = 0; i < this.objects.length; i++) {
                let obj2 =  this.objects[i];
                if(obj !== obj2) {
                    if(intersects(obj, obj2)) {
                        intsects = true;
                        break; 
                    }
                }
            }

        }
    }


    addPlayer = (id, name, isEnemy = false) => {
        let x = 200 + Math.floor(Math.random() * 600);
        let y = 200 + Math.floor(Math.random() * 600);


        if (!isEnemy) {
            this.players[id] = new Player(x, y, 0.015, (0, 255, 0), this, name, this.scene, id);
        } else {
            this.players[id] = new Enemy(x, y, 0.015, (0, 255, 0), this, name, id);
        }

        this.findClearSpawnPoint(this.players[id]);

        

        this.objects.push(this.players[id]);
    }
}