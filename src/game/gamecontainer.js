import React, { PureComponent } from 'react'
import Charged from './games/charged/App'
import Pokemon from './games/pokemon/App'
import KnockOff from './games/knockoff/App'

export default class GameContainer extends PureComponent {

  state = { gamePath: "" }
  componentDidMount() {
    var url = new URL(window.location.href);
    this.setState({ gamePath: url.searchParams.get("type") })
    this.players = {}
  }

  addPlayer = (id, name) => {
    this.players[id] = name;
  }

  removePlayer = (id) => {
    delete this.players[id];
  }

  render() {
    return (
      <div style={{ width: "100%", height: "calc(100% - 50px)" }}>
        {this.state.gamePath === "charged" && <Charged addPlayer={this.addPlayer} removePlayer={this.removePlayer}></Charged>}
        {this.state.gamePath === "knockoff" && <KnockOff addPlayer={this.addPlayer} removePlayer={this.removePlayer}></KnockOff>}
        {this.state.gamePath === "pokemon" && <Pokemon addPlayer={this.addPlayer} removePlayer={this.removePlayer}></Pokemon>}
      </div>
    )
  }
}
