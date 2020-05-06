import React from "react";

const dd = "container container--narrow py-md-5";
export default function Container(props) {
  return (
    <div
      className={`container py-md-5 ${props.wide ? "" : "container--narrow"}`}
    >
      {props.children}
    </div>
  );
}
