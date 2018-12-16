import React, { PureComponent } from 'react'
import { Redirect } from 'react-router-dom'
import classes from './mosaic.module.css'
import photo1 from './stock/1.jpg'
import photo2 from './stock/2.jpg'
import photo3 from './stock/3.jpg'
import photo4 from './stock/4.jpg'
import photo5 from './stock/5.jpg'
import photo6 from './stock/6.jpg'
import photo7 from './stock/7.jpg'
import photo8 from './stock/8.jpg'
import photo9 from './stock/9.jpg'

import Image from './image'


export default class MosaicList extends PureComponent {
    state = { redirect: false, to: ""}
    load = (game) => {
        fetch("http://3.8.115.45/getroom", {
            method: "POST",
            body: game
        }).then((response) => {
            return response.text(); 
        }).then((text) => {
            this.setState({redirect: true, port: text, to: game});
        });
    }
    render() {
        if(this.state.redirect) {
            return <Redirect to= {"/game?type=" + this.state.to + "&room="+this.state.port}></Redirect> 
        }

        const desc1 = "short description of game";
        return (
            <div className={classes.container}>
                <div className={classes.row}>
                    <Image onClick={() => this.load("charged")} gameTitle={"Charged"} gameDesc={desc1} className={classes.photo} src={photo1} alt="la"></Image>
                    <Image onClick={() => this.load("pokemon")} gameTitle={"Pokemon"} gameDesc={desc1} className={classes.photo} src={photo2} alt="la"></Image>
                    <Image gameTitle={"Game3"} gameDesc={desc1} className={classes.photo} src={photo3} alt="la"></Image>
                </div>

                <div className={classes.row}>
                    <Image gameTitle={"Game4"} gameDesc={desc1} className={classes.photo} src={photo4} alt="la"></Image>
                    <Image gameTitle={"Game5"} gameDesc={desc1} className={classes.photo} src={photo5} alt="la"></Image>
                    <Image gameTitle={"Game6"} gameDesc={desc1} className={classes.photo} src={photo6} alt="la"></Image>
                </div>

                <div className={classes.row}>
                    <Image gameTitle={"Game7"} gameDesc={desc1} className={classes.photo} src={photo7} alt="la"></Image>
                    <Image gameTitle={"Game8"} gameDesc={desc1} className={classes.photo} src={photo8} alt="la"></Image>
                    <Image gameTitle={"Game9"} gameDesc={desc1} className={classes.photo} src={photo9} alt="la"></Image>
                </div>


            </div>
        )
    }
}
