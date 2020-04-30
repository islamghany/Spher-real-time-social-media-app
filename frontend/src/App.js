
import React,{useEffect,Suspense,lazy} from 'react';
import {Router} from 'react-router-dom';
import {useAuth} from './components/auth/useAuth.js';
import LoadingPage from './shared/models/loading-modal' 
import {useSelector} from 'react-redux';
import history from './history';
const On =lazy(()=>import('./components/routes/on'));
const Off =lazy(()=>import('./components/routes/off'));
  const App =()=>{
  const token = useSelector(state=>state.isSignedIn)
  const {loading,handleRefresh} =useAuth();
  useEffect(()=>{
    handleRefresh();
  },[]);
  if(loading){
    return <LoadingPage />
  }
  console.log(process.env.REACT_APP_BACKEND_URL);
	return (
		  <div>
          <Router history={history}>
             <Suspense fallback={<LoadingPage />}>
             {token   ? <On  /> : <Off  />}
             </Suspense>
          </Router>
          </div>
		)
}
export default App;