import React from 'react';
import ReactDom from 'react-dom';
import App from './App';
import './assets/style/style.scss';
import {Provider} from 'react-redux';
import {createStore,applyMiddleware} from 'redux';
import rootReducer from './reducers/index.js';
import thunk from 'redux-thunk';

const store=createStore(
  rootReducer,
   applyMiddleware(thunk)
 );
// import {BrowserRouter as Router,Route} from 'react-router-dom';
// import Test from './test';
// ReactDom.render(<div>
// 	<Router>
// 	<Route path=''>
// 	<Test />
// 	</Route>
//     </Router>
//     </div> 
// 	,document.querySelector('#root'))

ReactDom.render(
	<Provider store={store}>
	  <App />
	 </Provider>,
	document.getElementById('root'));

