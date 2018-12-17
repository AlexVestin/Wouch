import React, { PureComponent } from 'react'
import Charged from './games/charged/App'
import Pokemon from './games/pokemon/App'

export default class GameContainer extends PureComponent {

    state = {gamePath: ""}
    componentDidMount() {
        var url = new URL(window.location.href);
        this.setState({gamePath: url.searchParams.get("type")})
    }
      render() {
        return (
          <div style={{width: "100%", height: "calc(100% - 50px)"}}>
            {this.state.gamePath === "charged" && <Charged></Charged>}
            {this.state.gamePath === "pokemon" && <Pokemon></Pokemon>}
          </div>
        )
  }
}
