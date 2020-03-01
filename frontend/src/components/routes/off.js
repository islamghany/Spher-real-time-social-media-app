import React from 'react';
import Signup from '../auth/signup';
import Login from '../auth/login';
import {Switch,Redirect,Route} from 'react-router-dom';

const Off = ({handleAuth})=>{
	return <div  className="wrapper">
		<Switch>
			<Route exact path="/login">
               <Login handleAuth={handleAuth} />
			</Route>
			<Route exact path="/signup">
               <Signup handleAuth={handleAuth} />
			</Route>
			<Redirect from="*" to="/login" />
		</Switch>
		</div>
}
export default Off;