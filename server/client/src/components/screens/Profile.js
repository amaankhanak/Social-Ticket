import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import "./Profile.css";

const Profile = () => {
  const [mypics, setPics] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const [image, setImage] = useState("");
  const [url, setUrl] = useState(undefined);

  useEffect(() => {
    fetch("/mypost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setPics(result.mypost);
      });
  }, []);

  useEffect(() => {
    if (image) {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "social-ticket");
      data.append("cloud_name", "zackakz");
      fetch("https://api.cloudinary.com/v1_1/zackakz/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          // localStorage.setItem(
          //   "user",
          //   JSON.stringify({ ...state, pic: data.url })
          // );
          // dispatch({ type: "UPDATEPIC", payload: data.url });
          fetch("/updatepic", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
              pic: data.url,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              console.log(result);
              localStorage.setItem(
                "user",
                JSON.stringify({ ...state, pic: result.pic })
              );
              dispatch({ type: "UPDATEPIC", payload: result.pic });
            });
          // window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [image]);

  const updatePhoto = (file) => {
    setImage(file);
  };

  return (
    <>
      <div
        className="profile-main"
        style={{
          maxWidth: "550px",
          margin: "0px auto",
        }}
      >
        <div className="profile-info">
          <div
            className="img"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              style={{
                widows: "160px",
                height: "160px",
                borderRadius: "80px",
              }}
              src={state ? state.pic : "loading"}
            />

            <div className="file-field input-field" style={{ color: "white" }}>
              <div
                className="btn light-green accent-3"
                style={{
                  width: "200px",
                  height: "30px",
                  fontSize: "12px",
                  fontWeight: "800",
                  fontFamily: "Poppins",
                  marginTop: "6px",
                  color: "black",
                  paddingBottom: "40px",
                }}
              >
                <span style={{ fontFamily: "Poppins" }}>
                  Update Profile Picture
                </span>
                <input
                  type="file"
                  onChange={(e) => updatePhoto(e.target.files[0])}
                />
              </div>
              <div className="file-path-wrapper">
                <input
                  style={{ color: "white" }}
                  className="file-path validate"
                  type="text"
                />
              </div>
            </div>
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
              {state ? state.name : "loading"}
            </h4>
            <h6 style={{ marginTop: "-6px", marginBottom: "20px" }}>
              {state ? state.email : "loading"}
            </h6>
          </div>
          <div className="numbers">
            <h6>{mypics.length} posts</h6>
            <h6>{state ? state.followers.length : "0"} followers</h6>
            <h6>{state ? state.following.length : "0"} following</h6>
          </div>
        </div>

        <div className="gallery">
          {mypics.map((item) => {
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
    </>
  );
};

export default Profile;
