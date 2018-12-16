import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css'
import Landing from './ui/landing'
import GameContainer from './game/gamecontainer'
import Join from './ui/newcontroller'
import ControllerContainer from './ui/controllers/controllercontainer'
import Games from './ui/games/games'

const AppRouter = () => (
    <Router >
        <Switch >
            <Route path="/games" component={Games}></Route>
            <Route path="/controller" component={ControllerContainer} />
            <Route path="/game" component={GameContainer} />
            <Route path="/join" component={Join} />
            <Route path="/" exact component={Landing} />
        </Switch>
    </Router>
);

export default AppRouter