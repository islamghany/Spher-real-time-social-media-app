

import React from 'react';
import rolling from "../../assets/icons/rolling.gif"
 
const LoadingModal = ()=>{
   return <div className="model__container">
         <div className="model">
               <img src={rolling} width="40rem" height="40rem" alt='Loading...' />
            
         </div>
		</div>
}
export default LoadingModal;