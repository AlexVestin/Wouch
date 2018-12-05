import React, { Component } from 'react';
import * as THREE from 'three'
import './App.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.width = 640;
    this.height = 480;

    this.state = {encoderLoaded: false, encoding: false, frames: 0}; 
    this.canvasMountRef = React.createRef();
  }

  get_end = (len) => {
    let end = "";
    for(var i = 0; i < 14 - len; i++) {
      end += "|";
    }
    return end;
  }

  componentDidMount() {
    // Threejs renderer set-up
    this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    this.renderer.setClearColor('#000000');
    this.renderer.setSize(this.width, this.height);
    this.canvasMountRef.current.appendChild(this.renderer.domElement);
    this.exampleSocket = new WebSocket("ws:127.0.0.1:8000");
    this.rotation = 0;
    
    this.exampleSocket.onopen = () => {
      this.exampleSocket.send("SERVER" + this.get_end("SERVER".length));
      this.open = true;
    }

    this.exampleSocket.onmessage = (evt) => {
      if(evt.data[1] === "*") {
        this.rotation = Number(evt.data.substr(2));        
      }else if(evt.data.includes("LEFTSTART")) {
        this.joystickDown = true;
      }else if(evt.data.includes("LEFTEND")) {
        this.joystickDown = false;
      }
    }

    this.setUpScene();
  }

  setUpScene = () => {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera();
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    
    this.cube = new THREE.Mesh( geometry, material );
    this.scene.add( this.cube );
    this.camera.position.z = 5;
    this.renderScene();
  }

  renderScene = () => {
    if(!this.state.encoding) {
      this.animate();
      requestAnimationFrame(this.renderScene);
    }
  }

  animate = () => {
    if(this.joystickDown) {
      this.cube.position.x += Math.cos(this.rotation) / 100;
      this.cube.position.y += Math.sin(this.rotation) / 100;
    }
    
    this.renderer.render(this.scene,this.camera);
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
