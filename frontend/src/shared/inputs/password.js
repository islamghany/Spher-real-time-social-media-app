import React from 'react';
import Fade from 'react-reveal/Fade';

const PasswordText = ({register,errors})=>{
       return <div className="form__unit">
                  <input name="password" type="password" className="form__input" ref={register({
                  	required:true,
                  	minLength:6})} placeholder="Password" autoComplete="off" />
                  {errors &&(
                  	<Fade cascade>
                  	<div className="form__error">Password must be more then 5 characters</div>
                  	</Fade>)
              }
               </div>
}
export default PasswordText;