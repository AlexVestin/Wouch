import React, {PureComponent} from 'react'
import classes from './scoreboard.module.css';
import Setting from './settings'
export default class ScoreBoard extends PureComponent {

    render() {
        const players = this.props.players;
        return(
            <div className={classes.list}>
                    <div className={classes.header}>
                        Players
                    </div>
                    {Object.keys(players).map(key => {
                        const name = players[key].name
                        const color = players[key].color
                        return (
                            <div key={key} className={classes.item}>
                                <div className={classes.name} style={{color: "rgb("+color[0]+","+color[1]+","+color[2]+")"}}>
                                    {name.substr(0,7) + (name.length > 7 ? "..." : "")}
                                </div>
                                
                                <div className={classes.score}>
                                    score: {players[key].score}
                                </div>
                            </div>
                        )
                    })}
                
                <div className={classes.settings}>
                    {Object.keys(this.props.settings).map(key => {
                        return(
                            <div key={key} className={classes.item}>
                                <div className={classes.name} >
                                    {key}
                                </div>
                                
                                <div className={classes.score}>
                                    <Setting updateValue={this.props.updateSetting} item={this.props.settings[key]} name={key}></Setting>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}