import React from 'react'
import ChatView from "./components/ChatView"
import ChooseChat from "./components/ChooseChat"
import { BrowserRouter, Route, Switch } from "react-router-dom";

const App = () =>  {
    return (
      <div>
      <BrowserRouter>
        <div>
            <Switch>
              <Route exact path="/" component={ChooseChat} />
              <Route path="/chat" component={ChatView} />
            </Switch>
        </div>
      </BrowserRouter>
      </div>
    );
  }

export default App;
