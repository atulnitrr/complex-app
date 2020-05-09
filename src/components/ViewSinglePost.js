import React, { useState, useContext, useEffect } from "react";
import Axios from "axios";
import { useParams, Link } from "react-router-dom";
import Page from "./Page";

export default function ViewSinglePost() {
  const [isLoading, setIsloaig] = useState(true);
  const [post, setPost] = useState();
  const id = useParams();
  useEffect(() => {
    async function fetchPostData() {
      console.log(id);
      console.log(id.id);
      const response = await Axios.get(`/post/${id.id}`);
      console.log(response.data);
      setPost(response.data);
      setIsloaig(false);
    }

    fetchPostData();
  }, []);

  if (isLoading) {
    return <div>Loading post ....</div>;
  }

  const date = new Date(post.createdDate);
  const dateFormatted = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`;

  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        <span className="pt-2">
          <a href="#" className="text-primary mr-2" title="Edit">
            <i className="fas fa-edit"></i>
          </a>
          <a className="delete-post-button text-danger" title="Delete">
            <i className="fas fa-trash"></i>
          </a>
        </span>
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

      <div className="body-content">{post.body}</div>
    </Page>
  );
}
