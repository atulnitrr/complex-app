import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HeaderLoggedOut from "./HeaderLoggedOut";
import HeaderLoogedIn from "./HeaderLoogedIn";

export default function Header({ loggedIn, setLoggedIn }) {
  return (
    <header className="header-bar bg-primary mb-3">
      <div className="container d-flex flex-column flex-md-row align-items-center p-3">
        <h4 className="my-0 mr-md-auto font-weight-normal">
          <Link to="/" className="text-white">
            ComplexApp
          </Link>
        </h4>
        {loggedIn ? (
          <HeaderLoogedIn setLoggedIn={setLoggedIn} />
        ) : (
          <HeaderLoggedOut setLoggedIn={setLoggedIn} />
        )}
      </div>
    </header>
  );
}
