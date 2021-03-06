

export default class Controller {
 
    constructor(port, manager, updateState) {
        this.exampleSocket = new WebSocket("ws:3.8.115.45:" + port);

        this.exampleSocket.onopen = () => {
            this.exampleSocket.send("SERVER");
            this.updateState("SOCKET_OPEN");
        }

        this.manager = manager;
        this.exampleSocket.onmessage = (e) => {
            this.handleMessage(e.data);
        }

        this.updateState = updateState;
        this.hosting = true;
    }

    send = (msg) => {
        this.exampleSocket.send(msg);
    }

    handleMessage = (data) => {
        let id = String(data.substr(0, 1));
        let msg = String(data.substr(1));

        if(id in this.manager.players) {
            if (msg[0] === "*") {
            } else if (msg ==="LEFTSTART") {
            } else if (msg ==="LEFTEND") {
            } else if (msg === "SHOOT"){
            } else if (msg ==="SWITCH") {
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