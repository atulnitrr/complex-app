import React from "react";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeGuest from "./components/HomeGuest";

function App() {
  return (
    <>
      <Header />
      <HomeGuest />
      <Footer />
      {/* Container ends here */}
    </>
  );
}

export default App;
