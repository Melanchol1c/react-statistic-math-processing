import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.scss";
import Router from "./routes";
import { BrowserRouter, Link } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Link to="/" className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2 className="App__headline">Kirizey Math Processing</h2>
          </Link>
          <Router />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
