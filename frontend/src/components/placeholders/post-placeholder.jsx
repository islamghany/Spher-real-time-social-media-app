import React from 'react';

const PostPlaceholder = ()=>{
	return <div className="post-placeholder">
       <div className="post-placeholder__header">
           <div className="post-placeholder__img"></div> 
           <div className="post-placeholder__info">
           <div className="post-placeholder__username"></div> 
            <div className="post-placeholder__name"></div> 
          </div>
       </div>
       <div className="post-placeholder__content">
        <div></div>
        <div></div>
        <div></div>
       </div>
       <div className="post-placeholder__tail">
       <div className="post-placeholder__like"></div>
       <div className="post-placeholder__time"></div>
       </div>
	</div>
}
export default PostPlaceholder;