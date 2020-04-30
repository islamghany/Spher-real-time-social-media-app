import React,{useEffect} from "react";
import { Route, Switch, NavLink, Redirect } from "react-router-dom";
import AccountSettings from "./account-settings.jsx";
import PasswordSettings from "./password-settings.jsx";

const Settings = React.memo(() => {
  useEffect(()=>{
       document.title="Settings"
  },[])
  return (
    <div className="settings">
      <div className="settings__nav">
        <ui className="settings__nav__list">
          <li className="settings__nav__item">
            <NavLink
              className="settings__nav__link"
              to="/settings/account"
              activeClassName="active"
            >
              Account
            </NavLink>
          </li>
          <li className="settings__nav__item">
            <NavLink
              className="settings__nav__link"
              to="/settings/password"
              activeClassName="active"
            >
              Password
            </NavLink>
          </li>
        </ui>
      </div>
      <div>
        <Redirect exact from="/settings" to="/settings/account" />
        <Route exact path="/settings/account" component={AccountSettings} />
        <Route exact path="/settings/password" component={PasswordSettings} />
      </div>
    </div>
  );
});
export default Settings;
