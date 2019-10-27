import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class Login extends React.Component {
  renderContent() {
    switch (this.props.auth) {
      case null:
        return;
      case false:
        return (
          <div>
            <a href="/auth/spotify">Login With Spotify</a>
          </div>
        );
      default:
        return (
          <div>
            <a href="/api/logout">Logout</a>
          </div>
        );
    }
  }

  render() {
    return <div>{this.renderContent()}</div>;
  }
}

function mapStateToProps({ auth }) {
  return { auth: auth };
}

export default connect(mapStateToProps)(Login);
