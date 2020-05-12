import React, { useEffect, useState } from "react";
import Axios from "axios";

import { useParams, Link } from "react-router-dom";

export default function ProfileFollowers() {
  const [isLoading, setIsLoaing] = useState(true);
  const [posts, setPosts] = useState([]);
  const { username } = useParams();

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    async function fetchPosts() {
      try {
        setIsLoaing(true);
        const response = await Axios.get(`/profile/${username}/followers`, {
          cancelToken: ourRequest.token,
        });
        setPosts(response.data);
        setIsLoaing(false);
      } catch (error) {}
    }

    fetchPosts();

    return () => {
      ourRequest.cancel();
    };
  }, [username]);

  if (isLoading) {
    return <div>Loading ....</div>;
  } else
    return (
      <div className="list-group">
        {posts.map((follower, index) => {
          return (
            <Link
              key={index}
              to={`/profile/${follower.username}`}
              className="list-group-item list-group-item-action"
            >
              <img className="avatar-tiny" src={follower.avatar} />
              {follower.username}
            </Link>
          );
        })}
      </div>
    );
}
