import { k_combinations, get_vector_length, normalise_vector, intersects, sumForces,elasticCollision, scale } from './helpers'

export default class PhysicsEngine {
    constructor(dt, friction) {
        this.dt = dt;
        this.KC = 8.9875517873681764 * 10**9;
        this.mu = friction;
        this.g = 9.82;
        this.firstTick = false;
    }

    tick(gameObjects) {
        for(var i = 0; i < gameObjects.length; i++) {
            let o1 = gameObjects[i];
            if(o1) {
                 if (this.firstTick) {
                    this.dt = this.dt/2
                    this.updateVel(o1)
                    this.dt = this.dt*2
                    this.firstTick = false
                 }else {
                    this.updatePos(o1);
                    this.updateVel(o1);
                 }
            }
        }
    }

    applyElectroForce(gameObjects) {
        let combinations = k_combinations(gameObjects, 2);
         for(var i = 0; i < combinations.length; i++) {
            let o1 = combinations[i];
            // wall collisions
        }

        //console.log("COMBINATIONS?", combinations, gameObjects)
        for(var i = 0; i < combinations.length; i++) {
            let q1 = combinations[i][0];
            let q2 = combinations[i][1];

            let x = this.KC *q1.charge*q2.charge;

            let vector_p = [q1.x - q2.x, q1.y-q2.y];

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
                    if(q1 !== q2.player) {
                        console.log(q1, q2.player)
                        q2.player.score += 1; 
                       
                    }
                        
                    q1.is_dead = true;
                    return;
                }else if(q2.is_player && !q1.is_player){
                    if(q2 !== q1.player) {
                        console.log(q2, q1.player)
                        q1.player.score += 1; 
                    }
                        
                    q2.is_dead = true;
                    return;
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


    updatePos(gameObject){
        gameObject.x = gameObject.x + gameObject.v[0]*this.dt;
        gameObject.y = gameObject.y + gameObject.v[1]*this.dt;
        gameObject.mesh.position.x = gameObject.x / 600;
        gameObject.mesh.position.y = gameObject.y / 600;
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