import React from 'react';
import ReactDom from 'react-dom';
import App from './App';
import './assets/style/style.scss';
import {Provider} from 'react-redux';
import {createStore,applyMiddleware} from 'redux';
import rootReducer from './reducers/index.js';
import thunk from 'redux-thunk';

	
// REACT_APP_WEATHER_API_KEY=eff6908324d2496dacc16a5a56427f42
// REACT_APP_SALAT_API_KEY=9ba81b545emsh8ec3c41be845490p1db0e6jsncf03fd85530d
// REACT_APP_BACKEND_URL=http://localhost:5000/api

const store=createStore(
  rootReducer,
   applyMiddleware(thunk)
 );

ReactDom.render(
	<Provider store={store}>
	  <App />
	 </Provider>,
	document.getElementById('root'));

// if (module.hot) {
// module.hot.accept();
// }
