import React, { useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ChatView from './components/ChatView';
import Register from './auth/Register';
import Login from './auth/Login';
import Profile from './components/Profile';
import { AuthContext } from './auth/auth.context';
import RouteGuard from './auth/RouteGuard';

const App = () => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));

  const setToken = (token) => {
    localStorage.setItem('authToken', token);
    setAuthToken(token);
  };

  // const { authToken, setAuthToken } = useAuth();

  return (
    <AuthContext.Provider value={{ authToken, setAuthToken: setToken }}>
      <BrowserRouter>
        <div>
          <Switch>
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
            <Route path="/profile" component={Profile} />
            <RouteGuard exact path="/" component={ChatView} />
          </Switch>
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
