import React, { useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ChatView from './components/ChatView';
import Register from './auth/Register';
import Login from './auth/Login';
import ChooseChat from './components/ChooseChat';
import { AuthContext } from './auth/auth.context';
import RouteGuard from './auth/RouteGuard';

const App = () => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));

  const setToken = (token) => {
    localStorage.setItem('authToken', token);
    setAuthToken(token);
  };

  return (
    <AuthContext.Provider value={{ authToken, setAuthToken: setToken }}>
      <BrowserRouter>
        <div>
          <Switch>
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
            <RouteGuard exact path="/" component={ChooseChat} />
            <RouteGuard path="/chat" component={ChatView} />
          </Switch>
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
