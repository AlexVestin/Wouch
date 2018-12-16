import React, { PureComponent } from 'react'
import JoystickController from './joystickcontroller'
import ButtonController from './buttoncontroller'

export default class ControllerContainer extends PureComponent {

    constructor() {
        super();
        this.open = false;
        this.state= { controller: "" }
        this.messageQueue = [];
    }

    sendMessage = () => {
        if(this.open && this.messageQueue.length > 0) {
            this.send(this.messageQueue[this.messageQueue.length - 1]);
            this.messageQueue = [];
        }
    }

    send = (msg) => {
        this.exampleSocket.send(msg);
    }

    addMessage = (msg) => {
        this.messageQueue.push(msg);
    }   

    openSocket = () => {
        var url = new URL(window.location.href);
        var c = url.searchParams.get("nick");
        var port = url.searchParams.get("room");
        this.exampleSocket = new WebSocket("ws:3.8.115.45:" + port);

        this.exampleSocket.onopen = () => {
            this.send("CLIENT");
            this.send(c ? ";" + c : ";rando");
            this.open = true;
        }
    }
 
    componentDidMount = () => {
        var url = new URL(window.location.href);
        this.setState({controller: url.searchParams.get("controller")})
    
        this.openSocket();
        setInterval(this.sendMessage, 25);    
    }

    render() {
        console.log(this.state.controller, this.state.controller === "charged")
        return(
            <React.Fragment>
                {this.state.controller  === "charged" && <ButtonController send={this.send} addMessage={this.addMessage}></ButtonController>}
                {this.state.controller  === "pokemon" && <JoystickController send={this.send} addMessage={this.addMessage}></JoystickController>}
            </React.Fragment>
        )
    }
}

