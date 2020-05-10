import React, { useState, useContext, useEffect } from "react";
import { useImmerReducer } from "use-immer";
import Axios from "axios";
import { useParams, Link } from "react-router-dom";
import Page from "./Page";
import LoadingIcon from "./LoadingIcon";
import StateContext from "../StateContext";

export default function EditPost() {
  const appState = useContext(StateContext);
  const originalState = {
    title: {
      value: "",
      hasError: false,
      message: "",
    },
    body: {
      value: "",
      hasError: false,
      message: "",
    },
    isFetching: true,
    isSaving: false,
    id: useParams().id,
    sendCount: 0,
    createdDate: "",
  };
  function ourRducer(draft, action) {
    switch (action.type) {
      case "fetchComplete":
        draft.title.value = action.value.title;
        draft.body.value = action.value.body;
        draft.isFetching = false;
        draft.createdDate = action.value.createdDate;
        break;
      case "titleChange":
        draft.title.hasError = false;
        draft.title.value = action.value;
        break;
      case "bodyChange":
        draft.body.hasError = false;
        draft.body.value = action.value;
        break;
      case "submitRequest":
        if (!draft.title.hasError && !draft.body.hasError) {
          draft.sendCount++;
        }
        break;
      case "savePostStarted":
        draft.isSaving = true;
        break;
      case "savePostEnd":
        draft.isSaving = false;
        break;
      case "titleRule":
        if (!action.value.trim()) {
          draft.title.hasError = true;
          draft.title.message = "You must give title";
        }
        break;
      case "bodyRule":
        if (!action.value.trim()) {
          draft.body.hasError = true;
          draft.body.message = "You must give body";
        }
        break;
      default:
        break;
    }
  }
  const [state, dispatch] = useImmerReducer(ourRducer, originalState);

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    async function fetchPostData() {
      const response = await Axios.get(`/post/${state.id}`, {
        cancelToken: ourRequest.token,
      });
      console.log(response.data);
      dispatch({ type: "fetchComplete", value: response.data });
    }

    fetchPostData();
    return () => {
      ourRequest.cancel();
    };
  }, []);

  useEffect(() => {
    if (state.sendCount) {
      dispatch({ type: "savePostStarted" });
      const ourRequest = Axios.CancelToken.source();
      const updtePost = async () => {
        const response = await Axios.post(
          `/post/${state.id}/edit`,
          {
            title: state.title.value,
            body: state.body.value,
            token: appState.user.token,
          },
          {
            cancelToken: ourRequest.token,
          }
        );
        dispatch({ type: "savePostEnd" });
        console.log("Console data updapge");
        console.log(response);
      };
      updtePost();

      return () => {
        ourRequest.cancel();
      };
    }
  }, [state.sendCount]);

  if (state.isFetching) {
    return <LoadingIcon />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: "titleRule", value: state.title.value });
    dispatch({ type: "bodyRule", value: state.body.value });
    dispatch({ type: "submitRequest" });
  };

  return (
    <Page title="Edit post">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          {state.title.hasError && (
            <div className="alert alert-danger small liveValidateMessage">
              {state.title.message}
            </div>
          )}
          <input
            autoFocus
            name="title"
            id="post-title"
            className="form-control form-control-lg form-control-title"
            type="text"
            placeholder=""
            autoComplete="off"
            value={state.title.value}
            onChange={(e) =>
              dispatch({ type: "titleChange", value: e.target.value })
            }
            onBlur={(e) =>
              dispatch({ type: "titleRule", value: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea
            name="body"
            id="post-body"
            className="body-content tall-textarea form-control"
            type="text"
            value={state.body.value}
            onChange={(e) =>
              dispatch({ type: "bodyChange", value: e.target.value })
            }
            onBlur={(e) =>
              dispatch({ type: "bodyRule", value: e.target.value })
            }
          ></textarea>
          {state.body.hasError && (
            <div className="alert alert-danger small liveValidateMessage">
              {state.body.message}
            </div>
          )}
        </div>

        <button className="btn btn-primary" disabled={state.isSaving}>
          {state.isSaving ? "Saving ..." : "Update Post"}
        </button>
      </form>
    </Page>
  );
}
