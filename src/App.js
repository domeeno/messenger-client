import React from 'react'
import ChatView from "./chat/ChatView"
import ChooseChat from "./chat/ChooseChat"
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
