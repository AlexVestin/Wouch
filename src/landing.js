import React, {PureComponent} from "react";
import Button from '@material-ui/core/Button'
import classes from './landing.module.css';
import TextInput from './textinput'


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
    

    redirectGame = () => {
        fetch("")
        this.setState({redirect: true, redirectTo: "game"})
    
    }
    redirectCont = () => this.setState({redirect: true, redirectTo: "game"})


    render() {
        console.log(classes)
        const hostStyle = {...bootstrapButtonStyle,textTransform:"none", backgroundColor: '#3B5998', borderColor: '#3B5998'}
        const contStyle = {...bootstrapButtonStyle,textTransform:"none", backgroundColor: '#F32E06', borderColor: '#F32E06'}


        return (
        <div className={classes.container}>
            
            
            <div className={classes.pageWrapper}>
                <div className={classes.pageTitle}>
                        WOUCH
                    </div>

                <div className={classes.wrapper}>
 

                    <form className={classes.form} onSubmit={this.submit}>        
                        <Button style={hostStyle} className={classes.socbutton} onClick={this.redirectGame}>Host room</Button>
                        <div className={classes.joinGroup}>
                            <div>
                            <TextInput  ref={this.emailRef} className={classes.input} type="number" label="room code"></TextInput>
                            <Button style={contStyle} className={classes.socbutton} onClick={this.redirectCont}>Join a room</Button>
                            </div>
                        </div>
                        
                        
                
                    </form>
                </div>
            </div>
        </div>
        )
    }
}
 
export default App;