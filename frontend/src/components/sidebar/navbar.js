import React from "react";
import {Spher,Bell_2 as Bell,Menu} from "../../assets/icons/icons.js";
import {useAuth} from '../auth/useAuth'
const Navbar = ({openSidebar,openNotify}) => {
  return (
    <div className="nav">
      <div className="wrapper">
        <div className="nav__body">
         <div className="nav__menu">
          <span className="icon" onClick={(e)=>{
            e.stopPropagation()
            openSidebar();
          }}>
              <Menu />
            </span>
         </div>
          <div className="nav__logo">
            Spher
          </div>         
          <div className="nav__Bell" onClick={(e)=>{
            e.stopPropagation();  
            openNotify()
          }}>
           <span className="icon">
              <Bell />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Navbar;
