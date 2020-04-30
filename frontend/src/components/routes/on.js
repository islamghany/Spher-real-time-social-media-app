import React,{useEffect,useState} from 'react';
import {useSelector,useDispatch} from 'react-redux'
import Home from '../home';
import {Switch,Redirect,Route} from 'react-router-dom';
import Chat from '../chat/chat-page';
import Loading from '../../shared/models/loading-modal';
import { useFetch } from "../../shared/hooks/useFetch";
import socket from '../socket'

const On=()=>{
	const { loading , request } = useFetch();
	const user = useSelector(state=>state.currentUser);
    const dispatch= useDispatch();
    const injectSocketIdToUser= async ()=>{
            console.log(socket.id);

    try {
      const response = await request(
        process.env.REACT_APP_BACKEND_URL +
          `/users/update-info/${user._id}`,
        "patch",
        {socketId:socket.id},
        {
          Authorization: "Bearer " + user.token,
        }
      );
      dispatch({
      	type:'ADD_SOCKET',
      	payload:socket.id
      }) 
    } catch (err) {
      console.log(err.response);
    }
  }
  useEffect(()=>{
  
     if(user && user._id){
      console.log('sent')
      socket.emit('action',{
        type:'USER_LOGIN',
        userId:user._id})
     }
  },[user])
    if(user && user.token){
	return <div>		  
		<div  className="wrapper">
		<Switch>
			<Route path="/chat" component={Chat}/>
			<Route path="/" component={Home} />
			<Redirect from="*" to='' />
		</Switch>		
		</div>
		</div>
	}
	return <Loading />
}
export default On;