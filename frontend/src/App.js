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

 const handlelogin = useCallback((uid,token,username,expirationDate)=>{
  dispatch({type:'SIGN_IN',payload:token});
  const ExpirationDate =
    expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(ExpirationDate);
    localStorage.setItem(
      'userData',
      JSON.stringify({
        _id: uid,
        token: token,
        username:username,
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
  console.log('token',tokenExpirationDate)
  const storedData = JSON.parse(localStorage.getItem('userData'));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ){  
      dispatch({type:'USER_DATA_IN',payload:storedData});
      handlelogin(
        storedData._id,
        storedData.token,
        storedData.username,
         new Date(storedData.expiration));
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