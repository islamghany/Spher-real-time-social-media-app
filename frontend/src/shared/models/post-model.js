import React,{useState} from 'react';
import Slide from 'react-reveal/Slide';
import {Link} from 'react-router-dom';
import {useHttpClient} from '../../shared/hooks/http-hook';
import {useDispatch,useSelector} from 'react-redux';
import LoadindModal from './loading-modal'
import history from '../../history'
import { CSSTransition } from 'react-transition-group';

const PostModel=({path,children,title,id})=>{
 const { isLoading, error, sendRequest } = useHttpClient();
 const [isOpen,setIsOpen]=useState(false);
 const dispatch = useDispatch();
 const token = useSelector(state=>state.isSignedIn)
  const closeModal = ()=>{
    if(isOpen){
      setIsOpen(false);
       document.body.style.overflowY='auto';
    }
  }
  const openModal=()=>{
    if(!isOpen){
      setIsOpen(true);
      document.body.style.overflowY='hidden';
    }
  }
 const deletePost= async ()=>{
    try {
      await sendRequest(
       process.env.REACT_APP_BACKEND_URL+`/posts/${id}`,
        'DELETE',null,{
        'Content-Type': 'application/json',
        Authorization:'Bearer '+ token
     }
      );    
      dispatch({type:'DELETE_POST',payload:id});
      console.log(id)
      if(!path){
        history.push('');
    }
    else{
    dispatch({type:'DELETE_USER_POST',payload:id});
    }
    closeModal();
    } catch (err) {}
}	
return (
        <>
     <div style={{display:'inline-block'}} onClick={openModal}>{children}</div>
      <CSSTransition
        in={isOpen}
        timeout={300}
        classNames="modal"
        unmountOnExit
      >
		<div className="modal__container" onClick={closeModal}>
         <div className="modal">
            <div className="modal__body" onClick={(e)=>e.stopPropagation()} >
             <ul className="modal__list">
             	<li className="modal__item">
             		<Link onClick={closeModal} to={{
                        pathname:`/posts/edit/${id}`,
                        state:{title}
                         }}
                         >
             		Edit Post
             		</Link>
             	</li>
             	<li className="modal__item delete" onClick={()=>{
             		deletePost();
             			
             			
             	}}>
             		{isLoading ? 'Deleting...' :'Delete Post'}
             	</li>
             	<li className="modal__item" onClick={closeModal}>
             		Cancel
             	</li>
             </ul>
            </div>
         </div>
		</div>
        </CSSTransition>
        {isLoading && <LoadindModal />}
        </>
		)
}
export default PostModel;