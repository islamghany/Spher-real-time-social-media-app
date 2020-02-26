import React from 'react';
import {useSelector,useDispatch} from 'react-redux'
import {BrowserRouter as Router} from 'react-router-dom';
import On from './components/routes/on'
import Off from './components/routes/off'

const App =(props)=>{
	console.log(props); 
	const isSignedIn=useSelector(state=>state.isSignedIn);
	const dispatch = useDispatch();
    const handleAuth=()=>{
     if(isSignedIn) dispatch({type:'SIGN_OUT'});
     else dispatch({type:'SIGN_IN'})
     }
	return (
		  <div>
          <Router>
             {isSignedIn ? <On handleAuth={handleAuth} /> : <Off handleAuth={handleAuth} />}
          </Router>
          </div>
		)
}
export default App;