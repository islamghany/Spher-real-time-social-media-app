import React,{useEffect} from 'react';
import Grid from "@material-ui/core/Grid";
import ChatFriends from './chat-friends'
import ChatMessages from './chat-messages'
import {Route} from 'react-router-dom'
import history from '../../history'
import {ChatIcon} from '../../assets/icons/icons';

const Chat = (props)=>{
  const goBack=()=>{
   history.push('');
  }
  useEffect(()=>{
    document.title="Chat"
  },[])
	return <div className="chat" style={{ flexGrow: 1 }}>      
            <ChatFriends goBack={goBack} />
            <Route path="/chat/:id"  component={ChatMessages} />
            <Route exact path="/chat">
              <div className="chat__icon">
               <ChatIcon />
              </div>
            </Route>
	</div>
}
export default Chat;