import React, { Component } from 'react';
import * as THREE from 'three'
import Manager from './manager'
import './App.css';
import Controller from './networking/server';
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
  }

  componentDidMount() {
    // Threejs renderer set-up
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setClearColor('#000000');
    this.renderer.setSize(this.width, this.height);
    this.canvasMountRef.current.appendChild(this.renderer.domElement);
    this.manager = new Manager(this.renderer);
    this.controller = new Controller(this.port, this.manager, this.updateState);
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
          this.manager.addPlayer(args[0], args[1]);
          break;
        default:
          console.log("UNKNOWN TYPE")
      }
  }

  updatePlayers = (players) => {
    let p1 = Object.assign({}, this.state.players);
    Object.keys(this.manager.players).forEach(key => {
      let player = this.manager.players[key];
      p1[player.id] = {name:player.name,  score:player.score} 
    })
    this.setState({players: p1});
  }

  removePlayer = (id) => {

    this.manager.removePlayer(id)
    let p1 = Object.assign({}, this.state.players);
    delete p1[id];
    this.setState({players: p1});
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
          <div style={{ display: this.state.encoding ? "none" : "" }} ref={this.canvasMountRef}></div>
          <ScoreBoard players={this.state.players}></ScoreBoard>
        </div>
      </div>
    );
  }
}

export default App;