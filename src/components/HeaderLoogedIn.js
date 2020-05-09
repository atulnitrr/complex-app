import React, { useContext } from "react";
import { Link } from "react-router-dom";
import ExampleContext from "../ExampleContext";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";

export default function HeaderLoogedIn() {
  const appDisPatch = useContext(DispatchContext);
  const appState = useContext(StateContext);
  const handleLogOut = (e) => {
    appDisPatch({ type: "logout" });
  };
  return (
    <div className="flex-row my-3 my-md-0">
      <a href="#" className="text-white mr-2 header-search-icon">
        <i className="fas fa-search"></i>
      </a>
      <span className="mr-2 header-chat-icon text-white">
        <i className="fas fa-comment"></i>
        <span className="chat-count-badge text-white"> </span>
      </span>
      <a href="#" className="mr-2">
        <img className="small-header-avatar" src={appState.user.avatar} />
      </a>
      <Link className="btn btn-sm btn-success mr-2" to="/create-post">
        Create Post
      </Link>
      <button
        className="btn btn-sm btn-secondary"
        onClick={(e) => appDisPatch({ type: "logout" })}
      >
        Sign Out
      </button>
    </div>
  );
}
