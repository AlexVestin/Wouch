import React, { PureComponent } from 'react'
import classes from './button.module.css';

export default class button extends PureComponent {
  render() {
    return (
      <div className={classes.draw_border} onClick={this.props.onClick} style={{color: this.props.color, boxShadow: "inset 0 0 0 4px " + this.props.color}} >
        <button className={classes.btn}>
          {this.props.children}
        </button>
      </div>
    )
  }
}
