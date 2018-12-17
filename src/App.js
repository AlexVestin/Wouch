import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css'
import Landing from './ui/landing'
import GameContainer from './game/gamecontainer'
import Join from './ui/newcontroller'
import ControllerContainer from './ui/controllers/controllercontainer'
import Games from './ui/games/games'
import withHeader from './ui/hoc/withheader'

const AppRouter = () => (
    <Router >
        <Switch >

            <Route path="/games" component={withHeader(Games)}></Route>
            <Route path="/controller" component={ControllerContainer} />
            <Route path="/game" component={withHeader(GameContainer)} />
            <Route path="/join" component={withHeader(Join)} />
            <Route path="/" exact component={withHeader(Landing)} />
        </Switch>
    </Router>
);

export default AppRouter