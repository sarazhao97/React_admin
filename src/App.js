import React, { Component } from 'react';
import Login from './pages/login/login'
import Admin from './pages/admin/admin'
/* 映射路由 */
import {BrowserRouter,Route,Switch} from 'react-router-dom'

/* 应用的根组件 */
class App extends Component {
    render() { 
        return ( 
            <BrowserRouter>
            <Switch>
            <Route path='/login' component={Login}></Route>
            <Route path='/' component={Admin}></Route>
            </Switch>                
            </BrowserRouter>
         );
    }
}
 
export default App;