import { k_combinations, get_vector_length, normalise_vector, intersects, sumForces,elasticCollision, scale } from './helpers'
import * as THREE from 'three'
export default class PhysicsEngine {
    constructor(dt, friction) {
        this.dt = dt;
        this.KC = 8.9875517873681764 * 10**9;
        this.mu = friction;
        this.g = 9.82;
        this.firstTick = false;
    }

    tick(gameObjects, hosting) {
        for(var i = 0; i < gameObjects.length; i++) {
            let o1 = gameObjects[i];
            if(o1) {
                 if (this.firstTick) {
                    this.dt = this.dt/2
                    this.updateVel(o1)
                    this.dt = this.dt*2
                    this.firstTick = false
                 }else {
                    this.updatePos(o1, hosting);
                    this.updateVel(o1, hosting);
                 }
            }
        }
    }

    hitWall = (walls, obj) => {

        for(var i = 0; i < walls.length; i ++) {
            let wall = walls[i];
            if(wall.containsBox(obj) || obj.intersectsBox(wall)) {
                return i;
             }
        }
    
        return -1;
    }

    moveOutsieWall = (obj, wall, wallIndex)  => {
        let box = new THREE.Box3().setFromObject(obj.mesh);
        const padding = 0.01;
        
        while ( wall.intersectsBox(box)){
            obj.mesh.position.x = obj.x / 600;
            obj.mesh.position.y = obj.y / 600;
            box = new THREE.Box3().setFromObject(obj.mesh);
            box.min.x -= padding;
            box.min.y -= padding;
            box.min.z -= padding;
            box.max.x += padding;
            box.max.y += padding;
            box.max.z += padding;
        }
    }


    applyElectroForce(gameObjects, walls, addScore) {
        
         for(var i = 0; i < gameObjects.length; i++) {
            let obj = gameObjects[i];
            let box = new THREE.Box3().setFromObject(obj.mesh);
            const padding = 0.1;

            for(var j = 0; j < walls.length; j++) {
                const wall = walls[j];
                if( box.intersectsBox(wall)) {
                    switch(j){
                        //TOP COLLISION
                        
                        case 0:
                            obj.y = (wall.min.y - padding)*600; 
                            break;
                        //BOT COLLISION
                        case 1:
                            obj.y = (wall.max.y + padding)*600; 
                            break;
                        //LEFT
                        case 2:
                            obj.x = (wall.max.x + padding)*600; 
                            break;
                        //RIGHT
                        case 3:
                            obj.x = (wall.min.x - padding)*600;
                            break;  
                        default:
                            break;
                    
                    }
            
                    if (j < 2) {
                        obj.v[1] *=-1
                    }else {
                        obj.v[0] *=-1
                    }  
                } 
            } 
                                        
        }

        let combinations = k_combinations(gameObjects, 2);
        //console.log("COMBINATIONS?", combinations, gameObjects)
        for(var k = 0; k < combinations.length; k++) {
            let q1 = combinations[k][0];
            let q2 = combinations[k][1];
            let x = this.KC*q1.charge*q2.charge;
            let vector_p = [q1.x-q2.x, q1.y-q2.y];

            let r = get_vector_length(vector_p)
            let force_size;
            if(r) {
                force_size = x/r
            }else {
                force_size = x / 0.001
            }

            let vector_np = normalise_vector(vector_p)
            let force = [vector_np[0]*force_size, vector_np[1]*force_size]
            
            q1.forces.push(force)
            q2.forces.push([-force[0], -force[1]])

            if(intersects(q1, q2)) {
                if(q1.is_player && !q2.is_player){

                    if(!q1.respawning) {
                        if(q1 !== q2.player) {
                            q2.player.score += 5;    
                            addScore(q2.player, q2, 5);                    
                        }else {
                            q2.player.score -= 1;
                            addScore(q1, q1, -1);
                        }
                        q1.is_dead = true;
                        return;
                    }

                }else if(q2.is_player && !q1.is_player){

                    if(!q1.respawning) {
                        if(q2 !== q1.player) {
                            q1.player.score += 5; 
                            addScore(q1.player, q2, 5);
                        }else {
                            addScore(q2, q2, -1);
                            q1.player.score -= 1;
                        }
                            
                        q2.is_dead = true;
                        return;
                    }                    
                    
                }

                let q1_before = sumForces(q1);
                let q2_before = sumForces(q2);

                let q1_after = elasticCollision(q1.mass, q2.mass, q1_before, q2_before);
                let q2_after = elasticCollision(q2.mass, q1.mass, q2_before, q1_before);
                q1.v = scale(q1_after, 1/4);
                q2.v = scale(q2_after, 1/4);
            }
        }
    }

       applyFriction(objects) {
            for(var i = 0; i<objects.length; i++) {
                let object = objects[i];
                if(object.v !== [0,0]) {
                    let vector_v = normalise_vector(object.v)
                    vector_v = [-vector_v[0],-vector_v[1]]
                    let size = this.mu*this.g*object.mass
                    object.forces.push([vector_v[0]*size, vector_v[1]*size])
                }
            }
            
       }


    updatePos(gameObject, hosting){
        const div = !hosting ? (performance.now() - gameObject.lastUpdate)/19 : 1;
        gameObject.x = gameObject.x + gameObject.v[0]*this.dt*div;
        gameObject.y = gameObject.y + gameObject.v[1]*this.dt*div;
        gameObject.mesh.position.x = gameObject.x / 600;
        gameObject.mesh.position.y = gameObject.y / 600;
        gameObject.lastUpdate = performance.now()
    }

    updateVel(gameObject) {
        let forces = sumForces(gameObject);
        let xa = forces[0];
        let ya = forces[1];

        let friction_force = this.mu*this.g*this.dt;
        gameObject.v[0] += xa*this.dt;
        gameObject.v[1] += ya*this.dt;

        //console.log(gameObject.v, xa, ya, forces, friction_force, this.dt, this.g, this.mu);
        let vector_v_l = get_vector_length(gameObject.v);
        if(vector_v_l < friction_force) {
            vector_v_l = 0;
        }else {
            vector_v_l -= friction_force;
        }

        if (vector_v_l >= gameObject.max_speed) {
            vector_v_l = gameObject.max_speed;
        }


        let vector_v = normalise_vector(gameObject.v);

        gameObject.v[0] = vector_v[0]*vector_v_l
        gameObject.v[1] = vector_v[1]*vector_v_l
        gameObject.forces = []
    }

}