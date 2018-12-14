

export default class Controller {

    constructor(manager, updatePlayers, removePlayer) {
        this.exampleSocket = new WebSocket("ws:3.8.115.45:8000");

        this.exampleSocket.onopen = () => {
            this.exampleSocket.send("SERVER");
        }

        this.manager = manager;
        this.exampleSocket.onmessage = (e) => {
            this.handleMessage(e.data);
        }
        this.updatePlayers = updatePlayers;
        this.removePlayer = removePlayer;
    }

    handleMessage = (data) => {
        let id = String(data.substr(0, 1));
        let msg = String(data.substr(1));
        if(id in this.manager.players) {
            if (msg[0] === "*") {
                this.manager.players[id].direction = Number(msg.substr(1));
            } else if (msg ==="LEFTSTART") {
                this.manager.players[id].joystick_down = true;
            } else if (msg ==="LEFTEND") {
                this.manager.players[id].joystick_down = false; 
            } else if (msg === "SHOOT"){
                this.manager.players[id].create_bullet();
            } else if (msg ==="SWITCH") {
                this.manager.players[id].switchCharge();
            } else if (msg ==="CLOSED") {
               this.removePlayer(id);
            }
        }else if (msg[0] === ";") {
            let name = msg.substr(1);
            this.manager.addPlayer(id, name);
            this.updatePlayers({[id]: {name: name, score: 0}})
        }
    
    }
}