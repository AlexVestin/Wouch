import React, { PureComponent } from 'react'
import classes from './swipebutton.module.css';

export default class SwipeButton extends PureComponent {
  render() {
    return (
        <a className={classes.btn1}>
            <span >{this.props.children}</span>
        </a>
      
    )
  }
}
