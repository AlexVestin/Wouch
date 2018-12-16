import React, {PureComponent} from 'react'
import './scoreboard.css';

export default class ScoreBoard extends PureComponent {

    render() {
        const players = this.props.players;
        console.log(players);
        return(
            <div className="list">
                    <div className="header">
                        Players
                    </div>
                    {Object.keys(players).map(key => {
                        const name = players[key].name
                        return (
                            <div key={players[key].id} className="item">
                                <div className="name">
                                    {name.substr(0,7) + (name.length > 7 ? "..." : "")}
                                </div>
                                |
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