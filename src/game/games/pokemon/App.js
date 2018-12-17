
import React, { Component } from 'react';
import Manager from './manager'
import './App.css';
//import Controller from './controller.js/controller';
//import Controller from './controller'
import * as PIXI from 'pixi.js';


class App extends Component {
  constructor(props) {
    super(props);
    this.width = 1080;
    this.height = 720;

    this.state = {players: {} };
    this.canvasMountRef = React.createRef();
  }


  componentDidMount() {



    this.manager = new Manager(this.renderer, this.updatePlayers);
    //this.controller = new Controller(this.manager, this.updatePlayers, this.removePlayer);
  
    // Threejs renderer set-up
    var app = new PIXI.Application(this.width, this.height, {backgroundColor : 0x1099bb});
    this.canvasMountRef.current.appendChild(app.view);
    //document.body.appendChild(app.view);
    
    // create a new Sprite from an image path
    this.bunny = PIXI.Sprite.fromImage('img/pokemon_background.png')
    
    // center the sprite's anchor point
    this.bunny.anchor.set(0.5);
    
    // move the sprite to the center of the screen
    this.bunny.x = app.screen.width / 2;
    this.bunny.y = app.screen.height / 2;
    
    app.stage.addChild(this.bunny);
    
    // Listen for animate update
  
    this.renderScene();
  }

  updatePlayers = (players) => {
    let p1 = Object.assign({}, this.state.players);
    Object.keys(players).forEach(key => {
      p1[key] = players[key]; 
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
    //sthis.manager.update();
    //this.bunny.rotation += 0.1;
    requestAnimationFrame(this.renderScene);
  }

  render() {
    return (
      <div className="container">
        <div className="wrapper">
          <div style={{ display: this.state.encoding ? "none" : "" }} ref={this.canvasMountRef}></div>
        </div>
      </div>
    );
  }
}

export default App;

