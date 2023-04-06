import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import "./Profile.css";
import { useParams } from "react-router-dom";

const Profile = () => {
  const [userProfile, setProfile] = useState(null);

  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();

  const [showFollow, setShowFollow] = useState(
    state ? !state.following.includes(userid) : true
  );

  useEffect(() => {
    fetch(`/user/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setProfile(result);
      });
  }, []);

  const followUser = () => {
    fetch("/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, data._id],
            },
          };
        });
        setShowFollow(false);
      });
  };

  const unfollowUser = () => {
    fetch("/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unfollowId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));

        setProfile((prevState) => {
          const newFollower = prevState.user.followers.filter(
            (item) => item != data._id
          );
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollower,
            },
          };
        });
        setShowFollow(true);
      });
  };

  return (
    <>
      {userProfile ? (
        <div
          className="profile-main"
          style={{
            maxWidth: "550px",
            margin: "0px auto",
          }}
        >
          <div className="profile-info">
            <div className="img">
              <img
                style={{
                  widows: "160px",
                  height: "160px",
                  borderRadius: "80px",
                }}
                src={userProfile.user.pic}
              />
            </div>
            <div
              className="name"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <h4 style={{ textTransform: "uppercase" }}>
                {userProfile.user.name}
              </h4>
              <h6 style={{ marginTop: "-6px", marginBottom: "20px" }}>
                {userProfile.user.email}
              </h6>
            </div>
            <div className="numbers">
              <h6>{userProfile.posts.length} posts</h6>
              <h6>{userProfile.user.followers.length} followers</h6>
              <h6>{userProfile.user.following.length} following</h6>
            </div>
            {showFollow ? (
              <button
                class="btn waves-effect light-green accent-3"
                type="submit"
                name="action"
                style={{
                  fontWeight: "600",
                  fontFamily: "Poppins",
                  marginTop: "10px",
                }}
                onClick={() => followUser()}
              >
                Follow
              </button>
            ) : (
              <button
                class="btn waves-effect light-green accent-3"
                type="submit"
                name="action"
                style={{
                  fontWeight: "600",
                  fontFamily: "Poppins",
                  marginTop: "10px",
                }}
                onClick={() => unfollowUser()}
              >
                UnFollow
              </button>
            )}
          </div>

          <div className="gallery">
            {userProfile.posts.map((item) => {
              return (
                <img
                  key={item._id}
                  className="item"
                  src={item.photo}
                  alt={item.title}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <h2 style={{ color: "white", margin: "auto" }}>loading...</h2>
      )}
    </>
  );
};

export default Profile;
