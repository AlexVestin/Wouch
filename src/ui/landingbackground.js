import React, { PureComponent } from 'react'
import classes from './landingbackground.module.css'

// ATTRIBUTE https://codepen.io/okra/pen/nlsJL

export default class landingbackground extends PureComponent {

    constructor() {
        super()
        this.myWidth = 0;
        this.myHeight = 0;
        this.mouseIsDown = false;
        this.mouseIsDownDivision = false;

        this.sunRef = React.createRef();
        this.starsRef = React.createRef();
        this.starsContainerRef = React.createRef(); 
        this.sunSetRef = React.createRef();
        this.sunDayRef = React.createRef();
        this.skyRef = React.createRef();
        this.horizonRef = React.createRef();
        this.horizonNightRef = React.createRef();
        this.moonRef = React.createRef();
        this.mountainRef = React.createRef();
        this.mountainRangeRef = React.createRef();
        this.divisionRef = React.createRef();
        this.waterRef = React.createRef();
        this.waterReflectionContainerRef = React.createRef();
        this.waterReflectionMiddleRef = React.createRef();
        this.waterDistanceRef = React.createRef();
        this.darknessOverlaySkyRef = React.createRef();
        this.darknessOverlayRef = React.createRef();
        this.oceanRippleContainerRef = React.createRef();
        this.oceanRippleRef = React.createRef();
    }

    updateDimensions = () => {
        if (typeof (window.innerWidth) == 'number') {
            //Non-IE
            this.myWidth = window.innerWidth;
            this.myHeight = window.innerHeight;
        } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {

            this.myWidth = document.documentElement.clientWidth;
            this.myHeight = document.documentElement.clientHeight;
        } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {

            this.myWidth = document.body.clientWidth;
            this.myHeight = document.body.clientHeight;
        }
    }

    startMove = () => {
        this.mouseIsDown = true;
    }

    stopMove = () => {
        this.mouseIsDown = false;
        this.mouseIsDownDivision = false;
    }

    startDraggingDivision = () => {
        this.mouseIsDownDivision = true;
    }

    windowResize() {
        this.updateDimensions();
        var skyHeight = 0;
        // update to new sky height
        skyHeight = this.sunRef.current.clientHeight;
        this.waterDistance.current.style.height = this.myHeight - skyHeight;
        this.divisionRef.current.style.top = skyHeight;
    }


