import React from 'react';
import Slide from 'react-reveal/Slide';
import {Cancel,Accept} from '../../assets/icons/icons.js'
const ErrorModal = ({message,closeModal,state})=>{
   return <div className="model__container">
         <div className="model">
             <Slide collapse>
            <div className="model__body" onClick={(e)=>e.stopPropagation()}>
             <div className="model__state">
              <div className={`model__state--header ${state}`}>
                 {state==='error' ? <Cancel width='6rem' height='6rem' /> : <Accept width='6rem' height='6rem' />}  
              </div>
              <div className="model__state--body">
                 <h1>{state==='error' ? 'Oh snap!' : 'Right on!'}</h1>
                 <p>{message}</p>
              </div>
            <div className="model__state--tail">	
             <button onClick={closeModal} className={`btn btn--contained1-${state} mg-none`}>Close</button> 
            </div>
             </div>
            </div>
            </Slide>
         </div>
		</div>
}
export default ErrorModal;