import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import EmailText from "../../shared/inputs/email";
import PasswordText from "../../shared/inputs/password";
import UserText from "../../shared/inputs/username";
import { useHttpClient } from "../../shared/hooks/http-hook";
import NameText from "../../shared/inputs/name";

const Signup = ({ handleAuth }) => {
  const { isLoading, error, sendRequest } = useHttpClient();
  const { register, handleSubmit, errors } = useForm();
  const handleSignup = async data => {
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL+"/users/signup",
        "POST",
        JSON.stringify({
          ...data
        }),
        {
          "Content-Type": "application/json"
        }
      );
      handleAuth(
        responseData._id,
        responseData.token,
        responseData.username,
        responseData.img
      );
    } catch (err) {
      console.log(err, error);
    }
  };
  const onSubmit = data => {
    handleSignup(data);
  };
  return (
    <div className="form__container screen">
      <div className="form__heading argon">
        <h3>Signup with Spher</h3>
      </div>

      <div className="form">
        <form className="form__body" onSubmit={handleSubmit(onSubmit)}>
          <div className="error-message">
            <div className="message">
              {error ? error || "something went wrong" : ""}
            </div>
          </div>
          <NameText register={register} errors={errors.name} />
          <UserText register={register} errors={errors.username} />
          <EmailText register={register} errors={errors.email} />
          <PasswordText register={register} errors={errors.password} />
          <button
            disabled={isLoading}
            className="btn btn--contained1-default mg-none"
          >
            {isLoading ? "Loading...." : "Signup"}
          </button>
          <div className="form__else">
            <p>
              already have an account ? <Link to="/login">Login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Signup;
