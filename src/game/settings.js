import React, { PureComponent } from 'react'
import classes from './settings.module.css';

export default class Setting extends PureComponent {
  
    constructor(props) {
        super(props);
        this.state = {value: props.item.value}
    }

    update = (value) => {
        const { min, max } = this.props.item; 

        if(value < min) {
            return
        }

        if(value > max) {
            return
        }

        this.setState({value})
        this.props.updateValue(this.props.name, Number(value))
    }

    increment = () => this.update(this.state.value + 1)
    decrement = () => this.update(this.state.value - 1)
    slide = (e) => this.update(e.target.value);

    render() {
        const { type, min, max, step } = this.props.item;
        let s = step ? step : 1;

        return (
        <div>
            {type === "increment buttons" && 
                <div className={classes.buttonGroup}>
                    <button onClick={this.decrement}>-</button>
                    <div>
                        {this.state.value}
                    </div>
                    <button onClick={this.increment}>+</button>
                    
                </div>
            }
            {type === "slider" && 
                <input className={classes.slider} type="range" min={min} max={max} value={this.state.value} onChange={this.slide} step={s}/>
            }
        </div>
        )
    }
}
