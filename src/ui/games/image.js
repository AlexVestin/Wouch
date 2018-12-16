import React, { PureComponent } from 'react'
import classes from './mosaic.module.css'

export default class Image extends PureComponent {

    render() {
    return (
        <div className={this.props.className} onClick={this.props.onClick}>
            
            <div className={classes.textGroup}>
                <div className={classes.gameTitle}>{this.props.gameTitle}</div>
                <div className={classes.gameDescription}>{this.props.gameDesc}</div>
            </div>
                  
          <img  className={this.props.className} src={this.props.src} alt="la"></img>
      </div>
    )
  }
}
