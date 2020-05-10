import React from "react";
import Page from "./Page";
import { useParams, Link } from "react-router-dom";

export default function NotFound() {
  return (
    <Page title="not found">
      <div className="text-center">
        <h2>Oops we can not find that page</h2>
        <p className="lead text-muted">
          please visit <Link to="/">Home page</Link>
        </p>
      </div>
    </Page>
  );
}
