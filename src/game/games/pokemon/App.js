import React, { Component } from 'react';
import * as THREE from 'three'
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
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setClearColor('#000000');
        this.renderer.setSize(this.width, this.height);
        this.canvasMountRef.current.appendChild(this.renderer.domElement);
        this.manager = new Manager(this.renderer);
        this.controller = new Controller(this.port, this.manager, this.updateState);
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

    }

    removePlayer = (id) => {

    }

    renderScene = () => {
        //update
        requestAnimationFrame(this.renderScene);
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
