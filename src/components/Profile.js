import React, { useEffect, useContext, useState } from "react";
import Axios from "axios";
import Page from "./Page";
import ProfilePosts from "./ProfilePosts";
import { useParams } from "react-router-dom";

import StateContext from "../StateContext";

export default function Profile() {
  const pathData = useParams();
  const appState = useContext(StateContext);
  const [profileData, setProfileData] = useState({
    profileUsername: "....",
    profileAvatar: "https://gravatar.com/avatar/placceholder/?s=128",
    isFollowing: false,
    counts: {
      postCount: 0,
      followerCount: 0,
      followingCount: 0,
    },
  });
  useEffect(() => {
    async function fetcchData() {
      try {
        const response = await Axios.post(`/profile/${pathData.username}`, {
          token: appState.user.token,
        });
        setProfileData(response.data);
      } catch (error) {
        console.log("There was problem ");
      }
    }
    fetcchData();
  }, []);

  return (
    <Page title="Profile screen">
      <h2>
        <img className="avatar-small" src={profileData.profileAvatar} />{" "}
        {profileData.profileUsername}
        <button className="btn btn-primary btn-sm ml-2">
          Follow <i className="fas fa-user-plus"></i>
        </button>
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <a href="#" className="active nav-item nav-link">
          Posts: {profileData.counts.postCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Followers: {profileData.counts.followerCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Following: {profileData.counts.followingCount}
        </a>
      </div>
      <ProfilePosts />
    </Page>
  );
}
