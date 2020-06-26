import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logUserOut } from './actions/authActions';
import './App.css';

import { Provider } from 'react-redux';
import store from './store';

// component imports
import Landing from './components/layout/Landing';
import Navbar from './components/layout/Navbar';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import PrivateRoute from './components/private-route/PrivateRoute';
import Dashboard from './components/dashboard/Dashboard';

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // set authtoken header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);

  // devode token and get user info and exp
  const decode = jwt_decode(token);

  // set user and isAuthenticated
  store.dispatch(setCurrentUser(decode));

  // check for expiry
  const currentTime = Date.now() / 1000; // in millisec

  if (decode.exp < currentTime) {
    // logiyt user
    store.dispatch(logUserOut());

    // redire to login page
    window.location.href = "./login";
  }
}
  

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Navbar />
          <Route exact path="/" component={Landing} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <Switch>
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
          </Switch>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
