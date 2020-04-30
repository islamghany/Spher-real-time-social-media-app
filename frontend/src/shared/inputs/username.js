import React from 'react';

const UsernameText = ({register,errors})=>{
       return <div className="form__control">
       <div className="form__unit">
                  <input name="username" type="text" className="form__input" ref={register({
                  	required:true,
                  	minLength:6,
                  	validate:(value)=>{
                  		return value.includes(' ')=== false;
                  	}
                  })} placeholder=" " autoComplete="off" />
                  <label for="email" className="form__label">Username</label>
                  </div>
                  {errors && <div className="form__error">
                  	username must be unique and more than 5 chars and don't have space</div>}
               </div>
}
export default UsernameText;