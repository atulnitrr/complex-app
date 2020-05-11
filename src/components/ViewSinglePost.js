import React, { useState, useContext, useEffect } from "react";
import Axios from "axios";
import { useParams, Link, withRouter } from "react-router-dom";
import Page from "./Page";
import LoadingIcon from "./LoadingIcon";
import NotFound from "./NotFound";
import ReactMarkdown from "react-markdown";
import ReactToolTip from "react-tooltip";
import StateContext from "../StateContext";

function ViewSinglePost(props) {
  const appState = useContext(StateContext);
  const [isLoading, setIsloaig] = useState(true);
  const [post, setPost] = useState();
  const { id } = useParams();
  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    async function fetchPostData() {
      const response = await Axios.get(`/post/${id}`, {
        cancelToken: ourRequest.token,
      });
      setPost(response.data);
      setIsloaig(false);
    }

    fetchPostData();
    return () => {
      ourRequest.cancel();
    };
  }, []);

  if (!isLoading && !post) {
    return <NotFound></NotFound>;
  }

  if (isLoading) {
    return <LoadingIcon />;
  }

  const date = new Date(post.createdDate);
  const dateFormatted = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`;

  const isOwner = () => {
    if (appState.loggedIn) {
      return appState.user.username == post.author.username;
    } else {
      return false;
    }
  };

  const deleteHandler = async (e) => {
    const areYouSure = window.confirm("Do you want to delete");
    if (areYouSure) {
      try {
        const response = await Axios.delete(`/post/${id}`, {
          data: {
            token: appState.user.token,
          },
        });
        if (response.data === "Success") {
          // display a flash message
          // redirect to current user
          props.history.push(`/profile/${appState.user.username}`);
        }
      } catch (error) {
        console.log("There was an erro");
      }
    } else {
    }
  };

  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        {isOwner() && (
          <span className="pt-2">
            <Link
              to={`/post/${post._id}/edit`}
              data-tip="Edit"
              data-for="edit"
              className="text-primary mr-2"
            >
              <i className="fas fa-edit"></i>
            </Link>
            <ReactToolTip id="edit" className="custom-tooltip" />{" "}
            <a
              data-tip="Delete"
              data-for="delete"
              className="delete-post-button text-danger"
              onClick={deleteHandler}
            >
              <i className="fas fa-trash"></i>
            </a>
            <ReactToolTip id="delete" className="custom-tooltip" />
          </span>
        )}
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar} />
        </Link>
        Posted by{" "}
        <Link to={`/profile/${post.author.username}`}>
          {post.author.username}
        </Link>{" "}
        on {dateFormatted}
      </p>

      <div className="body-content">
        <ReactMarkdown
          source={post.body}
          // allowedTypes={["paragraph", "strong", "heading", "list"]}
        />
      </div>
    </Page>
  );
}

export default withRouter(ViewSinglePost);
