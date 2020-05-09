import React, { useState, useReducer, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import About from "./components/About";
import Terms from "./components/Terms";
import HomeGuest from "./components/HomeGuest";
import Home from "./components/Home";
import CreatePost from "./components/CreatePost";
import ViewSinglePost from "./components/ViewSinglePost";
import Axios from "axios";
import FlashMessages from "./components/FlashMessages";
import Profile from "./components/Profile";

import ExampleContext from "./ExampleContext";
import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";

import { useImmerReducer } from "use-immer";

Axios.defaults.baseURL = "http://localhost:8090";

function App() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("cpToken")),
    flashMessages: "",
    user: {
      token: localStorage.getItem("cpToken"),
      username: localStorage.getItem("cpUserName"),
      avatar: localStorage.getItem("cpAvatar"),
    },
  };

  function ourRducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.user = action.data;
        draft.loggedIn = true;
        break;
      case "logout":
        draft.loggedIn = false;
        break;
      default:
        return { ...state };
    }
  }

  const [state, dispatch] = useImmerReducer(ourRducer, initialState);

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("cpToken", state.user.token);
      localStorage.setItem("cpUserName", state.user.username);
      localStorage.setItem("cpAvatar", state.user.avatar);
    } else {
      localStorage.removeItem("cpToken");
      localStorage.removeItem("cpUserName");
      localStorage.removeItem("cpAvatar");
    }
  }, [state.loggedIn]);

  // dispatch({ type: "login" });
  // dispatch({ type: "flashmessage", value: "ddd" });
  // const [loggedIn, setLoggedIn] = useState(
  //   Boolean(localStorage.getItem("cpToken"))
  // );

  const demo = (meesage) => {
    console.log(meesage);
  };

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          {/* <FlashMessages /> */}
          <Header />

          <Switch>
            <Route path="/profile/:username">
              <Profile />
            </Route>
            <Route path="/" exact>
              {state.loggedIn ? <Home /> : <HomeGuest />}
            </Route>
            <Route path="/post/:id">
              <ViewSinglePost />
            </Route>

            <Route path="/create-post">
              <CreatePost />
            </Route>

            <Route path="/about">
              <About />
            </Route>
            <Route path="/terms">
              <Terms />
            </Route>
          </Switch>
          <Footer />
          {/* Container ends here */}
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export default App;
