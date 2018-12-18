import Controller from "../../../networking/server";


export default class Receiver extends Controller {

    handleMessage = (id, msg) => {
        console.log(id, msg);
        if(true) {
            if (msg[0] === "*") {
                this.manager.direction = Number(msg.substr(1));
            } else if (msg ==="LEFTSTART") {
                this.manager.joystick_down = true;
            } else if (msg ==="LEFTEND") {
                this.manager.joystick_down = false; 
            } else if (msg === "SHOOT"){
                this.manager.jump();
            } else if (msg ==="SWITCH") {
                this.manager.shoot();
            } else if (msg ==="CLOSED") {
               this.updateState(msg, [id]);
            }
        }else if (msg[0] === ";") {
            let name = msg.substr(1);
            this.updateState("JOINING", [id, name])
        }else if(msg[0] === "_") {
            let data = JSON.parse(msg.substr(1));
            this.updateState("UPDATE_GAME", data);
        }else if(msg === "CLONING") {
            this.updateState(msg)    
        }else if(msg === "HOSTING") {
            this.updateState(msg)
        }
    }
}