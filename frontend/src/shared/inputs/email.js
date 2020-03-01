import React from 'react';
import isEmail from 'validator/lib/isEmail';
import Fade from 'react-reveal/Fade';

const EmailText = ({register,errors})=>{
       return <div className="form__unit">
                  <input name="email" type="text" className="form__input" ref={register({
                  	required:true,
                  	validate:(value)=>{                 	
                  		return isEmail(value) 
                  	}})} placeholder="Email" autoComplete="off" />
                  {errors &&<Fade cascade><div className="form__error">invalid Email</div></Fade>}
               </div>
}
export default EmailText;