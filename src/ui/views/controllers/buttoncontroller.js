import React, { PureComponent } from 'react'
import classes from './controller.module.css';
import nipplejs from 'nipplejs'

export default class Controller extends PureComponent {

    constructor() {
        super();
        this.shootRef = React.createRef();
        this.leftControllerRef = React.createRef();
        this.switchRef = React.createRef();
        this.nippleMount = React.createRef();
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
    }

    componentDidMount = () => {
        this.handleNipple();

        if (window.screen && window.screen.orientation) {
            window.screen.orientation.lock('landscape').catch((error) => {});
        }
        
        window.scrollTo(0,1);
        var shootButton = this.shootRef.current;
        var switchButton = this.switchRef.current;
    
        var sendShoot = () => { this.props.send("SHOOT"); }
        var sendSwitch = () => { this.props.send("SWITCH" ); }
        var endShoot = () => { shootButton.style.color = "black"; }
        var endSwitch = () => { switchButton.style.color = "black"; }

        const touchStartShoot = (e) => {
            e.preventDefault();
            shootButton.style.color = "white";
            sendShoot();
        }

        const touchStartSwitch = (e) => {
            e.preventDefault();
            switchButton.style.color = "white";
            sendSwitch();
        }
    
        shootButton.addEventListener("touchstart", touchStartShoot, false);
        switchButton.addEventListener("touchstart", touchStartSwitch, false);
        switchButton.addEventListener("touchend", endSwitch, false);
        shootButton.addEventListener("touchend", endShoot, false);
        shootButton.addEventListener("click", sendShoot, false);
        switchButton.addEventListener("click", sendSwitch, false);
    }

    render() {
        return(
            <div className={classes.container}>
                <div ref={this.leftControllerRef} className={classes.left_controller}></div>
                <div className={classes.right_controller}>
                    <button ref={this.shootRef} className={classes.button} id="shoot">A</button>
                    <button ref={this.switchRef} className={classes.button} id="switch">B</button>
                </div>
            </div>
        )
    }
}

