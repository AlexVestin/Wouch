import React, { PureComponent } from 'react'
import classes from './grid.module.css';

import image1 from './images/1.jpg'
import image2 from './images/2.jpg'
import SwipeButton from '../../components/swipebutton'

export default class Grid extends PureComponent {
    render() {
        return (
            <div className={classes.container}>
                <div className={classes.itemOne}>
                    <div className={classes.itemContainer} style={{backgroundColor: "#016FB9"}}>
                        <div className={classes.title} style={{backgroundColor: "#EC4E20"}}> Phone stuff</div>
                        <div className={classes.description}> 
                            Description description descriptiondescription description description description description description,
                           
                    
                        </div>
                        <SwipeButton className={classes.button}>Hello</SwipeButton>
        
                    </div>
                </div>


                <div className={classes.itemTwo}>
                    <img className={classes.image} src={image1} alt="game"></img>
                </div>

                <div className={classes.itemThree}>
                    <div className={classes.itemContainer} style={{backgroundColor: "#FF9505"}}>
                        <div className={classes.title} style={{backgroundColor: "#86BBD8"}}>Local Couch Play</div>
                        <div className={classes.description}>

                            Description description descriptiondescription description description description description description,
                            on description 
                        </div>

                        <SwipeButton className={classes.button}>Hello</SwipeButton>
                    </div>
                </div>
                <div className={classes.itemFour}>
                    <img className={classes.image} src={image2} alt="game"></img>
                </div>


                <div className={classes.itemFive}>
                    <div className={classes.itemContainer} style={{backgroundColor: "#EC4E20"}}>
                        <div className={classes.title} style={{backgroundColor: "#9BC53D"}}>Tutorial or something</div>
                        <div className={classes.description}>
                            Description description descriptiondescription description description description description description,
                            on descript
                        </div>

                        <SwipeButton className={classes.button}>Hello</SwipeButton>
                    </div>
                    
                </div>

                <div className={classes.itemSix}>
                    <img className={classes.image} src={image1} alt="game"></img>
                </div>
            </div>
        )
    }
}
