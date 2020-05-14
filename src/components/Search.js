import React, { useContext, useState, useEffect } from "react";
import { useImmer } from "use-immer";
import { Link } from "react-router-dom";
import Axios from "axios";
import Post from "../components/Post";
import DispatchContext from "../DispatchContext";

function Search() {
  const appDispatch = useContext(DispatchContext);
  const [state, setState] = useImmer({
    searchTerm: "",
    results: [],
    show: "neither",
    requestCount: 0,
  });

  useEffect(() => {
    document.addEventListener("keyup", searckKeyPresshandler);

    return () => {
      document.removeEventListener("keyup", searckKeyPresshandler);
    };
  }, []);

  useEffect(() => {
    if (state.searchTerm.trim()) {
      setState((draft) => {
        draft.show = "loading";
      });
      const dealy = setTimeout(() => {
        setState((draft) => {
          draft.requestCount++;
        });
      }, 700);

      return () => {
        clearTimeout(dealy);
      };
    } else {
      setState((draft) => {
        draft.show = "neither";
      });
    }
  }, [state.searchTerm]);

  useEffect(() => {
    if (state.requestCount > 0) {
      const ourRequest = Axios.CancelToken.source();
      async function fetchResult() {
        try {
          const response = await Axios.post(
            `/search`,
            {
              searchTerm: state.searchTerm,
            },
            {
              cancelToken: ourRequest.token,
            }
          );
          console.log("search");
          setState((draft) => {
            draft.results = response.data;
            draft.show = "results";
          });
        } catch (error) {
          console.log("There was a problem");
        }
      }
      fetchResult();

      return () => ourRequest.cancel();
      // send axios request here
    }
  }, [state.requestCount]);

  const handleInput = (e) => {
    const value = e.target.value;
    setState((draft) => {
      draft.searchTerm = value;
    });
  };

  function searckKeyPresshandler(e) {
    if (e.keyCode == 27) {
      appDispatch({ type: "closeSearch" });
    }
  }

  return (
    <>
      <div className="search-overlay-top shadow-sm">
        <div className="container container--narrow">
          <label htmlFor="live-search-field" className="search-overlay-icon">
            <i className="fas fa-search"></i>
          </label>
          <input
            onChange={handleInput}
            autoFocus
            type="text"
            autoComplete="off"
            id="live-search-field"
            className="live-search-field"
            placeholder="What are you interested in?"
          />
          <span
            onClick={(e) => appDispatch({ type: "closeSearch" })}
            className="close-live-search"
          >
            <i className="fas fa-times-circle"></i>
          </span>
        </div>
      </div>

      <div className="search-overlay-bottom">
        <div className="container container--narrow py-3">
          <div
            className={
              "circle-loader " +
              (state.show == "loading" ? "circle-loader--visible" : "")
            }
          ></div>
          <div
            className={
              "live-search-results " +
              (state.show == "results" ? "live-search-results--visible" : "")
            }
          >
            <div className="list-group shadow-sm">
              <div className="list-group-item active">
                <strong>Search Results</strong> {state.results.length}{" "}
                {state.results.length <= 1 ? "item " : "items "}
                found
              </div>
              {state.results.map((post) => {
                const date = new Date(post.createdDate);
                const dateFormatted = `${
                  date.getMonth() + 1
                }/${date.getDate()}/${date.getFullYear()}`;
                return (
                  <Link
                    key={post._id}
                    to={`/post/${post._id}`}
                    className="list-group-item list-group-item-action"
                    onClick={(e) => appDispatch({ type: "closeSearch" })}
                  >
                    <img className="avatar-tiny" src={post.author.avatar} />{" "}
                    <strong>{post.title}</strong>{" "}
                    <span className="text-muted small">
                      by {post.author.username} on {dateFormatted}{" "}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Search;
