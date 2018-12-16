import React, { PureComponent } from 'react'
import MosaicList from './mosaic';
import classes from './games.module.css';

export default class Games extends PureComponent {
  render() {
    return (

        <div className={classes.container}>

            <div className={classes.title}>
                Games
            </div>
        
            <div className={classes.listContainer}>
                <MosaicList></MosaicList>
            </div>
      </div>
    )
  }
}

