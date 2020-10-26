import React,{Component} from 'react';
import Bar from './Bar.js';
import './App.css';
import Login from './Login.js';
import Register from './register.js';
import { Redirect,Route, BrowserRouter as Router, Switch } from "react-router-dom"
import boards from './boards.js';
class App extends Component
{
  constructor(props)
  {
    super(props);
    this.state=({
      user:-1
    });
  }
  increase = () =>  
  {
    document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location='/';
  }
  render()
  {
    var a=document.cookie.split("=");
    if (a[1]!==undefined)
    {
      return(
        <div>
        <Bar/>
          <Router>
            <Switch>
            <Route exact path="/">1</Route>
            <Route path="/boards" component={boards}/>
            <Redirect path="*" to="/" />
            </Switch>
          </Router>
        </div>
      );
    }
    else
    {
      return(
        <div>
        <main>
          <Router>
          <Route exact path="/" component={Login} />
          <Route path="/register" component={Register}/>
          </Router>
        </main>
        </div>
      );
    }
  }
}

export default App;
