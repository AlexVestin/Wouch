import React from 'react'
import classes from './withheader.module.css'
import { Redirect } from 'react-router-dom'

export default function logProps(WrappedComponent) {
    return class extends React.Component {
      state = {redirect: false}

      redirect = () => this.setState({redirect: true})
      render() {

        if(this.state.redirect){
            return <Redirect to="/"></Redirect>
        }
            
        return (
            <div className={classes.container}>
                <header className={classes.header}>
                    <div className={classes.title} onClick={this.redirect}>WOUCH</div>
                </header>
                <WrappedComponent {...this.props} />
            </div>
        );
      }
    }
  }