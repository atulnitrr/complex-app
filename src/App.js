import React, { useState } from "react";
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
import ExampleContext from "./ExampleContext";

Axios.defaults.baseURL = "http://localhost:8090";

function App() {
  const [loggedIn, setLoggedIn] = useState(
    Boolean(localStorage.getItem("cpToken"))
  );

  const demo = (meesage) => {
    console.log(meesage);
  };
  return (
    <ExampleContext.Provider value={{ demo, setLoggedIn }}>
      <BrowserRouter>
        <FlashMessages />
        <Header loggedIn={loggedIn} />

        <Switch>
          <Route path="/" exact>
            {loggedIn ? <Home /> : <HomeGuest />}
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
    </ExampleContext.Provider>
  );
}

export default App;
