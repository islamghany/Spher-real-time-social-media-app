import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import EmailText from "../../shared/inputs/email";
import PasswordText from "../../shared/inputs/password";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useAuth } from "./useAuth";

const Login = () => {
  const { register, handleSubmit, errors } = useForm();
  const { isLoading, error, sendRequest } = useHttpClient();
  const { handleGetin } = useAuth();
  const handleLogin = async (data) => {
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/users/login",
        "POST",
        JSON.stringify({
          ...data,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      handleGetin(responseData);
    } catch (err) {
      console.log(err, error);
    }
  };
  const onSubmit = (data) => {
    handleLogin(data);
  };

  return (
    <div className="form__container screen">
      <div className="form__heading">
        <h3>Login with Spher</h3>
      </div>
      <div className="form">
        <form className="form__body port" onSubmit={handleSubmit(onSubmit)}>
          <div className="error-message">
            <div className="message">
              {error ? error || "something went wrong" : ""}
            </div>
          </div>
          <EmailText register={register} errors={errors.email} />
          <PasswordText register={register} errors={errors.password} />
          <button
            disabled={isLoading}
            className="btn btn--contained2-primary mg-none"
          >
            {isLoading ? "Loading...." : "Login"}
          </button>
          <div className="form__else">
            <p>
              don't have an account ? <Link to="/signup">Signup</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Login;
