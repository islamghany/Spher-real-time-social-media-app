import React from 'react';
import PostPlaceholer  from './post-placeholder'

const ProfilePlaceholder=()=>{
	return <div div className="mt-5">
		<div className="profile-placehoder">
      <div className="profile-placehoder__header">
      <div className="profile-placehoder__header--icon">
      </div> 
      <h2>
      </h2>  
      </div>
  <div className="profile-placehoder__cover">
      </div>
      <div className="profile-placehoder__row">
      <div className="profile-placehoder__info">
       <div className="profile-placehoder__info__picture"></div>
       <h2 className="profile-placehoder__info__username"></h2>
       <h2 className="profile-placehoder__info__name"></h2>
       </div>
       <div className="profile-placehoder__info__statics">
        <div className="profile-placehoder__info__statics--head">
        <h3></h3>
        <h3></h3> 
        </div>
        <div className="seprator" />
        <div className="profile-placehoder__info__statics--result">
         <h3></h3>
         <h3></h3>
       </div>
       <p className="profile-placehoder__info__bio"></p>
      </div>
      </div>
      </div>
      <PostPlaceholer />
      <PostPlaceholer />
      <PostPlaceholer />
	</div>
}
export default ProfilePlaceholder;