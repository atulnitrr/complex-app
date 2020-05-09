import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";

import DispatchContext from "../DispatchContext";
export default function HeaderLoggedOut(props) {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useContext(DispatchContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await Axios.post("/login", {
        username,
        password,
      });
      if (data.data) {
        console.log(data);
        localStorage.setItem("cpToken", data.data.token);
        localStorage.setItem("cpUserName", data.data.username);
        localStorage.setItem("cpAvatar", data.data.avatar);
        dispatch({ type: "login", data: data.data });
      } else {
        console.log("Incorrect user name ");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form className="mb-0 pt-2 pt-md-0" onSubmit={handleSubmit}>
      <div className="row align-items-center">
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input
            name="username"
            className="form-control form-control-sm input-dark"
            type="text"
            placeholder="Username"
            autoComplete="off"
            onChange={(e) => setUserName(e.target.value)}
            value={username}
          />
        </div>
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input
            name="password"
            className="form-control form-control-sm input-dark"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <div className="col-md-auto">
          <button className="btn btn-success btn-sm">Sign In</button>
        </div>
      </div>
    </form>
  );
}
