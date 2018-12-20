import * as THREE from 'three'
import * as CANNON from 'cannon'
import PointerLockControls from './controls/pointlockcontrols'

export default class Manager {
    constructor(mountRef) {
        this.players = {};
        this.canvasMountRef = mountRef;

        this.width = 800;
        this.height = 800;
        this.ballShape = new CANNON.Sphere(0.2);
        this.ballGeometry = new THREE.SphereGeometry(this.ballShape.radius, 32, 32);
        this.shootDirection = new THREE.Vector3();
        this.shootVelo = 15;
        this.dt = 1/60;
        this.time = Date.now();

        this.boxes = [];
        this.boxMeshes = [];
        this.balls = [];
        this.walls = [];
        this.ballMeshes = [];

        this.initCannon();
        this.init();
        this.initControls();

        this.joystick_down = false;
        this.direction = 0;
        this.rayCaster = new THREE.Raycaster(); // create once
    }

    getShootDir(targetVec){

    }


    initControls = () => {
        const havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
        if ( havePointerLock ) {
            var element = this.canvasMountRef.current;
            var pointerlockchange = function ( event ) {
                if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
                    this.controls.enabled = true;
                    this.blocker.style.display = 'none';
                } else {
                    this.controls.enabled = false;
                    this.blocker.style.display = '-webkit-box';
                    this.blocker.style.display = '-moz-box';
                    this.blocker.style.display = 'box';
                }
            }

            this.controls.enabled = true;
     
            // Hook pointer lock state change events
            document.addEventListener( 'pointerlockchange', pointerlockchange, false );
            document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
            document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );
            //document.addEventListener( 'pointerlockerror', pointerlockerror, false );
            //document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
            //document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

        } else {
            alert("???");
            //instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
        }
    }

    jump = () => {
        this.sphereBody.velocity.y += 20;
    }

    shoot = () => {
        var ballBody = new CANNON.Body({ mass: 1 });
        ballBody.addShape(this.ballShape);
        var ballMesh = new THREE.Mesh( this.ballGeometry, this.material );
        this.world.addBody(ballBody);
        this.scene.add(ballMesh);
        ballMesh.castShadow = true;
        ballMesh.receiveShadow = true;
        this.balls.push(ballBody);
        this.ballMeshes.push(ballMesh);
        this.getShootDir(this.shootDirection);
        ballBody.velocity.set(  this.shootDirection.x * this.shootVelo,
            this.shootDirection.y * this.shootVelo,
            this.shootDirection.z * this.shootVelo
        );
        // Move the ball outside the player sphere
        this.sphereBody.position.x += this.shootDirection.x * (this.sphereShape.radius*1.02 + this.ballShape.radius);
        this.sphereBody.position.y += this.shootDirection.y * (this.sphereShape.radius*1.02 + this.ballShape.radius);
        this.sphereBody.position.z += this.shootDirection.z * (this.sphereShape.radius*1.02 + this.ballShape.radius);
        ballBody.position.set(this.sphereBody.position.x,this.sphereBody.position.y,this.sphereBody.position.z);
        ballMesh.position.set(this.sphereBody.position.x,this.sphereBody.position.y,this.sphereBody.position.z);
    }


    update = () => {
        var inputVelocity = new THREE.Vector3();
        const delta = this.dt * 10;

        inputVelocity.set(0,0,0);
        if(this.joystick_down) {
            inputVelocity.x = Math.cos(this.direction) * delta;
            inputVelocity.z = Math.sin(this.direction)  * delta;
        }
     
        // Add to the object
        this.sphereBody.velocity.x += inputVelocity.x;
        this.sphereBody.velocity.z -= inputVelocity.z;

        if(this.controls.enabled){
            this.world.step(this.dt);
            // Update ball positions
            for(var i=0; i<this.balls.length; i++){
                this.ballMeshes[i].position.copy(this.balls[i].position);
                this.ballMeshes[i].quaternion.copy(this.balls[i].quaternion);
            }
            // Update box positions
            for(var i=0; i<this.boxes.length; i++){
                this.boxMeshes[i].position.copy(this.boxes[i].position);
                this.boxMeshes[i].quaternion.copy(this.boxes[i].quaternion);
            }
        }

        this.controls.update( Date.now() - this.time );
        this.renderer.render( this.scene, this.camera );
        this.time = Date.now();

    }


    initCannon(){
        // Setup our world
        this.world = new CANNON.World();
        this.world.quatNormalizeSkip = 0;
        this.world.quatNormalizeFast = false;
        var solver = new CANNON.GSSolver();
        this.world.defaultContactMaterial.contactEquationStiffness = 1e9;
        this.world.defaultContactMaterial.contactEquationRelaxation = 4;
        solver.iterations = 7;
        solver.tolerance = 0.1;
        var split = true;
        if(split)
            this.world.solver = new CANNON.SplitSolver(solver);
        else
            this.world.solver = solver;
        this.world.gravity.set(0,-20,0);
        this.world.broadphase = new CANNON.NaiveBroadphase();
        // Create a slippery material (friction coefficient = 0.0)
        this.physicsMaterial = new CANNON.Material("slipperyMaterial");
        var physicsContactMaterial = new CANNON.ContactMaterial(this.physicsMaterial,this.physicsMaterial, 0.0, 0.3);
        // We must add the contact materials to the world
        this.world.addContactMaterial(physicsContactMaterial);
        // Create a sphere
        var mass = 5, radius = 1.3;
        this.sphereShape = new CANNON.Sphere(radius);
        this.sphereBody = new CANNON.Body({ mass: mass });
        this.sphereBody.addShape(this.sphereShape);
        this.sphereBody.position.set(0,5,0);
        this.sphereBody.linearDamping = 0.9;
        this.world.addBody(this.sphereBody);
        // Create a plane
        var groundShape = new CANNON.Plane();
        var groundBody = new CANNON.Body({ mass: 0 });
        groundBody.addShape(groundShape);
        groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
        this.world.addBody(groundBody);
    }

    init() {
        this.camera = new THREE.PerspectiveCamera( 75, this.width / this.height, 0.1, 1000 );
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog( 0x000000, 0, 500 );
        var ambient = new THREE.AmbientLight( 0x111111 );
        this.scene.add( ambient );
        this.light = new THREE.SpotLight( 0xffffff );
        this.light.position.set( 10, 30, 20 );
        this.light.target.position.set( 0, 0, 0 );
        if(true){
            this.light.castShadow = true;
            this.light.shadowCameraNear = 20;
            this.light.shadowCameraFar = 50;//camera.far;
            this.light.shadowCameraFov = 40;
            this.light.shadowMapBias = 0.1;
            this.light.shadowMapDarkness = 0.7;
            this.light.shadowMapWidth = 2*512;
            this.light.shadowMapHeight = 2*512;
            //light.shadowCameraVisible = true;
        }

        this.scene.add( this.light );
        this.controls = new PointerLockControls( this.camera , this.sphereBody, this.canvasMountRef.current );
        this.scene.add( this.controls.getObject() );
        // floor
        this.geometry = new THREE.PlaneGeometry( 300, 300, 50, 50 );
        this.geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
        this.material = new THREE.MeshLambertMaterial( { color: 0xdddddd } );
        this.mesh = new THREE.Mesh( this.geometry, this.material );
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.scene.add( this.mesh );
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.shadowMapEnabled = true;
        this.renderer.shadowMapSoft = true;
        this.renderer.setSize( this.width, this.height );
        this.renderer.setClearColor( this.scene.fog.color, 1 );
        this.canvasMountRef.current.appendChild(this.renderer.domElement);
        // Add boxes
        var halfExtents = new CANNON.Vec3(1,1,1);
        var boxShape = new CANNON.Box(halfExtents);
        var boxGeometry = new THREE.BoxGeometry(halfExtents.x*2,halfExtents.y*2,halfExtents.z*2);
        for(var i=0; i<7; i++){
            var x = (Math.random()-0.5)*20;
            var y = 1 + (Math.random()-0.5)*1;
            var z = (Math.random()-0.5)*20;
            var boxBody = new CANNON.Body({ mass: 5 });
            boxBody.addShape(boxShape);
            var boxMesh = new THREE.Mesh( boxGeometry, this.material );
            this.world.addBody(boxBody);
            this.scene.add(boxMesh);
            boxBody.position.set(x,y,z);
            boxMesh.position.set(x,y,z);
            boxMesh.castShadow = true;
            boxMesh.receiveShadow = true;
            this.boxes.push(boxBody);
            this.boxMeshes.push(boxMesh);
        }
        // Add linked boxes
        var size = 0.5;
        var he = new CANNON.Vec3(size,size,size*0.1);
        var boxShape = new CANNON.Box(he);
        var mass = 0;
        var space = 0.1 * size;
        var N = 5, last;
        var boxGeometry = new THREE.BoxGeometry(he.x*2,he.y*2,he.z*2);
        for(var i=0; i<N; i++){
            var boxbody = new CANNON.Body({ mass: mass });
            boxbody.addShape(boxShape);
            var boxMesh = new THREE.Mesh(boxGeometry, this.material);
            boxbody.position.set(5,(N-i)*(size*2+2*space) + size*2+space,0);
            boxbody.linearDamping = 0.01;
            boxbody.angularDamping = 0.01;
            // boxMesh.castShadow = true;
            boxMesh.receiveShadow = true;
            this.world.addBody(boxbody);
            this.scene.add(boxMesh);
            this.boxes.push(boxbody);
            this.boxMeshes.push(boxMesh);
            if(i!=0){
                // Connect this body to the last one
                var c1 = new CANNON.PointToPointConstraint(boxbody,new CANNON.Vec3(-size,size+space,0),last,new CANNON.Vec3(-size,-size-space,0));
                var c2 = new CANNON.PointToPointConstraint(boxbody,new CANNON.Vec3(size,size+space,0),last,new CANNON.Vec3(size,-size-space,0));
                this.world.addConstraint(c1);
                this.world.addConstraint(c2);
            } else {
                mass=0.3;
            }
            last = boxbody;
        }
    }
}