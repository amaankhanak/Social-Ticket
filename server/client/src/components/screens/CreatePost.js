import React, { useState, useEffect } from "react";
import "./CreatePost.css";
import M from "materialize-css";
import { useHistory } from "react-router-dom";

const CreatePost = () => {
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (url) {
      fetch("/createpost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          title,
          body,
          pic: url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            M.toast({ html: data.error });
          } else {
            M.toast({ html: "new post created" });
            history.push("/");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [url]);

  const postDetails = () => {
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
        setUrl(data.url);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className="bg">
        <div
          className="card input-filed card2"
          style={{
            margin: "30px auto",
            maxWidth: "500px",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <input
            type="text"
            placeholder="Title"
            style={{ color: "white" }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Body"
            style={{ color: "white" }}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <div className="file-field input-field" style={{ color: "white" }}>
            <div
              className="btn light-green accent-3"
              style={{ fontWeight: "600" }}
            >
              <span style={{ fontFamily: "Poppins" }}>Upload Image</span>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
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
          <button
            class="btn waves-effect light-green accent-3"
            type="submit"
            name="action"
            style={{ fontWeight: "600", fontFamily: "Poppins" }}
            onClick={() => postDetails()}
          >
            Submit
            <i class="material-icons right ">send</i>
          </button>
        </div>
      </div>
    </>
  );
};

export default CreatePost;
