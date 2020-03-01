import React from 'react';
import isEmail from 'validator/lib/isEmail';
import Fade from 'react-reveal/Fade';

const NameText = ({register,errors})=>{
       return <div className="form__unit">
                  <input name="name" type="text" className="form__input" ref={register({
                  	required:true,
                  	minLength:6
                  	})} placeholder="Name" autoComplete="off" />
                  {errors &&<Fade cascade><div className="form__error">Invalid Name</div></Fade>}
               </div>
}
export default NameText;