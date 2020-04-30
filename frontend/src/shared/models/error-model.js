import React,{useEffect} from 'react';
import Slide from 'react-reveal/Slide';
import {Cancel,Accept} from '../../assets/icons/icons';

const ErrorModal = ({message="Process faild",closeModal,state='error'})=>{
  useEffect(()=>{
     window.addEventListener('click',closeModal);

     return ()=>window.removeEventListener('click',closeModal); 
  },[])
   return <div className="modal__container">
         <div className="modal">
             <Slide collapse>
            <div className="modal__body" onClick={(e)=>e.stopPropagation()}>
             <div className="modal__state">
              <div className={`modal__state--header ${state}`}>
                 {state==='error' ? <Cancel width='6rem' height='6rem' /> : <Accept width='6rem' height='6rem' />}  
              </div>
              <div className="modal__state--body">
                 <h1>{state==='error' ? 'Oh snap!' : 'Right on!'}</h1>
                 <p>{message}</p>
              </div>
            <div className="modal__state--tail">  
             <button onClick={closeModal} className={`btn btn--contained1-${state} mg-none`}>Close</button> 
            </div>
             </div>
            </div>
            </Slide>
         </div>
    </div>
}
export default ErrorModal;