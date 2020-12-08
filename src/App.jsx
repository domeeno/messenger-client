import React, { useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ChatView from './components/ChatView';
import ChooseChat from './components/ChooseChat';
import { AuthContext } from './auth/auth.context';

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
            <Route exact path="/" component={ChooseChat} />
            <Route path="/chat" component={ChatView} />
          </Switch>
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
