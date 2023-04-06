import React, { useContext, useRef, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "./Navbar.css";
import { UserContext } from "../App";
import M from "materialize-css";

const Navbar = () => {
  const searchModal = useRef(null);
  const [search, setSearch] = useState("");
  const [userDetails, setUserDetails] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    M.Modal.init(searchModal.current);
  }, []);

  const renderList = () => {
    if (state) {
      return [
        <li key="1">
          <i
            data-target="modal1"
            className="large material-icons search modal-trigger"
          >
            search
          </i>
        </li>,
        <li key="2">
          <Link to="/profile">Profile</Link>
        </li>,
        <li key="3">
          <Link to="/create">Create Post</Link>
        </li>,
        <li key="4">
          <Link to="/myfollowingpost">Accounts I Follow</Link>
        </li>,
        <li key="5">
          <button
            className="btn waves-effect light-green accent-3"
            style={{
              fontWeight: "600",
              fontFamily: "Poppins",
              marginRight: "20px",
            }}
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "CLEAR" });
              history.push("/signin");
              window.location.reload();
            }}
          >
            LOGOUT
          </button>
        </li>,
      ];
    } else {
      return [
        <li key="6">
          <Link to="/signin">Signin</Link>
        </li>,
        <li key="7">
          <Link to="/signup">Signup</Link>
        </li>,
      ];
    }
  };

  const fetchUsers = (query) => {
    setSearch(query);
    fetch("/search-users", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    })
      .then((res) => res.json())
      .then((results) => {
        setUserDetails(results.user);
      });
  };

  return (
    <>
      <nav>
        <div className="nav-wrapper nav">
          <Link to={state ? "/" : "/signin"} className="brand-logo left">
            Social-Ticket
          </Link>
          <Link
            to="#"
            className="sidenav-trigger right"
            data-target="mobile-links"
          >
            <i className="material-icons">menu</i>
          </Link>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            {renderList()}
          </ul>
        </div>

        <div id="modal1" class="modal" ref={searchModal}>
          <div className="modal-content">
            <input
              type="text"
              placeholder="Search users by Email"
              value={search}
              onChange={(e) => fetchUsers(e.target.value)}
            />
            <ul class="collection">
              {userDetails.map((item) => {
                return (
                  <Link
                    to={
                      item._id !== state.id
                        ? "/profile/" + item._id
                        : "/profile"
                    }
                    onClick={() => {
                      M.Modal.getInstance(searchModal.current).close();
                      setSearch("");
                    }}
                  >
                    <li className="collection-item">{item.email}</li>
                  </Link>
                );
              })}
            </ul>
          </div>
          <div className="modal-footer">
            <button
              className="modal-close waves effect light-green accent-3 btn-flat"
              style={{ fontWeight: "bold" }}
              onClick={() => setSearch("")}
            >
              Close
            </button>
          </div>
        </div>
      </nav>
      <ul
        className="sidenav mobile-color"
        id="mobile-links"
        style={{ width: "176px" }}
      >
        {renderList()}
      </ul>
    </>
  );
};

export default Navbar;
