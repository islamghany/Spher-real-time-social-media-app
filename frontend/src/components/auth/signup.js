import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import EmailText from "../../shared/inputs/email";
import PasswordText from "../../shared/inputs/password";
import UserText from "../../shared/inputs/username";
import { useHttpClient } from "../../shared/hooks/http-hook";
import NameText from "../../shared/inputs/name";
import { useAuth } from "./useAuth";
import { useFetch } from "../../shared/hooks/useFetch";
import { useDispatch } from "react-redux";

const Signup = () => {
  const { loading, error, request } = useFetch();
  const { handleGetin } = useAuth();
  const { register, handleSubmit, errors } = useForm();

  const onSubmit = async (data) => {
    try {
      const responseData = await request(
        process.env.REACT_APP_BACKEND_URL + "/users/signup",
        "post",
        data
      );
      handleGetin(responseData.data);
    } catch (err) {
      console.log(err, error);
    }
  };
  return (
    <div className="form__container screen">
      <div className="form__heading argon">
        <h3>Signup with Spher</h3>
      </div>

      <div className="form">
        <form className="form__body port" onSubmit={handleSubmit(onSubmit)}>
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
            disabled={loading}
            className="btn btn--contained2-secondary mg-none"
          >
            {loading ? "Loading...." : "Signup"}
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
