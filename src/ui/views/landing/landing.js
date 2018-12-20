import React, {PureComponent} from "react";
import  {Redirect} from 'react-router-dom';
import Button from '../../components/button'
import classes from './landing.module.css';

import Background from '../../background'
import Grid from './grid'
import Footer from './footer'


class App extends PureComponent {
    
    constructor(props) {
        super(props)
        this.state = {to: "", redirect: false, port: 0}
    }

    redirectGame = () => this.setState({redirect: true, to: "games"});
    redirectCont = () => this.setState({redirect: true, to: "join"});

    render() {
        if(this.state.redirect) {
            window.history.pushState(null, null, '/');
            return <Redirect to={this.state.to}></Redirect>
        }

        return (
            <React.Fragment>
                <div className={classes.container}>
                    
                    <div className={classes.pageWrapper}>
                        <div className={classes.pageTitle}></div>
                        <div className={classes.wrapper}>
                            <form className={classes.form} onSubmit={this.submit}>        
                                <Button color="#58afd1" onClick={this.redirectGame}>Host room</Button>
                                <div style={{marginTop: 40}}>
                                    <Button color="#875F9A" onClick={this.redirectCont}>Join room</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                    
                </div>
                
                <Background></Background>
                <div className={classes.divisionTitle}>Division Title</div>
                <Grid></Grid>
                <Footer></Footer>
            </React.Fragment>
        
        )
    }
}
 
export default App;


/*


*/