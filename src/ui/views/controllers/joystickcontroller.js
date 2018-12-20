import React, { PureComponent } from 'react'
import classes from './controller.module.css';
import nipplejs from 'nipplejs'

export default class Controller extends PureComponent {

    constructor() {
        super();
        this.leftControllerRef = React.createRef();
        this.rightControllerRef = React.createRef();
    }

    handleNipple = () => {
        var optionsLeft = {
            zone: this.leftControllerRef.current,
            mode: 'static',
            position: {left: '40%', top: '60%'}
        }
        this.managerLeft = nipplejs.create(optionsLeft);
        this.managerLeft.on('start', () => {
            this.props.send("LEFTSTART");            
        }).on('end', () => {
            this.props.send("LEFTEND");
        }).on('move', (evt, data) => {
            let str = "*" + data.angle.radian.toString().substring(0, 4);
            this.props.addMessage(str);            
        });

        var optionsRight = {
            zone: this.rightControllerRef.current,
            mode: 'static',
            position: {left: '60%', top: '60%'}
        }
        this.managerRight = nipplejs.create(optionsRight);
        this.managerRight.on('start', () => {
            this.props.send("RIGHTSTART");            
        }).on('end', () => {
            this.props.send("RIGHTEND");
        }).on('move', (evt, data) => {
            let str = "*" + data.angle.radian.toString().substring(0, 4);
            this.props.addMessage(str);            
        });
    }

    componentDidMount = () => {
        this.handleNipple();

        if (window.screen && window.screen.orientation) {
            window.screen.orientation.lock('landscape').catch((error) => {});
        }
        
        window.scrollTo(0,1);
    }

    render() {
        return(
            <div className={classes.container}>
                <div ref={this.leftControllerRef} className={classes.left_controller}></div>
                <div ref={this.rightControllerRef} className={classes.right_controller}></div>
            </div>
        )
    }
}

