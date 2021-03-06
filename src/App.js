import React, { useState, useReducer, useEffect, Suspense } from "react";
import "./App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import About from "./components/About";
import Terms from "./components/Terms";
import HomeGuest from "./components/HomeGuest";
import Home from "./components/Home";

import ViewSinglePost from "./components/ViewSinglePost";
import { CSSTransition } from "react-transition-group";
import Axios from "axios";
import FlashMessages from "./components/FlashMessages";
import Profile from "./components/Profile";
import EditPost from "./components/EditPost";
import NotFound from "./components/NotFound";

import ExampleContext from "./ExampleContext";
import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";

import { useImmerReducer } from "use-immer";
import LoadingIcon from "./components/LoadingIcon";
const CreatePost = React.lazy(() => import("./components/CreatePost"));
const Search = React.lazy(() => import("./components/Search"));
const Chat = React.lazy(() => import("./components//Chat"));

// Axios.defaults.baseURL = "http://localhost:8090";
Axios.defaults.baseURL = process.env.BACKENDURL || "";

function App() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("cpToken")),
    flashMessages: "",
    user: {
      token: localStorage.getItem("cpToken"),
      username: localStorage.getItem("cpUserName"),
      avatar: localStorage.getItem("cpAvatar"),
    },
    isSeachOpen: false,
    isChatOpen: false,
    unredChatCount: 0,
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
      case "openSearch":
        draft.isSeachOpen = true;
        break;
      case "closeSearch":
        draft.isSeachOpen = false;
        break;
      case "toggleChat":
        draft.isChatOpen = !draft.isChatOpen;
        break;
      case "closeChat":
        draft.isChatOpen = false;
        break;
      case "incrementUnredChat":
        draft.unredChatCount++;
        break;
      case "clearUnredcount":
        draft.unredChatCount = 0;
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

  useEffect(() => {
    if (state.loggedIn) {
      const ourRequest = Axios.CancelToken.source();
      async function getData() {
        try {
          const response = await Axios.post(
            "/checkToken",
            { token: state.user.token },
            {
              CancelToken: ourRequest.token,
            }
          );

          if (!response.data) {
            dispatch({ type: "logout" });
          }
        } catch (error) {}
      }
      getData();

      return () => {
        ourRequest.cancel();
      };
    }
  }, []);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          {/* <FlashMessages /> */}
          <Header />
          <Suspense fallback={<LoadingIcon />}>
            <Switch>
              <Route path="/profile/:username">
                <Profile />
              </Route>
              <Route path="/" exact>
                {state.loggedIn ? <Home /> : <HomeGuest />}
              </Route>
              <Route path="/post/:id" exact>
                <ViewSinglePost />
              </Route>
              <Route path="/post/:id/edit" exact>
                <EditPost />
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
              <Route>
                <NotFound />
              </Route>
            </Switch>
          </Suspense>
          <CSSTransition
            timeout={730}
            in={state.isSeachOpen}
            classNames="search-overlay"
            unmountOnExit
          >
            <div className="search-overlay">
              <Suspense fallback="">
                <Search />
              </Suspense>
            </div>
          </CSSTransition>
          <Suspense fallback="">{state.isChatOpen && <Chat />}</Suspense>
          <Footer />
          {/* Container ends here */}
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export default App;
