import React, { useContext } from "react";
import { Link } from "react-router-dom";
import ReactToolTip from "react-tooltip";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";

export default function HeaderLoogedIn() {
  const appDisPatch = useContext(DispatchContext);
  const appState = useContext(StateContext);
  const handleLogOut = (e) => {
    appDisPatch({ type: "logout" });
  };

  const handleSearchIcon = (e) => {
    e.preventDefault();
    appDisPatch({ type: "openSearch" });
  };
  return (
    <div className="flex-row my-3 my-md-0">
      <a
        onClick={handleSearchIcon}
        href="#"
        className="text-white mr-2 header-search-icon"
        data-for="search"
        data-tip="Search"
      >
        <i className="fas fa-search"></i>
      </a>
      <ReactToolTip place="bottom" id="search" />
      <span
        onClick={(e) => appDisPatch({ type: "toggleChat" })}
        className="mr-2 header-chat-icon text-white"
        data-for="chat"
        data-tip="Chat"
      >
        <i className="fas fa-comment"></i>
        <span className="chat-count-badge text-white"> </span>
      </span>
      <ReactToolTip place="bottom" id="chat" />
      <Link
        to={`/profile/${appState.user.username}`}
        className="mr-2"
        data-for="profile"
        data-tip="Profile"
      >
        <img className="small-header-avatar" src={appState.user.avatar} />
      </Link>
      <ReactToolTip id="profile" />
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
