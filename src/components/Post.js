import React from "react";
import { Link } from "react-router-dom";

export default function Post({ post }) {
  const date = new Date(post.createdDate);
  const dateFormatted = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`;
  return (
    <Link
      key={post._id}
      to={`/post/${post._id}`}
      className="list-group-item list-group-item-action"
    >
      <img className="avatar-tiny" src={post.author.avatar} />{" "}
      <strong>{post.title}</strong>{" "}
      <span className="text-muted small">
        by {post.author.username} on {dateFormatted}{" "}
      </span>
    </Link>
  );
}
