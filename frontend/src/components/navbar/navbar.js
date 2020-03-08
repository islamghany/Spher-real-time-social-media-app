import React from "react";
import {Gift,Logout} from "../../assets/icons/icons.js";

const Navbar = ({ handleAuth }) => {
  return (
    <div className="nav">
      <div className="wrapper">
        <div className="nav__body">
          <div className="nav__logo">
            <span className="icon">
              <Gift width="2.5rem" height="2.5rem" fill="#fff" />
            </span>
            Spher
          </div>         
          <div className="nav__logout">
            <span onClick={() => handleAuth()}>
              <Logout width="2.5rem" height="2.5rem" fill="#fff" />{" "}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Navbar;
