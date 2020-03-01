import {combineReducers} from 'redux';
import signedReducer from './signedReducer';
import currentUser from './currentUser'
import postsReducer from './postsReducer'
import tokenExpirationDateReducer from './tokenExpirationDateReducer.js'

const rootReducers=combineReducers({
	isSignedIn:signedReducer,
	currentUser:currentUser,
	posts:postsReducer,
	tokenExpirationDate:tokenExpirationDateReducer
});
export default rootReducers;