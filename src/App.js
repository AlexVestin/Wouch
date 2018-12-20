import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css'
import Landing from './ui/views/landing/landing'
import GameContainer from './game/gamecontainer'
import Join from './ui/views/join/newcontroller'
import ControllerContainer from './ui/views/controllers/controllercontainer'
import Games from './ui/views/games/games'
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