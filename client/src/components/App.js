//rendering layer of the react app
import React from "react";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import Landing from "./Landing";
import Login from "./Login";
import { connect } from "react-redux";
import * as actions from "../actions";

class App extends React.Component {
  componentDidMount() {
    this.props.fetchUser();
  }

  render() {
    return (
      <BrowserRouter>
        <Route exact path="/login" component={Login} />
        <Route exact path="/" component={this.props.auth ? Landing : Login} />
      </BrowserRouter>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(
  mapStateToProps,
  actions
)(App);
