import React, {PureComponent} from "react";
import  {Redirect} from 'react-router-dom';
import Button from '@material-ui/core/Button'
import classes from './newcontroller.module.css';
import TextInput from '../../components/textinput'
import Background from '../../background'


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
        this.state = {to: "", redirect: false, port: 0, controller: ""}
    }


    requestController = () => {
        return new Promise((resolve, reject) => {
            fetch("http://3.8.115.45/getcontroller",  {
                method: "POST",
                body: this.roomRef.current.getValue()
            }).then((response) => {
                return response.text(); 
            }).then((text) => {
                if(text !== "No such room") {
                    resolve(text);
                }else {
                    alert("Couldn't find room with that id");
                }
                
            });
        })
    }

    redirectCont = () =>  {
        this.requestController().then(controllerText => {
            this.setState({redirect: true, to: "controller", controller: controllerText, port: this.roomRef.current.getValue()})
        })
    };

    render() {
        const contStyle = {...bootstrapButtonStyle,textTransform:"none", backgroundColor: '#F32E06', borderColor: '#F32E06'}

        if(this.state.redirect) {
            const { to, controller, port} = this.state;
            window.history.pushState(null, null, '/join');
            return <Redirect to={to + "?room=" + port + "&nick=" + this.nickRef.current.getValue() +"&controller=" + controller}></Redirect>
        }

        return (
            <div className={classes.container}>
                <div style={{height: "calc(100%-100px)", width: "100%", backgroundColor: "rgb(46, 81, 240)", position: "absolute", top:0, left:0,zIndex:1000000}}></div>
                <div className={classes.pageWrapper}>


                    <div className={classes.wrapper}>
                        <div className={classes.form} >        
                            <TextInput ref={this.roomRef} className={classes.input} type="number" label="room code"></TextInput>
                            <TextInput ref={this.nickRef} className={classes.input} type="text" label="Nickname"></TextInput>
                            <Button style={contStyle} className={classes.socbutton} onClick={this.redirectCont }>Join</Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
 
export default Join;