    update = (e) => {
        this.updateDimensions();

        let mouse = { x: 0, y: 0 }
        const myWidth = this.myWidth;
        const myHeight = this.myHeight;
        
        const startHeight = myHeight*4/16
        const divide = 1;
        if(!e) {
            mouse.x = myWidth/2;
            mouse.y = startHeight;
            
        }else {
            mouse.x = myWidth/2;
            mouse.y = startHeight + window.pageYOffset/divide || document.documentElement.scrollTop/divide;
        }

        if(mouse.y > 900){
            mouse.y = 900;
        }

        console.log(mouse.y)
       
        //if(mouseIsDown) {
        this.sunRef.current.style.background = '-webkit-radial-gradient(' + mouse.x + 'px ' + mouse.y + 'px, circle, rgba(242,248,247,1) 0%,rgba(249,249,28,1) 3%,rgba(247,214,46,1) 8%, rgba(248,200,95,1) 12%,rgba(201,165,132,1) 30%,rgba(115,130,133,1) 51%,rgba(46,97,122,1) 85%,rgba(24,75,106,1) 100%)';
        this.sunRef.current.style.background = '-moz-radial-gradient(' + mouse.x + 'px ' + mouse.y + 'px, circle, rgba(242,248,247,1) 0%,rgba(249,249,28,1) 3%,rgba(247,214,46,1) 8%, rgba(248,200,95,1) 12%,rgba(201,165,132,1) 30%,rgba(115,130,133,1) 51%,rgba(46,97,122,1) 85%,rgba(24,75,106,1) 100%)';
        this.sunRef.current.style.background = '-ms-radial-gradient(' + mouse.x + 'px ' + mouse.y + 'px, circle, rgba(242,248,247,1) 0%,rgba(249,249,28,1) 3%,rgba(247,214,46,1) 8%, rgba(248,200,95,1) 12%,rgba(201,165,132,1) 30%,rgba(115,130,133,1) 51%,rgba(46,97,122,1) 85%,rgba(24,75,106,1) 100%)';

        this.sunDayRef.current.style.background = '-webkit-radial-gradient(' + mouse.x + 'px ' + mouse.y + 'px, circle, rgba(252,255,251,0.9) 0%,rgba(253,250,219,0.4) 30%,rgba(226,219,197,0.01) 70%, rgba(226,219,197,0.0) 70%,rgba(201,165,132,0) 100%)';
        this.sunDayRef.current.style.background = '-moz-radial-gradient(' + mouse.x + 'px ' + mouse.y + 'px, circle, rgba(252,255,251,0.9) 0%,rgba(253,250,219,0.4) 30%,rgba(226,219,197,0.01) 70%, rgba(226,219,197,0.0) 70%,rgba(201,165,132,0) 100%)';
        this.sunDayRef.current.style.background = '-ms-radial-gradient(' + mouse.x + 'px ' + mouse.y + 'px, circle, rgba(252,255,251,0.9) 0%,rgba(253,250,219,0.4) 30%,rgba(226,219,197,0.01) 70%, rgba(226,219,197,0.0) 70%,rgba(201,165,132,0) 100%)';

        this.sunSetRef.current.style.background = '-webkit-radial-gradient(' + mouse.x + 'px ' + mouse.y + 'px, circle, rgba(254,255,255,0.8) 5%,rgba(236,255,0,1) 10%,rgba(253,50,41,1) 25%, rgba(243,0,0,1) 40%,rgba(93,0,0,1) 100%)';
        this.sunSetRef.current.style.background = '-moz-radial-gradient(' + mouse.x + 'px ' + mouse.y + 'px, circle, rgba(254,255,255,0.8) 5%,rgba(236,255,0,1) 10%,rgba(253,50,41,1) 25%, rgba(243,0,0,1) 40%,rgba(93,0,0,1) 100%)';
        this.sunSetRef.current.style.background = '-ms-radial-gradient(' + mouse.x + 'px ' + mouse.y + 'px, circle, rgba(254,255,255,0.8) 5%,rgba(236,255,0,1) 10%,rgba(253,50,41,1) 25%, rgba(243,0,0,1) 40%,rgba(93,0,0,1) 100%)';

        this.waterReflectionContainerRef.current.style.perspectiveOrigin = (mouse.x / myWidth * 100).toString() + "% -15%";
        this.waterReflectionMiddleRef.current.style.left = (mouse.x - myWidth - (myWidth * .03)).toString() + "px";

        var bodyWidth = document.getElementsByTagName("body")[0].clientWidth;
        this.sunRef.current.style.width = (bodyWidth);
        this.sunRef.current.style.left = "0px";
        this.sunDayRef.current.style.width = (bodyWidth);
        this.sunDayRef.current.style.left = "0px";

        var sky = this.sunRef.current;
        var water = this.waterRef.current;
        var waterHeight = water.clientHeight;
        var skyHeight = sky.clientHeight;

        var skyRatio = mouse.y / skyHeight;
        var waterRatio = waterHeight / myHeight;
        this.darknessOverlayRef.current.style.opacity = Math.min((mouse.y - (myHeight / 2)) / (myHeight / 2), 1);
        this.darknessOverlaySkyRef.current.style.opacity = Math.min((mouse.y - (myHeight * 7 / 10)) / (myHeight - (myHeight * 7 / 10)), 1);
        this.moonRef.current.style.opacity = Math.min((mouse.y - (myHeight * 9 / 10)) / (myHeight - (myHeight * 9 / 10)), 0.65);
        this.horizonNightRef.current.style.opacity = (mouse.y - (myHeight * 4 / 5)) / (myHeight - (myHeight * 4 / 5));
        this.starsContainerRef.current.style.opacity = (mouse.y / myHeight - 0.6);
        this.waterDistanceRef.current.style.opacity = (mouse.y / myHeight + 0.6);
        this.sunDayRef.current.style.opacity = (1 - mouse.y / myHeight);
        this.skyRef.current.style.opacity = Math.min((1 - mouse.y / myHeight), 0.99);
        this.sunSetRef.current.style.opacity = (mouse.y / myHeight - 0.2);

        if (mouse.y > 0) {
            var clouds = document.getElementsByClassName("cloud");
            for (var i = 0; i < clouds.length; i++) {
                clouds[i].style.left = Math.min(myWidth * (Math.pow(mouse.y, 2) / Math.pow(myHeight / 2, 2)) * -1, 0);
            }
            //}

            var stars = document.getElementsByClassName('star');
            for (var i = 0; i < stars.length; i++) {
                stars[i].style.opacity = (mouse.y / myHeight - 0.6);
            }


            if (mouse.y > myHeight / 2) {
                this.sunRef.current.style.opacity = Math.min((myHeight - mouse.y) / (myHeight / 2) + 0.2, 0.5);
                this.horizonRef.current.style.opacity = (myHeight - mouse.y) / (myHeight / 2) + 0.2;

                this.waterReflectionMiddleRef.current.style.opacity = (myHeight - mouse.y) / (myHeight / 2) - 0.1;
            } else {
                this.horizonRef.current.style.opacity = Math.min(mouse.y / (myHeight / 2), 0.99);

                this.sunRef.current.style.opacity = Math.min(mouse.y / (myHeight / 2), 0.5);
                this.waterReflectionMiddleRef.current.style.opacity = mouse.y / (myHeight / 2) - 0.1;
            }

        } else if (this.mouseIsDownDivision) {
            var sunElement =this.sunRef.current;
            var water = this.waterRef.current;
            var division = this.divisionRef.current;
            sunElement.style.height = (mouse.y).toString() + "px";
            this.sunDayRef.current.style.height = (mouse.y).toString() + "px";
            division.style.top = (mouse.y).toString() + "px";
            var waterHeight = myHeight - mouse.y;
            water.style.height = waterHeight.toString() + "px";

            this.sunRef.current.style.height = (mouse.y).toString() + "px";
            this.sunDayRef.current.style.height = (mouse.y).toString() + "px";

            this.horizonRef.current.style.height = 0;

            //this.horizonRef.current.style.height = (mouse.y).toString() + "px";
            this.waterDistanceRef.current.style.height = (myHeight - mouse.y).toString() + "px";
            this.oceanRippleContainerRef.current.style.height = (myHeight - mouse.y).toString() + "px";
            this.darknessOverlayRef.current.style.height = (myHeight - mouse.y).toString() + "px";
        }
    };

