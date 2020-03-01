import React from 'react';
import Fade from 'react-reveal/Fade';

const UsernameText = ({register,errors})=>{
       return <div className="form__unit">
                  <input name="username" type="text" className="form__input" ref={register({
                  	required:true,
                  	minLength:6,
                  	validate:(value)=>{
                  		return value.includes(' ')=== false;
                  	}
                  })} placeholder="Username" autoComplete="off" />
                  {errors &&<Fade cascade>
                  	<div className="form__error">
                  	username must be unique and more than 5 chars and don't have space</div></Fade>}
               </div>
}
export default UsernameText;