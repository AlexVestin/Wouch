import { sumVectors } from './helpers' 
export default class DeathAnimation {

    constructor(meshes, manager) {
        this.meshes = meshes;
        this.manager = manager;

        const xPos = [];
        const yPos = [];
        meshes.forEach(mesh => {
            mesh.geometry.vertices.forEach(v =>{
                xPos.push(v.x)
                yPos.push(v.y);
            })
        })

        this.middle = [this.mode(this.xPos), this.mode(this.yPos)];
        
        
        this.vectors = [];
        meshes.forEach(mesh => {
            let vec = [];
            mesh.geometry.vertices.forEach(v => {
                vec.push([v.x - this.middle[0], v.y - this.middle[1]])
            })
            this.vectors.push(sumVectors(vec));
        }) 

        this.animationTicks = 50;
        this.countDown = this.animationTicks;

        this.xRotation = Math.random() * 0.05;
        this.yRotation = this.xRotation - Math.random() * 0.1;
        this.zRotation = Math.random() * 0.1;

    }

    mode = (array) => {
        var set = Array.from(new Set(array));
        var counts = set.map(a=>array.filter(b=>b==a).length);
        var indices = counts.map((a,b)=>Math.max(...counts)===a?b:0).filter(b=>b!==0);
        var mode = indices.map(a=>set[a]);
        return mode;
    }

    update = () => {
        if(this.countDown <= 0) {
            for(var i = this.meshes.length -1; i >= 0; i--){
                this.manager.scene.remove(this.meshes[i]);
            } 

            const index = this.manager.deathAnimations.findIndex(e => e === this);
            this.manager.deathAnimations.splice(index, 1);
        }
        this.meshes.forEach((mesh,i) =>{
            mesh.position.x += this.vectors[i][0] / this.animationTicks
            mesh.position.y += this.vectors[i][1] / this.animationTicks
            mesh.material.opacity =  this.countDown / this.animationTicks;
            
            mesh.rotation.x += this.xRotation;
            mesh.rotation.y += this.yRotation;
            mesh.rotation.z += this.zRotation;

            /*mesh.rotation.z += 0.01;
            mesh.rotation.x += 0.01;
            mesh.rotation.y += 0.2;*/

        })

        this.countDown-=1

    }
    

}