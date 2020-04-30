import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useFetch } from "../../../shared/hooks/useFetch";
import { useSelector } from "react-redux";

const PasswordSettings = () => {
  const { register, handleSubmit, errors, reset } = useForm();
  const { loading, error, request, clearError } = useFetch();
  const [success, setSuccess] = useState(null);
  const [password, setPasswod] = useState(null);
  const user = useSelector((state) => state.currentUser);

  const handleChange = (e) => {
    setPasswod(e.target.value);
  };
  const onSubmit = async (data) => {
    try {
      const response = await request(
        process.env.REACT_APP_BACKEND_URL +
          `/users/change-password/${user._id}`,
        "patch",
        data,
        {
          Authorization: "Bearer " + user.token,
        }
      );
      setSuccess(true);
      clearError();
      reset({
        oldPassword: null,
        newPassword: null,
        confirmPassword: null,
      });
    } catch (err) {
      console.log(err.response);
    }
  };
  return (
    <div className="settings__block">
      <div className="error-message">
        <div className="message">
          {error ? error || "something went wrong" : ""}
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form__control">
          <div className="form__unit">
            <input
              placeholder=" "
              type="password"
              name="oldPassword"
              className="form__input"
              ref={register({
                required: true,
                minLength: 6,
                maxLength: 32,
              })}
            />
            <label className="form__label">Old Password</label>
          </div>
          {errors.oldPassword && (
            <div className="form__error">
              Password must be more then 5 characters and less than 33
            </div>
          )}
        </div>
        <div className="form__control">
          <div className="form__unit">
            <input
              placeholder=" "
              onChange={handleChange}
              type="password"
              name="newPassword"
              className="form__input"
              ref={register({
                required: true,
                minLength: 6,
                maxLength: 32,
              })}
            />
            <label className="form__label">New Password</label>
          </div>
          {errors.newPassword && (
            <div className="form__error">
              Password must be more then 5 characters and less than 33
            </div>
          )}
        </div>
        <div className="form__control">
          <div className="form__unit">
            <input
              placeholder=" "
              type="password"
              name="confirmPassword"
              className="form__input"
              ref={register({
                required: true,
                minLength: 6,
                validate: (e) => {
                  return e === password;
                },
              })}
            />
            <label className="form__label">Confirm Password</label>
          </div>
          {errors.confirmPassword && (
            <div className="form__error">
              the confirmd password is diffrent from the new password
            </div>
          )}
        </div>
        <button
          className="btn btn--contained1-primary mg-none block"
          disabled={loading}
        >
          {loading ? "updating password..." : "save changes"}
        </button>
      </form>
      {success && <h6>Your password was updated successfully </h6>}
    </div>
  );
};
export default PasswordSettings;
