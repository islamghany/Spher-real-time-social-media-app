import React, { useState,useEffect } from "react";
import { Search, SvgSearch } from "../../assets/icons/icons";
import { useForm } from "react-hook-form";
import UserPlaceholder from "./user-placeholder";
import { useFetch } from "../../shared/hooks/useFetch";
import UserItem from "./users.js";
import { useSelector, useDispatch } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
const Friends = React.memo(() => {
  const users = useSelector((state) => state.searchedUsers);
  const { register, handleSubmit, errors } = useForm();
  const { loading, request, error } = useFetch();
  const dispatch = useDispatch();
  const [length, setLength] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [key, setKey] = useState(null);
  const handleUsers = async (word, n) => {
    try {
      const responseData = await request(
        process.env.REACT_APP_BACKEND_URL +
          `/users?q=${word}&skip=${n ? 0 : users.length}`,
        "get"
      );
      if (responseData.data.users.length < 10) setHasMore(false);
      if (n) setLength(responseData.data.length);
      if (n && !responseData.data.length) {
        dispatch({ type: "NEW_SEARCH", payload: [] });
      }
      if (n) {
        dispatch({ type: "NEW_SEARCH", payload: responseData.data.users });
      } else {
        dispatch({ type: "SAVE_SEARCH", payload: responseData.data.users });
      }
    } catch (err) {
      console.log(error);
    }
  };
  const onSubmit = (data) => {
    setKey(data.keyword);
    handleUsers(data.keyword.trim(), true);
  };
   useEffect(()=>{
    document.title="Friends";
   },[])
  return (
    <div className="friends">
      <div className="friends__container">
        <div className="friends__header">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="friends__form__unit">
              <input
                type="text"
                name="keyword"
                className="friends__search"
                ref={register}
                required
              />
              <span className="icon">
                <Search width="2.2rem" height="2.2rem" />
              </span>
              <button className="btn btn--contained1-primary mg-none">
                {" "}
                Search
              </button>
            </div>
          </form>
        </div>

        <div className="friends__users">
          {loading && (
            <div>
              <UserPlaceholder />
              <UserPlaceholder />
              <UserPlaceholder />
              <UserPlaceholder />
            </div>
          )}
          {users.length && !loading && (
            <InfiniteScroll
              dataLength={length}
              next={() => handleUsers(key)}
              hasMore={key ? hasMore : false}
              loader={
                <div>
                  {" "}
                  <UserPlaceholder />
                  <UserPlaceholder />
                </div>
              }
            
            >
              {users.map((user) => (
                <UserItem user={user} />
              ))}
              ;
            </InfiniteScroll>
          )}{" "}
          {!users.length && key && (
            <h1 className="text-center no-more">no users found!</h1>
          )}
          {!users.length && !key && !loading && (
            <div className="img-container">
              <SvgSearch />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
//

export default Friends;
