import React from "react";
import Posts from "./posts/posts.js";
import Grid from "@material-ui/core/Grid";
import Services from "./services/services";
import UserSidebar from "./users/user-sidebar";
import { useSelector } from "react-redux";
import Loading from "../shared/loading.js";

const Home = () => {

  const user = useSelector(state => state.currentUser);
  if (user && user.img) {
    return (
      <div style={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          <Grid item xg={3} lg={3} md={3} sm={4} xs={12}>
            <UserSidebar
              data={{
                _id: user._id,
                token: user.token,
                expiration: user.expiration
              }}
            />
          </Grid>
          <Grid item xg={6} lg={6} md={6} sm={8} xs={12} className="order">
            <Posts currentUser={user} />
          </Grid>
          <Grid item xg={3} lg={3} md={3} sm={8} xs={12}>
            <Services />
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
