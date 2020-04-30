import React from 'react';
import isEmail from 'validator/lib/isEmail';

const EmailText = ({register,errors})=>{
       return <div className="form__control">
               <div className="form__unit">
                  <input name="email" type="text" className="form__input" ref={register({
                  	required:true,
                  	validate:(value)=>{                 	
                  		return isEmail(value) 
                  	}})} placeholder=" " autoComplete="off" />
                  <label for="email" className="form__label">email</label>
                  </div>
                  {errors &&<div className="form__error">invalid Email</div>}
               </div>
}
export default EmailText;