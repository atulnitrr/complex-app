import React, { useEffect } from "react";
import Container from "./Container";

export default function Page(props) {
  useEffect(() => {
    document.title = `${props.title} | CompexApp`;
    window.scrollTo(0, 0);
  }, []);

  return <Container wide={props.wide}>{props.children}</Container>;
}
