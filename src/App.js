import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css'
import Landing from './landing'
const About = () => <h2>About</h2>;
const Users = () => <h2>Users</h2>;

const AppRouter = () => (
  <Router >
    <div style={{width: "100%", height: "100%"}}>
      <Route path="/" exact component={Landing} />
      <Route path="/about/" component={About} />
      <Route path="/users/" component={Users} />
    </div>
  </Router>
);

export default AppRouter