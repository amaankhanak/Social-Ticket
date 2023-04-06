import React, { useState, useContext } from "react";
import "./Signin.css";
import { Link, useHistory, useParams } from "react-router-dom";
import M from "materialize-css";

const Signin = () => {
  const history = useHistory();
  const [password, setPassword] = useState("");
  const { token } = useParams();
  console.log(token);

  const PostData = () => {
    fetch("/new-password", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
        token,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
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
          <header style={{ fontFamily: "Poppins", fontSize: "25px" }}>
            Set New Password
          </header>
          <form action="#">
            <div className="field" style={{ marginTop: "16px" }}>
              <span className="fa fa-lock"></span>
              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {/* BUTTON */}
            <div className="login" style={{ marginTop: "20px" }}>
              <Link to="#" onClick={() => PostData()}>
                <span>Change Password</span>
              </Link>
            </div>
          </form>
          <div className="signup">
            Don't have account?
            <Link to="/signup">Signup Now</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signin;
