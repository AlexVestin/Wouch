import Player from "./player";
import { euclideanDistance, normalise_vector, scale } from './helpers'
export default class Enemy extends Player {

    constructor(x,y,charge,color,manager, name, id) {
        super(x,y,charge,color, manager, id, manager.scene)
        this.id = id;
        

        this.speed = this.speed*0.1;
        this.switchCD = 25;
        this.is_comp = true;
        this.generateVectorCount = 0;
        this.vx = Math.random() *this.speed - this.speed/2;
        this.vy = Math.random() *this.speed - this.speed/2;
    }


    generateVector = () => {
        if(this.generateVectorCount <= 0) {
            let x = Math.random() * 10000 - 5000;
            let y = Math.random() * 10000 - 5000;
            this.dir_vec = scale(normalise_vector([x - this.x, y-this.y]), this.speed)
            this.generateVectorCount = 12
        }
        this.generateVectorCount -=1;
    }

    getClosestPlayer = () => {
        let closestPlayer = null;
        let smallestDistance = 10000000;
        Object.keys(this.manager.players).forEach(key => {
            let player = this.manager.players[key];
            if(player !== this) {
                let dist = euclideanDistance(player.x, player.y, this.x, this.y)
                if(dist < smallestDistance) {
                    closestPlayer = player;
                    smallestDistance = dist;
                }
            }
        })
        return closestPlayer;   
    }

    update = (isHosting) => {
        let player = this.getClosestPlayer()
        if(player && euclideanDistance(player.x, player.y, this.x, this.y) > 1000 ) {
            let v = normalise_vector([player.x - this.x, player.y-this.y])
            this.dir_vec = scale(v, this.speed);
        
           
        }else if(player && euclideanDistance(player.x, player.y, this.x, this.y) < 500 ){
            let v = normalise_vector([player.x - this.x, player.y-this.y])
            this.dir_vec = scale(v, -this.speed);
        }else {
            this.generateVector()
        }

        let switched = false;
        this.manager.objects.forEach(obj => {
            if(!obj.is_player && euclideanDistance(obj.x, obj.y, this.x, this.y) < 300) {
                if((obj.charge < 0) === (this.charge >= 0) ) {
                    this.switchCharge()
                    switched = true; 
                }
            }
        })

        if(player && Math.random() > 0.982){
            if( player.charge === this.charge && !switched)
                this.switchCharge()
            this.create_bullet()
        }

           
        this.forces.push(this.dir_vec)

      
        this.mesh.position.x = this.x / 600;
        this.mesh.position.y = this.y / 600;
        this.switchChargeCounter -= 1;
        this.shootCounter -= 1;
        this.updateRespawn();
    }
}