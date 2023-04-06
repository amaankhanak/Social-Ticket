import React, { useEffect, useState } from "react";
import "./Signup.css";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";

const Signup = () => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState(undefined);
  useEffect(() => {
    if (url) {
      uploadFields();
    }
  }, [url]);

  const uploadPic = () => {
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

  const uploadFields = () => {
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      M.toast({ html: "invalid email" });
      return;
    }
    fetch("/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        password,
        email,
        pic: url,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error });
        } else {
          M.toast({ html: data.message });
          history.push("/signin");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const PostData = () => {
    if (image) {
      uploadPic();
    } else {
      uploadFields();
    }
  };

  return (
    <>
      <div className="bg-img">
        <div className="content">
          <header>Social-Ticket</header>
          <form action="#">
            <div className="field">
              <span
                className="fa fa-address-card	
"
              ></span>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="field" style={{ marginTop: "16px" }}>
              <span className="fa fa-user"></span>
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div
              className="field"
              style={{ marginTop: "16px", marginBottom: "16px" }}
            >
              <span className="fa fa-lock"></span>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="file-field input-field" style={{ color: "white" }}>
              <div
                className="btn light-green accent-3"
                style={{ fontWeight: "600" }}
              >
                <span style={{ fontFamily: "Poppins" }}>Profile Picture</span>
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

            {/* BUTTON */}
            <div className="login" onClick={() => PostData()}>
              <Link to="#">
                <span>Sign Up</span>
              </Link>
            </div>
          </form>
          <div className="signup">
            Already have an account?
            <Link to="/signin">Login here</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
