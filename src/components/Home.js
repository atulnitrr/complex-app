import React, { useContext, useEffect } from "react";
import StateContext from "../StateContext";
import { useImmer } from "use-immer";
import Post from "../components/Post";
import Axios from "axios";
import { Link } from "react-router-dom";
import LoadingIcon from "../components/LoadingIcon";

import Page from "./Page";

export default function Home() {
  const appState = useContext(StateContext);
  const [state, setState] = useImmer({
    isLoading: true,
    feed: [],
  });

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    async function fetchData() {
      try {
        console.log("started ---");
        const response = await Axios.post(
          `/getHomeFeed`,
          {
            token: appState.user.token,
          },
          {
            cancelToken: ourRequest.cancel,
          }
        );
        console.log("Jhome feed data");
        console.log(response.data);
        setState((draft) => {
          draft.isLoading = false;
          draft.feed = response.data;
        });
      } catch (error) {
        console.log("someething happened");
      }
    }
    fetchData();

    return () => {
      ourRequest.cancel();
    };
  }, []);

  if (state.isLoading) {
    return <LoadingIcon />;
  }

  return (
    <Page>
      {state.feed.length >
        0(
          <>
            <h2 className="text-center mb-4">
              The latest from those who u follow
            </h2>
            <div className="list-group">
              {state.feed.results.map((post) => {
                return <Post post={post} key={post._id} />;
              })}
            </div>
          </>
        )}
      {state.feed.length == 0 && (
        <>
          <h2 className="text-center">
            Hello <strong>{appState.user.username}</strong>, your feed is empty.
          </h2>
          <p className="lead text-muted text-center">
            Your feed displays the latest posts from the people you follow. If
            you don&rsquo;t have any friends to follow that&rsquo;s okay; you
            can use the &ldquo;Search&rdquo; feature in the top menu bar to find
            content written by people with similar interests and then follow
            them.
          </p>
        </>
      )}
    </Page>
  );
}
