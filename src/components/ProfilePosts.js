import React, { useEffect, useState } from "react";
import Axios from "axios";

import { useParams, Link } from "react-router-dom";

export default function ProfilePosts() {
  const [isLoading, setIsLoaing] = useState(true);
  const [posts, setPosts] = useState([]);
  const { username } = useParams();

  useEffect(() => {
    async function fetchPosts() {
      try {
        setIsLoaing(true);
        const response = await Axios.get(`/profile/${username}/posts`);
        setPosts(response.data);
        setIsLoaing(false);
      } catch (error) {}
    }

    fetchPosts();
  }, []);

  if (isLoading) {
    return <div>Loading ....</div>;
  } else
    return (
      <div className="list-group">
        {posts.map((post) => {
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
              <span className="text-muted small">on {dateFormatted} </span>
            </Link>
          );
        })}
      </div>
    );
}
