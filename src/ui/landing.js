import React, {PureComponent} from "react";
import  {Redirect} from 'react-router-dom';
import Button from '@material-ui/core/Button'
import classes from './landing.module.css';

const bootstrapButtonStyle = {
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10,
    boxShadow: 'none',
    color: "white",
    fontSize: 16,
    padding: '6px 12px',
    border: '1px solid',
    backgroundColor: '#007bff',
    borderColor: '#007bff',
    height: 25
}

class App extends PureComponent {
    
    constructor(props) {
        super(props)
        this.state = {to: "", redirect: false, port: 0}
    }

    redirectGame = () => this.setState({redirect: true, to: "games"});
    redirectCont = () => this.setState({redirect: true, to: "join"});

    render() {
        if(this.state.redirect) {
            return <Redirect to={this.state.to}></Redirect>
        }
        
        const hostStyle = {...bootstrapButtonStyle,textTransform:"none", backgroundColor: '#3B5998', borderColor: '#3B5998'}
        const contStyle = {...bootstrapButtonStyle,textTransform:"none", backgroundColor: '#F32E06', borderColor: '#F32E06'}

        return (
        <div className={classes.container}>
            <div className={classes.pageWrapper}>
                <div className={classes.pageTitle}>
                        wouch
                    </div>

                <div className={classes.wrapper}>
                    <form className={classes.form} onSubmit={this.submit}>        
                        <Button style={hostStyle} className={classes.socbutton} onClick={this.redirectGame}>Host room</Button>
                        <Button style={contStyle} className={classes.socbutton} onClick={this.redirectCont}>Join room</Button>
                    </form>
                </div>
            </div>
        </div>
        )
    }
}
 
export default App;