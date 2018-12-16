import React, { PureComponent } from 'react'
import classes from './mosaic.module.css'

export default class Image extends PureComponent {
    constructor() {
        super()

        this.videoRef = React.createRef();
        this.videoMountRef = React.createRef();
    }
    componentDidMount = () => {
    }

    play = () => {
        console.log("play")
        this.videoRef.current.play()
    }

    pause = () => {
        console.log("pause")
        this.videoRef.current.pause()
    }
    render() {
        return (
            <div className={this.props.className} onClick={this.props.onClick}>

                <div className={classes.textGroup}>
                    <div className={classes.gameTitle}>{this.props.gameTitle}</div>
                    <div className={classes.gameDescription}>{this.props.gameDesc}</div>
                </div>

                <div onMouseOver={this.play} onMouseOut={this.pause} className={this.props.className} ref={this.videoMountRef}>
                    <video loop ref={this.videoRef} className={classes.photo} src={this.props.src}></video>
                </div>
            </div>
        )
    }
}
