

export default class Controller {
 
    constructor(port, manager, updateState) {
        this.exampleSocket = new WebSocket("ws:3.8.115.45:" + port);

        this.exampleSocket.onopen = () => {
            this.exampleSocket.send("SERVER");
            this.updateState("SOCKET_OPEN");
        }

        this.manager = manager;
        this.exampleSocket.onmessage = (e) => {
            this._handleMessage(e.data);
        }

        this.updateState = updateState;
        this.hosting = true;
    }

    send = (msg) => {
        this.exampleSocket.send(msg);
    }

    handleMessage = (id, msg) => {
        console.log("IMPLEMENT THIS METHOD")
    }

    _handleMessage = (data) => {
        let id = String(data.substr(0, 1));
        let msg = String(data.substr(1));

        this.handleMessage(id, msg);
    }
}