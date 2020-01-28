import React, { Component } from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import "./index.css";

const App = () => (
  <Router>
    <div>
      <header>
        <Link to="/">Home</Link> <Link to="/about">About</Link>{" "}
        <Link to="/login">Login</Link>
      </header>
      <main>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/about" component={About} />
          <Route exact path="/login" component={Login} />
          <Route path="/important" component={Important} />
          <Route path="/private" component={Protected(Private)} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  </Router>
);

const Home = props => (
  <div>
    <h1>Home</h1>
    <p>This is a simple react-router-dom example.</p>
    <button onClick={() => props.history.push("/important")}>Important</button>
  </div>
);

const About = () => (
  <div>
    <h1>About</h1>
    <p>Learning React is fun!</p>
  </div>
);

const NotFound = () => (
  <div>
    <h1>404</h1>
    <p>Not found.</p>
  </div>
);

const Information = ({ match }) => (
  <div>
    <h2>{match.params.id}</h2>
  </div>
);

const items = ["javascript", "science", "trucks", "henweighs"];

const Important = ({ match }) => (
  <div>
    <h1>Important Information</h1>
    <ul>
      {items.map(i => (
        <li>
          <Link to={`${match.url}/${i}`}>{i}</Link>
        </li>
      ))}
    </ul>
    <Route exact path={`${match.url}/:id`} component={Information} />
    <Route exact path={match.url} render={() => <h2>Choose a topic</h2>} />
  </div>
);

const Private = () => (
  <div>
    <h1>Private</h1>
    <p>You are authenticated.</p>
    <p>Secret: {Math.floor(Math.random() * 10000000 + 10000)}</p>
  </div>
);

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { name: "", password: "", msg: "" };
  }
  handleSubmit = () => {
    if (this.state.name === "admin" && this.state.password === "password")
      this.props.history.push({ pathname: "/private", state: true });
    else this.setState({ msg: "unauthorized" });
  };
  handleKeyDown = e => {
    if (e.key === "Enter") {
      e.preventDefault();
      this.handleSubmit();
    }
  };
  render() {
    return (
      <div>
        <h1>Login</h1>
        <p>
          <input
            placeholder=" name"
            onChange={e => this.setState({ name: e.target.value })}
          />
        </p>
        <p>
          <input
            type="password"
            placeholder=" password"
            onChange={e => this.setState({ password: e.target.value })}
            onKeyDown={this.handleKeyDown}
          />
        </p>
        <button onClick={this.handleSubmit}>Submit</button>
        <p>
          <label style={{ color: "red" }}>{this.state.msg}</label>
        </p>
      </div>
    );
  }
}

// Higher-Order Component
const Protected = BaseComponent => {
  class Restricted extends Component {
    componentWillMount() {
      this.authenticationCheck(this.props);
    }
    componentWillReceiveProps(nextProps) {
      if (nextProps.location !== this.props.location)
        this.authenticationCheck(nextProps);
    }
    authenticationCheck(props) {
      if (!props.location.state) props.history.push("/404"); // redirect to 404 if not authenticated
    }
    render() {
      return <BaseComponent {...this.props} />;
    }
  }
  return Restricted;
};
