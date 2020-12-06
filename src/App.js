import React, {useState, useCallback, useEffect} from 'react'
import Message from "./chat/Message"
import ChooseChat from "./chat/ChooseChat"
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";



const App = () =>  {
    return (
      <div>
      <BrowserRouter>
        <div>
            <Switch>
              <Route exact path="/" component={ChooseChat} />
              <Route path="/chat" component={Message} />
            </Switch>
        </div>
      </BrowserRouter>
      </div>
    );
  }
// }

export default App;
