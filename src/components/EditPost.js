import React, { useState, useContext, useEffect } from "react";
import { useImmerReducer } from "use-immer";
import Axios from "axios";
import { useParams, Link } from "react-router-dom";
import Page from "./Page";
import LoadingIcon from "./LoadingIcon";

export default function EditPost() {
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

  if (state.isFetching) {
    return <LoadingIcon />;
  }

  return (
    <Page title="Edit  post">
      <form>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input
            autoFocus
            name="title"
            id="post-title"
            className="form-control form-control-lg form-control-title"
            type="text"
            placeholder=""
            autoComplete="off"
            value={state.title.value}
            onChange={(e) => console.log("kj")}
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
            onChange={(e) => console.log("")}
          ></textarea>
        </div>

        <button className="btn btn-primary">Update Post</button>
      </form>
    </Page>
  );
}
