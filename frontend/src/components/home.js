import React, { useState, useEffect, useCallback,lazy } from "react";
import Grid from "@material-ui/core/Grid";
import Notifications from "./users/notifications/notifications";
import { useSelector } from "react-redux";
import Loading from "../shared/loading.js";
import Sidebar from "./sidebar/sidebar";
import { Route, Switch, Redirect } from "react-router-dom";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { CSSTransition } from 'react-transition-group';

const Friends =lazy(()=>import("./users/friends"));
const Settings =lazy(()=>import("./users/settings/settings"));
const Profile= lazy(()=>import("./users/profile/profile"));
const EditPost =lazy(()=>import("./posts/edit-post"));
const Weather= lazy(()=>import("./services/weahter"));
const PostComments= lazy(()=>import("./posts/post-comments"));
const Navbar =lazy(()=>import("./sidebar/navbar"));
const Posts =lazy(()=>import("./posts/posts.js"));


const Home = () => {
  const user = useSelector((state) => state.currentUser);
  const [isSidebar, setIsSidebar] = useState(false);
  const [isNotify, setSsNotify] = useState(false);
  const matches = useMediaQuery("(min-width:1081px)");
  const openSidebar = () => {
    setIsSidebar(true);
  };
  const openNotify = () => {
    setSsNotify((e) => !e);
  };
  const closeAll = useCallback(() => {
    setIsSidebar(false);
    setSsNotify(false);
  }, []);
  if (user && user.token) {
    return (
      <div style={{ flexGrow: 1 }}>
        {!matches && (
          <Navbar openSidebar={openSidebar} openNotify={openNotify} />
        )}
        <Grid container>
          <Grid item xg={3} lg={3} md={3} xs={0}>
             {matches && <Sidebar uid={user._id} />}
            <div
              onClick={closeAll}
              className={`${
                isSidebar && !matches ? "sidebar__wrapper" : "sfs"
              }`}
            >
              <div onClick={(e) => e.stopPropagation()}>
                {(!matches) && (
                  <CSSTransition
                    in={isSidebar}
                    timeout={1}
                    unmountOnExit
                      >
                   <Sidebar uid={user._id} closeSidebar={()=>setIsSidebar(false)} />
                  </CSSTransition>
                )}
              </div>
            </div>
          </Grid>
          <Grid item xg={6} lg={6} md={6} sm={8} xs={12} className="order">
            <Switch>
              <Route exact path="/friends" component={Friends} />
              <Route path="/settings" component={Settings} />
              <Route exact path="/weather" component={Weather} />
              <Route exac path="/profile/:id" component={Profile} />
              <Route exact path="/user/:id" component={Profile} />
              <Route exact path="/post/:id" component={PostComments} />
              <Route exact path="/Posts/edit/:id" component={EditPost} />
              <Route
                exact
                path="/"
                render={() => <Posts currentUser={user} />}
              />
              <Redirect from="*" to="" />
            </Switch>
          </Grid>
          <Grid item xg={3} lg={3} md={3} sm={0} xs={0}>
          <div
              onClick={closeAll}
              className={`${
                isNotify && !matches ? "sidebar__wrapper" : "sfs"
              }`}
            >
            <div onClick={(e) => e.stopPropagation()}>
              {(matches || (isNotify && !matches)) && (
                <Notifications uid={user._id} token={user.token} />
              )}
            </div>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
  return (
    <div style={{ flexGrow: 1 }}>
      <Loading />
    </div>
  );
};
export default Home;
