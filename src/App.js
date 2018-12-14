import React, { Component } from 'react';
import * as THREE from 'three'
import Manager from './game/manager'
import './App.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.width = 640;
    this.height = 480;

    this.state = {encoderLoaded: false, encoding: false, frames: 0}; 

    this.manager = new Manager()
    this.canvasMountRef = React.createRef();
  }


  componentDidMount() {
    // Threejs renderer set-up
    this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    this.renderer.setClearColor('#000000');
    this.renderer.setSize(this.width, this.height);
    this.canvasMountRef.current.appendChild(this.renderer.domElement);
    this.exampleSocket = new WebSocket("ws:3.8.115.45:8000");
    this.rotation = 0;
    
    this.exampleSocket.onopen = () => {
      this.exampleSocket.send("SERVER");
    }

    this.exampleSocket.onmessage = (e) => {
      if(String(e.data[3]) === "*") {
        let id = e.data.substr(0, 2);
        let msg = e.data.substr(2);
        this.manager.players[id].rotation = Number(msg);
      }else if(String(e.data).includes("LEFTSTART")) {
        let id = e.data.substr(0, 2);
        this.manager.players[id].joystick_down = true;
        console.log("LEFT DOWN", this.manager.players[id])
      }else if(String(e.data).includes("LEFTEND")) {
        let id = e.data.substr(0, 2);
        this.manager.players[id].joystickDown = false;
    }else if(String(e.data[0]) === ";") {
        let msg = e.data.substr(1).split("-");
        let id = msg[0];
        let name = msg[1];
        this.manager.addPlayer(id, name);
       
    }
    }

  }

  renderScene = () => {
      this.manager.update(this.renderer);
      requestAnimationFrame(this.renderScene);
  }

  render() {
    return (
      <div className="container">
        <div style={{marginTop: 20, display: this.state.encoding ? "none" : ""}} ref={this.canvasMountRef}></div>
      </div>
    );
  }
}

export default App;
