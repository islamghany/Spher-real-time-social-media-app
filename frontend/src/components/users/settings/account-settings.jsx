import React, { useState } from "react";
import Loading from "../../../shared/loading.js";
import { useSelector,useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useFetch } from "../../../shared/hooks/useFetch";
const AccountSettings = () => {
  const { register, handleSubmit, errors, reset,watch } = useForm();
  const { loading, error, request, clearError } = useFetch();
  const user = useSelector((state) => state.currentUser);
  const dispatch = useDispatch();
  const [address, setAddress] = useState();
  const [success, setSuccess] = useState(null);
 const onSubmit = async (data) => {
    try {
      const response = await request(
        process.env.REACT_APP_BACKEND_URL +
          `/users/update-info/${user._id}`,
        "patch",
        data,
        {
          Authorization: "Bearer " + user.token,
        }
      );
      setSuccess(true);
      clearError();
       dispatch({
      type: "USER_DATA_IN",
      payload: {
        ...response.data,
        expiration: user.expiration,
        token:user.token
      },
    });
    localStorage.setItem(
      "userData2",
      JSON.stringify({
         ...response.data,
        expiration: user.expiration,
        token:user.token
      })
    ); 
    } catch (err) {
      console.log(err.response);
    }
  };
  
  const watchFields = watch(['name', 'bio','birth','livesIn','from','gender']);
  if (user && user.token) {
    return (
      <div className="settings__block">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form__control">
            <div className="form__unit">
              <input
                placeholder=" "
                type="text"
                defaultValue={user.name}
                name="name"
                className="form__input"
                ref={register({
                  minLength: 6,
                  maxLength: 32,
                  required:true
                })}
              />
              <label className="form__label">Name</label>
            </div>
            {errors.name && (
              <div className="form__error">
                name must be more than 5 and less than 21 chars
              </div>
            )}
          </div>
          <div className="form__control dup">
            <div className="form__unit">
              <input
                placeholder=" "
                type="text"
                defaultValue={
                  user.about && user.about.livesIn ? user.about.livesIn : null
                }
                name="livesIn"
                className="form__input"
                ref={register({
                  minLength: 6,
                  maxLength: 32,
                })}
              />
              <label className="form__label">Lives In</label>
               {errors.livesIn && (
              <div className="form__error">
                Invalid input
              </div>
            )}
            </div>
             
            <div className="form__unit">
              <input
                placeholder=" "
                type="text"
                name="from"
                className="form__input"
                ref={register({
                  minLength: 6,
                  maxLength: 32,
                })}
                defaultValue={
                  user.about && user.about.from ? user.about.from : null
                }
              />
              <label className="form__label">From</label>
               {errors.from && (
              <div className="form__error">
               invalid
              </div>
            )}
            </div>
          </div>
          <div className="form__control">
            <div className="form__unit">
              <select 
                placeholder=" "
                name="gender"
                className="form__input"
                ref={register}
                
              >
              <option value="" selected={user.about.gender} disabled hidden />
              <option value="male" selected={user.about.gender==="male"} >male</option>
              <option value="female" selected={user.about.gender==="female"}>female</option>
              </select>
              <label className="form__label">Gender</label>
            </div>
            </div>
          <div className="form__control">
            <div className="form__unit">
              <input
                placeholder=" "
                type="date"
                name="birth"
                className="form__input"
                ref={register({
                  validate:(d)=>{
                    return d.split('-')[0] <= new Date().getFullYear();
                  }
                })}
                defaultValue={
                  user.about && user.about.birth ? user.about.birth : null
                }
              />
              <label className="form__label">Date Of Birth</label>
            </div>
            {errors.birth && (
              <div className="form__error">
                invalid date
              </div>
            )}
          </div>
          <div className="form__control">
            <div className="form__unit">
              <textarea
                placeholder=" "
                name="bio"
                className="form__textarea"
                ref={register({
                  minLength: 2,
                  maxLength: 32,
                })}
                defaultValue={
                  user.about && user.about.bio ? user.about.bio : null
                }
              />
              <label className="form__label-area">Bio</label>
            </div>
             {errors.bio && (
              <div className="form__error">
                bio must be less than 256 chars
              </div>
            )}
          </div>
          <button disabled={loading ||  ( user.name === watchFields.name && !watchFields.gender && !watchFields.birth && !watchFields.from && !watchFields.livesIn && !watchFields.bio )} className="btn btn--contained1-primary mg-none block">
            save changes
          </button>
        </form>
              {success && <h6>Your information was updated successfully </h6>}

      </div>
    );
  }
  return <Loading />;
};
export default AccountSettings;