    componentWillUnmount() {
        document.removeEventListener("scroll", this.update, false) 
    }
    componentDidMount() {
       this.update()
       document.addEventListener("scroll", this.update, false)
    }
    render() {
        return (
            <div >
                <div style={{left: 0, top: 0, opacity: 0.6,backgroundColor: "#3883ff", width: "100%", height: "100%", position: "absolute", zIndex: -1}}>.</div>
                <div className={classes.container}></div>
                <div ref={this.starsContainerRef} className={classes.starContainer} onMouseDown={this.startMove} onMouseUp={this.stopMove}>
                    <div ref={this.starsRef} className={classes.stars} onMouseDown={this.startMove} onMouseUp={this.stopMove}>
                    </div>
                </div>

                <div ref={this.sunRef} className={classes.sun} onMouseDown={this.startMove} onMouseUp={this.stopMove}></div>

                <div ref={this.sunDayRef} className={classes.sunDay} onMouseDown={this.startMove} onMouseUp={this.stopMove}> </div>

                <div ref={this.sunSetRef} className={classes.sunSet} onMouseDown={this.startMove} onMouseUp={this.stopMove}></div>

                <div ref={this.skyRef} className={classes.sky} onMouseDown={this.startMove} onMouseUp={this.stopMove}></div>

                <div className="star" style={{left: 250, top: 30}}></div>
                <div className="star" style={{left: 300, top: 25}}></div>
                <div className="star" style={{right: 40, top: 40}} ></div>
                <div className="star" style={{right: 80, top: 40}} ></div>
                <div className="star" sstyle={{right: 120, top: 20}} ></div>

                <div ref={this.horizonRef} className={classes.horizon} onMouseDown={this.startMove} onMouseUp={this.stopMove}></div>

                <div ref={this.horizonNightRef} className={classes.horizonNight} onMouseDown={this.startMove} onMouseUp={this.stopMove}></div>

                <div ref={this.moonRef} className={classes.moon} onMouseDown={this.startMove} onMouseUp={this.stopMove}></div>

                <div ref={this.mountainRangeRef} className={classes.mountainRange}>
                    <div ref={this.mountainRef} className={classes.mountain} onMouseDown={this.startMove} onMouseUp={this.stopMove}></div>
                </div>

                <div ref={this.divisionRef} className={classes.division} onMouseDown={this.startDraggingDivision} onMouseUp={this.stopMove}></div>

                <div ref={this.waterRef} className={classes.water} onMouseDown={this.startMove} onMouseUp={this.stopMove}></div>

                <div ref={this.waterReflectionContainerRef} className={classes.waterReflectionContainer} onMouseDown={this.startMove} onMouseUp={this.stopMove}>
                    <div ref={this.waterReflectionMiddleRef} className={classes.waterReflectrionmiddle} onMouseDown={this.startMove} onMouseUp={this.stopMove}></div>
                </div>
                <div ref={this.waterDistanceRef} className={classes.waterDistance} onMouseDown={this.startMove} onMouseUp={this.stopMove}></div>
                <div ref={this.darknessOverlaySkyRef} className={classes.darknessOverLaySky} onMouseDown={this.startMove} onMouseUp={this.stopMove}></div>
                <div ref={this.darknessOverlayRef} className={classes.darknessOverlay}></div>
                <div ref={this.oceanRippleContainerRef} className={classes.oceanRippleContainer}></div>
                <div ref={this.oceanRippleRef} className={classes.oceanRipple}></div>
            </div>
        )
    }
}





/*
*/