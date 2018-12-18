import React, { Component } from 'react';
import * as THREE from 'three'
import Manager from './manager'
import './App.css';
import Controller from './networking/receiver';
import ScoreBoard from '../../scoreboard';


class App extends Component {
  constructor(props) {
    super(props);
    this.width = 800;
    this.height = 800;

    this.state = {players: {} };
    this.canvasMountRef = React.createRef();
    this.sendGameInfoCounter = 60;

    var url = new URL(window.location.href);
    this.port = url.searchParams.get("room");


    this.settings = {
      nrComp: {value: 2, type: "increment buttons", min: 0, max: 30},
      gameSpeed: {value: 0.15, type: "slider", min:0.05, max: 0.45, step:0.05},
      friction: {value: 3, type: "slider", min: 0, max: 10}
    }
  }

  createTextCanvas = () => {
    this.textCanvas = document.createElement("canvas");
    this.textCanvas.width = this.width;
    this.textCanvas.height = this.height;
    this.textCanvas.setAttribute("style", "position:absolute;")
    this.canvasMountRef.current.appendChild(this.textCanvas);
    this.textCanvasCtx = this.textCanvas.getContext("2d");
  }

  componentDidMount() {
    // Threejs renderer set-up
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setClearColor('#000000');
    this.renderer.setSize(this.width, this.height);
    this.createTextCanvas()
    this.canvasMountRef.current.appendChild(this.renderer.domElement);
   
    
    this.manager = new Manager(this.renderer, this.textCanvasCtx);
    this.controller = new Controller(this.port, this.manager, this.updateState);
  }

  updateSetting = (key, value) =>{
    switch(key){
      case "nrComp":
        this.manager.updateNrComputers(value);
        break;
      case "gameSpeed":
        this.manager.physicsEngine.dt = value;
        break;
      case "friction":
        this.manager.physicsEngine.friction = value;
        break;
      default:
        console.log("unknown setting type")
    }
  }

  updateState = (msg, args) => {
      switch(msg) {
        case "SOCKET_OPEN":
          this.renderScene();
          break;
        case "UPDATE_GAME":
          this.manager.update(args);
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

  updatePlayers = () => {
    let p1 = {};
    Object.keys(this.manager.players).forEach(key => {
      let player = this.manager.players[key];
      p1[player.id] = {name:player.name,  score:player.score, color: player.color} 
    })
    this.setState({players: p1});
  }

  addPlayer = (id, name) => {
    this.manager.addPlayer(id, name);
    this.props.addPlayer(id, name);
  }

  removePlayer = (id) => {

    this.manager.removePlayer(id)
    let p1 = Object.assign({}, this.state.players);
    delete p1[id];
    this.setState({players: p1});

    this.props.removePlayer(id);
  }

  renderScene = () => {
    if(this.manager.isHosting && this.sendGameInfoCounter <= 0) {
      this.updatePlayers();
      this.sendGameInfoCounter = 10;
    }

    this.sendGameInfoCounter -= 1
    this.manager.update();
    this.manager.render(this.renderer);
    requestAnimationFrame(this.renderScene);
  }

  render() {
    return (
      <div className="container">
        <div className="wrapper">
          <div ref={this.canvasMountRef}></div>
          <ScoreBoard settings={this.settings} updateSetting={this.updateSetting} players={this.state.players}></ScoreBoard>
        </div>
      </div>
    );
  }
}

export default App;
