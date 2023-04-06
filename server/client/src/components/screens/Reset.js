import React, { useState, useContext } from "react";
import "./Signin.css";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";

const Reset = () => {
  const history = useHistory();

  const [email, setEmail] = useState("");

  const PostData = () => {
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      M.toast({ html: "invalid email" });
      return;
    }
    fetch("/reset-password", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
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

  return (
    <>
      <div className="bg-img">
        <div className="content">
          <header
            style={{
              fontFamily: "Poppins",
              fontWeight: "400",
              fontSize: "26px",
            }}
          >
            Forgot Password?
          </header>
          <form action="#">
            <div className="field">
              <span className="fa fa-user"></span>
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* BUTTON */}
            <div className="login" style={{ marginTop: "20px" }}>
              <Link to="#" onClick={() => PostData()}>
                <span>Reset Password</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Reset;
