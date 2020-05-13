import React, { useEffect, useState } from "react";
import Axios from "axios";
import Page from "./Page";
import { useImmer, useImmerReducer } from "use-immer";
import { CSSTransition } from "react-transition-group";

export default function HomeGuest() {
  const initialStae = {
    username: {
      value: "",
      hasErrors: false,
      message: "",
      isUnique: false,
      checkCount: 0,
    },
    email: {
      value: "",
      hasErrors: false,
      message: "",
      isUnique: false,
      checkCount: 0,
    },

    password: {
      value: "",
      hasErrors: false,
      message: "",
    },
    submitCount: 0,
  };

  const ourReducer = (draft, action) => {
    switch (action.type) {
      case "usernameImmedialtely":
        draft.username.hasErrors = false;
        draft.username.value = action.value;
        if (draft.username.value.length > 30) {
          draft.username.hasErrors = true;
          draft.username.message = "SHold be less tahn 30";
        }
        if (
          draft.username.value &&
          !/^([a-zA-Z0-9]+)$/.test(draft.username.value)
        ) {
          draft.username.hasErrors = true;
          draft.username.message = " Shold  be  number ";
        }
        break;
      case "userNameAfterDealy":
        break;
      case "emailImmedialtely":
        draft.email.hasErrors = false;
        draft.email.value = action.value;
        break;
      case "emailAfterDealy":
        break;
      case "passwordImmedialtely":
        draft.password.hasErrors = false;
        draft.password.value = action.value;
        break;
      case "passwordAfterDealy":
        break;
      case "userNameUniqueResult":
        break;
      case "emailUniqueResult":
        break;
      case "submitForm":
        break;
    }
  };

  const [state, dispatch] = useImmerReducer(ourReducer, initialStae);
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <Page title="ComplexApp " wide={true}>
      <div className="row align-items-center">
        <div className="col-lg-7 py-3 py-md-5">
          <h1 className="display-3">Remember Writing?????</h1>
          <p className="lead text-muted">
            Are you sick of short tweets and impersonal &ldquo;shared&rdquo;
            posts that are reminiscent of the late 90&rsquo;s email forwards? We
            believe getting back to actually writing is the key to enjoying the
            internet again.
          </p>
        </div>
        <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username-register" className="text-muted mb-1">
                <small>Username</small>
              </label>
              <input
                id="username-register"
                name="username"
                className="form-control"
                type="text"
                placeholder="Pick a username"
                autoComplete="off"
                value={state.username.value}
                onChange={(event) =>
                  dispatch({
                    type: "usernameImmedialtely",
                    value: event.target.value,
                  })
                }
              />
              <CSSTransition
                in={state.username.hasErrors}
                timeout={330}
                classNames="liveValidateMessage"
                unmountOnExit
              >
                <div className="alert alert-danger liveValidateMessage small">
                  {state.username.message}
                </div>
              </CSSTransition>
            </div>
            <div className="form-group">
              <label htmlFor="email-register" className="text-muted mb-1">
                <small>Email</small>
              </label>
              <input
                id="email-register"
                name="email"
                className="form-control"
                type="text"
                placeholder="you@example.com"
                autoComplete="off"
                onChange={(event) =>
                  dispatch({
                    type: "emailImmedialtely",
                    value: event.target.value,
                  })
                }
                value={state.email.value}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password-register" className="text-muted mb-1">
                <small>Password</small>
              </label>
              <input
                id="password-register"
                name="password"
                className="form-control"
                type="password"
                placeholder="Create a password"
                onChange={(event) =>
                  dispatch({
                    type: "passwordImmedialtely",
                    value: event.target.value,
                  })
                }
                value={state.password.value}
              />
            </div>
            <button
              type="submit"
              className="py-3 mt-4 btn btn-lg btn-success btn-block"
            >
              Sign up for ComplexApp
            </button>
          </form>
        </div>
      </div>
    </Page>
  );
}
