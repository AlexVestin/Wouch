import React, { PureComponent } from 'react'
import classes from './controller.module.css';
import nipplejs from 'nipplejs'

export default class Controller extends PureComponent {

    constructor() {
        super();

        this.open = false;
        this.messageQueue = [];
        this.shootRef = React.createRef();
        this.leftControllerRef = React.createRef();
        this.switchRef = React.createRef();
        this.nippleMount = React.createRef();
    }

    sendMessage = () => {
        if(this.open && this.messageQueue.length > 0) {
            this.send(this.messageQueue[this.messageQueue.length - 1]);
            this.messageQueue = [];
            
        }
    }

    send = (msg) => {
        this.exampleSocket.send(msg);
    }

    openSocket = () => {
        var url = new URL(window.location.href);
        var c = url.searchParams.get("nick");
        var port = url.searchParams.get("room");
        this.exampleSocket = new WebSocket("ws:3.8.115.45:" + port);

        this.exampleSocket.onopen = () => {
            this.send("CLIENT");
            this.send(c ? ";" + c : ";rando");
            this.open = true;
        }
    }
 
    handleNipple = () => {
        var optionsLeft = {
            zone: this.leftControllerRef.current,
            mode: 'static',
            position: {left: '50%', top: '50%'}
        }
        this.managerLeft = nipplejs.create(optionsLeft);
        this.managerLeft.on('start', () => {
            if (this.open) {
                this.send("LEFTSTART");
            }
        }).on('end', () => {
            if (this.open) {
                this.send("LEFTEND");
            }
        }).on('move', (evt, data) => {
            if (this.open) {
                let str = "*" + data.angle.radian.toString().substring(0, 4);
                this.messageQueue.push(str);                
            }
        });
    }

    componentDidMount = () => {
        this.openSocket();
        this.handleNipple();

        if (window.screen) {
            if(window.screen.orientation)
                window.screen.orientation.lock('landscape').catch(function(error) {
                    // whatever
                });
        }
        
        window.scrollTo(0,1);


        var shootButton = this.shootRef.current;
        var switchButton = this.switchRef.current;
    
        var sendShoot = () => { this.send("SHOOT"); }
        var sendSwitch = () => { this.send("SWITCH" ); }
        var endShoot = () => { shootButton.style.color = "black"; console.log("???")}
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
        setInterval(this.sendMessage, 25);
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

