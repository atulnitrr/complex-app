import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// browser need not reload when we save th file , just makning the change will automaticlly reload
if (module.hot) {
  module.hot.accept();
}
