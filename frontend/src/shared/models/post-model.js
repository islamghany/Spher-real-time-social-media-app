import React from 'react';
import Slide from 'react-reveal/Slide';
import {Link} from 'react-router-dom';
import {useHttpClient} from '../../shared/hooks/http-hook';
import {useDispatch,useSelector} from 'react-redux';

const PostModel=({closeModel,id})=>{
 const { isLoading, error, sendRequest } = useHttpClient();
 const dispatch = useDispatch();
 const token = useSelector(state=>state.isSignedIn)
 const deletePost= async ()=>{
    console.log(id);
    try {
      await sendRequest(
        `http://localhost:5000/api/posts/${id}`,
        'DELETE',null,{
        'Content-Type': 'application/json',
        Authorization:'Bearer '+ token
     }
      );    
      dispatch({type:'DELETE_POST',payload:id});
      closeModel();
    } catch (err) {}
}	
console.log(error)
return (
		<div className="model__container">
         <div className="model">
                 <Slide collapse>
            <div className="model__body" onClick={(e)=>e.stopPropagation()} >
             <ul className="model__list">
             	<li className="model__item">
             		<Link to={
                        `/posts/edit/${id}`}
                         >
             		Edit Post
             		</Link>
             	</li>
             	<li className="model__item delete" onClick={()=>{
             		deletePost();
             			
             			
             	}}>
             		{isLoading ? 'Deleting...' :'Delete Post'}
             	</li>
             	<li className="model__item" onClick={()=>closeModel()}>
             		Cancel
             	</li>
             </ul>
            </div>
            </Slide>
         </div>
		</div>
		)
}
export default PostModel;