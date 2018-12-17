import React, {PureComponent} from 'react'
import './scoreboard.css';

export default class ScoreBoard extends PureComponent {

    render() {
        const players = this.props.players;
        return(
            <div className="list">
                    <div className="header">
                        Players
                    </div>
                    {Object.keys(players).map(key => {
                        const name = players[key].name
                        const color = players[key].color
                        return (
                            <div key={key} className="item">
                                <div className="name" style={{color: "rgb("+color[0]+","+color[1]+","+color[2]+")"}}>
                                    {name.substr(0,7) + (name.length > 7 ? "..." : "")}
                                </div>
                                
                                <div className="score">
                                    score: {players[key].score}
                                </div>
                            </div>
                        )
                    })}

            </div>
        )
    }
}