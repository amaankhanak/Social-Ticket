import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    fetch("/allpost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        setData(result.posts);
      });
  }, []);

  const likePost = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const unlikePost = (id) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const makeComment = (text, postId) => {
    fetch("comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId,
        text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deletePost = (postid) => {
    fetch(`/deletepost/${postid}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.filter((item) => {
          return item._id != result._id;
        });
        setData(newData);
      });
  };

  const deleteComment = (postid, commentid) => {
    fetch(`/deletecomment/${postid}/${commentid}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      });
  };

  return (
    <div className="home">
      {data.map((item) => {
        return (
          <div className="card home-card" key={item._id}>
            <div
              className="post-heading"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div className="top-left">
                <h5
                  style={{
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={item.postedBy.pic}
                    style={{
                      height: "40px",
                      width: "40px",
                      borderRadius: "50%",
                      marginRight: "10px",
                    }}
                  />
                  <Link
                    to={
                      item.postedBy._id !== state._id
                        ? "/profile/" + item.postedBy._id
                        : "/profile/"
                    }
                  >
                    {item.postedBy.name}
                  </Link>
                </h5>
              </div>
              <div className="top-right">
                {item.postedBy._id == state._id && (
                  <i
                    className="material-icons delete"
                    style={{ cursor: "pointer", marginRight: "20px" }}
                    onClick={() => deletePost(item._id)}
                  >
                    delete
                  </i>
                )}
              </div>
            </div>

            <div className="card-image">
              <img src={item.photo} />
            </div>
            <div className="card-content">
              <i className="material-icons">favorite</i>
              {item.likes.includes(state._id) ? (
                <i
                  className="material-icons"
                  style={{
                    cursor: "pointer",
                    marginLeft: "14px",
                  }}
                  onClick={() => {
                    unlikePost(item._id);
                  }}
                >
                  thumb_down
                </i>
              ) : (
                <i
                  className="material-icons blue-text"
                  style={{
                    cursor: "pointer",
                    marginLeft: "14px",
                  }}
                  onClick={() => {
                    likePost(item._id);
                  }}
                >
                  thumb_up
                </i>
              )}

              <h6 style={{ marginBottom: "26px" }}>
                {item.likes.length} Likes
              </h6>
              <h6>{item.title}</h6>
              <p>{item.body}</p>
              <p
                style={{
                  marginTop: "10px",
                  textDecoration: "underline",
                  fontStyle: "italic",
                }}
              >
                COMMENTS -
              </p>
              {item.comments.map((record) => {
                return (
                  <h6 key={record._id}>
                    <span
                      style={{
                        textDecoration: "underline",
                        textTransform: "uppercase",
                      }}
                    >
                      {record.postedBy.name}:
                    </span>
                    <span className="comment" style={{ marginLeft: "10px" }}>
                      {record.text}
                    </span>
                    {(item.postedBy._id || record.postedBy._id) ==
                      state._id && (
                      <i
                        className="material-icons comment-delete"
                        style={{
                          float: "right",
                        }}
                        onClick={() => deleteComment(item._id, record._id)}
                      >
                        delete
                      </i>
                    )}
                  </h6>
                );
              })}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  makeComment(e.target[0].value, item._id);
                }}
              >
                <input type="text" placeholder="Add a comment" />
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Home;
