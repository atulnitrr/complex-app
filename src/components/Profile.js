import React, { useEffect, useContext, useState } from "react";
import Axios from "axios";
import { useImmer } from "use-immer";
import Page from "./Page";
import ProfilePosts from "./ProfilePosts";
import { useParams } from "react-router-dom";

import StateContext from "../StateContext";

export default function Profile() {
  const pathData = useParams();
  const appState = useContext(StateContext);
  const [state, setState] = useImmer({
    followActionLoading: false,
    startFollwoingRequestCount: 0,
    stopFollwoingRequestCount: 0,
    profileData: {
      profileUsername: "....",
      profileAvatar: "https://gravatar.com/avatar/placceholder/?s=128",
      isFollowing: false,
      counts: {
        postCount: 0,
        followerCount: 0,
        followingCount: 0,
      },
    },
  });
  const [profileData, setProfileData] = useState({});
  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    async function fetcchData() {
      try {
        const response = await Axios.post(
          `/profile/${pathData.username}`,
          {
            token: appState.user.token,
          },
          {
            cancelToken: ourRequest.token,
          }
        );
        setState((draft) => {
          draft.profileData = response.data;
        });
      } catch (error) {
        console.log("There was problem ");
      }
    }
    fetcchData();

    return () => {
      ourRequest.cancel();
    };
  }, []);

  useEffect(() => {
    if (state.startFollwoingRequestCount) {
      setState((draft) => {
        draft.followActionLoading = true;
      });
      const ourRequest = Axios.CancelToken.source();
      async function geetData() {
        try {
          const response = await Axios.post(
            `/addFollow/${state.profileData.profileUsername}`,
            {
              token: appState.user.token,
            },
            {
              cancelToken: ourRequest.token,
            }
          );
          console.log("Follow request ");
          console.log(response.data);
          setState((draft) => {
            draft.profileData.isFollowing = true;
            draft.profileData.counts.followerCount += 1;
            draft.followActionLoading = false;
          });
        } catch (error) {
          console.log("Error happened");
        }
      }

      geetData();
      return () => {
        ourRequest.cancel();
      };
    }
  }, [state.startFollwoingRequestCount]);

  useEffect(() => {
    if (state.stopFollwoingRequestCount > 0) {
      setState((draft) => {
        draft.followActionLoading = true;
      });
      const ourRequest = Axios.CancelToken.source();
      async function fetcchData() {
        try {
          const response = Axios.post(
            `/removeFollow/${state.profileData.profileUsername}`,
            {
              token: appState.user.token,
            },
            {
              cancelToken: ourRequest.token,
            }
          );
          setState((draft) => {
            draft.profileData.isFollowing = false;
            draft.profileData.counts.followerCount--;
            draft.followActionLoading = false;
          });
        } catch (error) {}
      }
      fetcchData();

      return () => {
        ourRequest.cancel();
      };
    }
  }, [state.stopFollwoingRequestCount]);

  const startFollowing = (e) => {
    setState((draft) => {
      draft.startFollwoingRequestCount++;
    });
  };

  const stopFollowing = (e) => {
    setState((draft) => {
      draft.stopFollwoingRequestCount++;
    });
  };
  return (
    <Page title="Profile screen">
      <h2>
        <img className="avatar-small" src={state.profileData.profileAvatar} />{" "}
        {state.profileData.profileUsername}
        {appState.loggedIn &&
          !state.profileData.isFollowing &&
          appState.user.username != state.profileData.profileUsername &&
          state.profileData.profileUsername != "..." && (
            <button
              onClick={startFollowing}
              disabled={state.followActionLoading}
              className="btn btn-primary btn-sm ml-2"
            >
              Follow <i className="fas fa-user-plus"></i>
            </button>
          )}
        {appState.loggedIn &&
          state.profileData.isFollowing &&
          appState.user.username != state.profileData.profileUsername &&
          state.profileData.profileUsername != "..." && (
            <button
              onClick={stopFollowing}
              disabled={state.followActionLoading}
              className="btn btn-danger btn-sm ml-2"
            >
              Stop Following <i className="fas fa-user-times"></i>
            </button>
          )}
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <a href="#" className="active nav-item nav-link">
          Posts: {state.profileData.counts.postCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Followers: {state.profileData.counts.followerCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Following: {state.profileData.counts.followingCount}
        </a>
      </div>
      <ProfilePosts />
    </Page>
  );
}
