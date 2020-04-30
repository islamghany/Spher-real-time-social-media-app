import {combineReducers} from 'redux';
import signedReducer from './signedReducer';
import currentUser from './currentUser'
import postsReducer from './postsReducer'
import tokenExpirationDateReducer from './tokenExpirationDateReducer.js'
import SearchReducer from './searchReducer.js'
import MoreUserPost from './userPostsReducer'
import NotificationsReducer from './notifications'
const rootReducers=combineReducers({
	isSignedIn:signedReducer,
	searchedUsers:SearchReducer,
	currentUser:currentUser,
	posts:postsReducer,
	userPost:MoreUserPost,
	notifications:NotificationsReducer,
	tokenExpirationDate:tokenExpirationDateReducer
});
export default rootReducers;