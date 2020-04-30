import React from 'react';
import isEmail from 'validator/lib/isEmail';

const NameText = ({register,errors})=>{
       return <div className="form__control">
       <div className="form__unit">
                  <input name="name" type="text" className="form__input" ref={register({
                  	required:true,
                  	minLength:6
                  	})} placeholder=" " autoComplete="off" />
                    <label className="form__label">Name</label>
                     </div>
                  {errors &&<div className="form__error">Invalid Name</div>}
              
               </div>
}
export default NameText;