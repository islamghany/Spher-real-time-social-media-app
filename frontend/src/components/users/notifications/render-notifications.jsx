import React from 'react';
import {Link} from 'react-router-dom'
const RenderNotifications = ({notifications,clearNotfy})=> notifications.map(item=><Link to={`/post/${item.to}`}><li className="notifications__item" onClick={clearNotfy} key={item._id}>
             <div className="notifications__item__img">
             	<img src={item.senderImg} alt={item.text}/>
             </div>
              <div className="notifications__item__content">
             	{item.text}
             </div>
   	      	</li></Link>)

export default RenderNotifications;