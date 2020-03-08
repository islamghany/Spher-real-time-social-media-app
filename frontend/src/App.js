

import React,{useEffect,useState,useCallback} from 'react';
import {useSelector,useDispatch} from 'react-redux'
import {BrowserRouter as Router} from 'react-router-dom';
import On from './components/routes/on'
import Off from './components/routes/off'
 
let logoutTimer;
const App =(props)=>{
  const [tokenExpirationDate,setTokenExpirationDate]=useState()
	const token=useSelector(state=>state.isSignedIn);
	const dispatch = useDispatch();
  const handlelogin = useCallback((uid,token,username,img,expirationDate)=>{
  dispatch({type:'SIGN_IN',payload:token});
  const ExpirationDate =
    expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(ExpirationDate);
     dispatch({type:'USER_DATA_IN',
        payload:{_id:uid,
          token,
          username,
          img,
          expiration:ExpirationDate.toISOString()
          }});
    localStorage.setItem(
      'userData',
      JSON.stringify({
        _id: uid,
        token: token,
        username:username,
        img:img,
        expiration: ExpirationDate.toISOString()
      })
    );  
  }, []);
 const handleAuth=useCallback(()=>{
      dispatch({type:'SIGN_OUT'})
      dispatch({type:'USER_DATA_OUT'});
      localStorage.removeItem('userData');
     },[]);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(()=>{

      }, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token,handleAuth, tokenExpirationDate]);

   useEffect(() => {
  const storedData = JSON.parse(localStorage.getItem('userData'));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ){  

      handlelogin(
        storedData._id,
        storedData.token,
        storedData.username,
        storedData.img,
         new Date(storedData.expiration))
     }
  }, [handlelogin]);  
	return (
		  <div>
          <Router>
             {token ? <On handleAuth={handleAuth} /> : <Off handleAuth={handlelogin} />}
          </Router>
          </div>
		)
}
export default App;