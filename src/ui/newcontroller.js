import React, {PureComponent} from "react";
import  {Redirect} from 'react-router-dom';
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

class Join extends PureComponent {
    
    constructor(props) {
        super(props)
        this.roomRef = React.createRef();
        this.nickRef = React.createRef();
        this.state = {to: "", redirect: false, port: 0}
    }

    redirectGame = () => {
        fetch("http://3.8.115.45/getroom").then((response) => {
            return response.text(); 
        }).then((text) => {
            this.setState({redirect: true, port: text, to: "game"});
        });
    }

    redirectCont = () => this.setState({redirect: true, to: "controller", port: this.roomRef.current.getValue()});

    render() {
        const contStyle = {...bootstrapButtonStyle,textTransform:"none", backgroundColor: '#F32E06', borderColor: '#F32E06'}

        if(this.state.redirect) {
            return <Redirect to={this.state.to + "?room=" + this.state.port + "&nick=" + this.nickRef.current.getValue()}></Redirect>
        }

        return (
            <div className={classes.container}> 
                <div className={classes.pageWrapper}>
                    <div className={classes.pageTitle}>
                            wouch
                        </div>

                    <div className={classes.wrapper}>

                        <form className={classes.form} onSubmit={this.submit}>        
                            <TextInput fullwidth ref={this.nickRef} className={classes.input} type="text" label="nickname"></TextInput>
                            <TextInput ref={this.roomRef} className={classes.input} type="number" label="room code"></TextInput>
                            <Button style={contStyle} className={classes.socbutton} onClick={this.redirectCont}>Join</Button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}
 
export default Join;