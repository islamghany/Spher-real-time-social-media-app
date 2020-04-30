import React from 'react';

const PasswordText = ({register,errors})=>{
       return  <div className="form__control">
       <div className="form__unit">
                  <input name="password" type="password" className="form__input" ref={register({
                  	required:true,
                  	minLength:6,
                    maxLength:32
                  })} placeholder=" " autoComplete="off" />
                    <label className="form__label">Password</label>
                    </div>
                  {errors &&(
                  	<div className="form__error">Password must be more then 5 characters and less than 33</div>
                  	)
              }
              
               </div>
}
export default PasswordText;