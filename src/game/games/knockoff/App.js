import React, { Component } from 'react';

import Manager from './manager'
import './App.css';
import Controller from './networking/server';

class App extends Component {
    constructor(props) {
        super(props);
        this.width = 800;
        this.height = 800;

        this.state = { players: {} };
        this.canvasMountRef = React.createRef();
        this.sendGameInfoCounter = 60;

        var url = new URL(window.location.href);
        this.port = url.searchParams.get("room");
    }

    componentDidMount() {
        this.manager = new Manager(this.canvasMountRef);
        this.controller = new Controller(this.port, this.manager, this.updateState);
        this.renderScene();
    }

    updateState = (msg, args) => {
        switch (msg) {
            case "SOCKET_OPEN":
                this.renderScene();
                break;
            case "CLOSED":
                this.removePlayer(args[0]);
                break;
            case "CLONING":
                this.manager.isHosting = false;
                break;
            case "HOSTING":
                this.manager.isHosting = true;
                break;
            case "JOINING":
                this.addPlayer(args[0], args[1]);
                break;
            default:
                console.log("UNKNOWN TYPE")
        }
    }


    updatePlayers = (players) => {

    }

    addPlayer = (id, name) => {
        this.props.addPlayer(id, name);
    }

    removePlayer = (id) => {
        this.props.removePlayer(id);
    }

    renderScene = () => {
        //update
        requestAnimationFrame(this.renderScene);
        this.manager.update();
    }

    render() {
        return (
            <div className="container">
                <div className="wrapper">
                    <div style={{ backgroundColor: "black" }} ref={this.canvasMountRef}></div>
                </div>
            </div>
        )
    }
}

export default App;
