import React from "react";
import { Gift, Logout, Home, Friends } from "../../assets/icons/icons.js";
import { NavLink } from "react-router-dom";

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
          <div className="nav__navigations">
            <ul className="nav__list">
              <li className="nav__item">
                <NavLink to="/posts" className="nav__link">
                  <span className="icon">
                    <Home width="2.5rem" height="2.5rem" fill="#fff" />
                  </span>
                </NavLink>
              </li>
              <li className="nav__item">
                <NavLink
                  to="/users"
                  activeClassName="active"
                  className="nav__link"
                >
                  <span className="icon">
                    <Friends width="2.5rem" height="2.5rem" fill="#fff" />
                  </span>
                </NavLink>
              </li>
            </ul>
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
