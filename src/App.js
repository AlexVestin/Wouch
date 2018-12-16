import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css'
import Landing from './ui/landing'
import Game from './game/App'
import Join from './ui//newcontroller'
import Controller from './controller/controller'

const AppRouter = () => (
    <Router >
        <Switch >
            <Route path="/controller" component={Controller} />
            <Route path="/game" component={Game} />
            <Route path="/join" component={Join} />
            <Route path="/" exact component={Landing} />
        </Switch>
    </Router>
);

export default AppRouter