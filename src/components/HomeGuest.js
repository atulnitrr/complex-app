import React, { useEffect, useState, useContext } from "react";
import Axios from "axios";
import Page from "./Page";
import { useImmer, useImmerReducer } from "use-immer";
import { CSSTransition } from "react-transition-group";

import DispatchContext from "../DispatchContext";

export default function HomeGuest() {
  const appDispatch = useContext(DispatchContext);
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
        if (draft.username.value.length < 3) {
          draft.username.hasErrors = true;
          draft.username.message = "Must be 3 ";
        }

        if (!draft.username.hasErrors && !action.noRequest) {
          draft.username.checkCount++;
        }
        break;
      case "emailImmedialtely":
        draft.email.hasErrors = false;
        draft.email.value = action.value;
        break;
      case "emailAfterDealy":
        if (!/^\S+@\S+$/.test(draft.email.value)) {
          draft.email.hasErrors = true;
          draft.email.message = "Not valid";
        }

        if (!draft.email.hasErrors && !action.noRequest) {
          draft.email.checkCount++;
        }
        break;
      case "passwordImmedialtely":
        draft.password.hasErrors = false;
        draft.password.value = action.value;
        if (draft.password.value.length > 50) {
          draft.password.hasErrors = true;
          draft.password.message = "Not valid";
        }
        break;
      case "passwordAfterDealy":
        if (draft.password.value.length < 12) {
          draft.password.hasErrors = true;
          draft.password.message = "Must be 12 char";
        }
        break;
      case "userNameUniqueResult":
        if (action.value) {
          draft.username.hasErrors = true;
          draft.username.isUnique = false;
          draft.username.message = "Must be unique ";
        } else {
          draft.username.isUnique = true;
        }
        break;
      case "emailUniqueResult":
        if (action.value) {
          draft.email.hasErrors = true;
          draft.email.isUnique = false;
          draft.email.message = "Must be unique ";
        } else {
          draft.email.isUnique = true;
        }
        break;
      case "submitForm":
        // put all
        if (
          !draft.username.hasErrors &&
          !draft.email.hasErrors &&
          !draft.password.hasErrors
        ) {
          draft.submitCount++;
        }
        break;
    }
  };

  const [state, dispatch] = useImmerReducer(ourReducer, initialStae);
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: "usernameImmedialtely", value: state.username.value });
    dispatch({
      type: "usernameAfrerDelay",
      value: state.username.value,
      noRequest: true,
    });

    dispatch({ type: "emailImmedialtely", value: state.email.value });
    dispatch({
      type: "emailAfrerDelay",
      value: state.email.value,
      noRequest: true,
    });

    dispatch({ type: "passwordImmedialtely", value: state.password.value });
    dispatch({ type: "passwordAfrerDelay", value: state.password.value });

    dispatch({ type: "submitForm" });
  };

  useEffect(() => {
    if (state.username.checkCount) {
      const ourRequest = Axios.CancelToken.source();

      async function fetchName() {
        try {
          const respnse = await Axios.post(
            "/doesUserNameExist",
            {
              username: state.username.value,
            },
            {
              cancelToken: ourRequest.token,
            }
          );
          console.log(respnse);
          dispatch({ type: "userNameUniqueResult", value: respnse.data });
        } catch (error) {
          console.log("Some error happend");
        }
      }
      fetchName();
      return () => {
        ourRequest.cancel();
      };
    }
  }, [state.username.checkCount]);

  useEffect(() => {
    if (state.email.checkCount) {
      const ourRequest = Axios.CancelToken.source();
      async function fetchName() {
        try {
          const respnse = await Axios.post(
            "/doesEmailExist",
            {
              username: state.email.value,
            },
            {
              cancelToken: ourRequest.token,
            }
          );
          console.log(respnse);
          dispatch({ type: "emailUniqueResult", value: respnse.data });
        } catch (error) {
          console.log("Some error happend");
        }
      }
      fetchName();
      return () => {
        ourRequest.cancel();
      };
    }
  }, [state.email.checkCount]);

  useEffect(() => {
    if (state.username.value) {
      const delay = setTimeout(() => {
        dispatch({ type: "userNameAfterDealy" });
      }, 700);

      return () => {
        clearTimeout(delay);
      };
    }
  }, [state.username.value]);

  useEffect(() => {
    if (state.email.value) {
      const delay = setTimeout(() => {
        dispatch({ type: "emailAfterDealy" });
      }, 700);

      return () => {
        clearTimeout(delay);
      };
    }
  }, [state.email.value]);

  useEffect(() => {
    if (state.password.value) {
      const delay = setTimeout(() => {
        dispatch({ type: "passwordAfterDealy" });
      }, 700);

      return () => {
        clearTimeout(delay);
      };
    }
  }, [state.password.value]);

  useEffect(() => {
    if (state.submitCount) {
      const ourRequest = Axios.CancelToken.source();

      async function submitForm() {
        try {
          const respone = await Axios.post(
            "/register",
            {
              username: state.username.value,
              email: state.email.value,
              password: state.password.value,
            },
            {
              CancelToken: ourRequest.cancel,
            }
          );

          appDispatch({ type: "login", data: respone.data });

          console.log(respone.data);
        } catch (error) {}
      }

      submitForm();

      return () => {};
    }
  }, [state.submitCount]);

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
              <CSSTransition
                in={state.email.hasErrors}
                timeout={330}
                classNames="liveValidateMessage"
                unmountOnExit
              >
                <div className="alert alert-danger liveValidateMessage small">
                  {state.email.message}
                </div>
              </CSSTransition>
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
              <CSSTransition
                in={state.password.hasErrors}
                timeout={330}
                classNames="liveValidateMessage"
                unmountOnExit
              >
                <div className="alert alert-danger liveValidateMessage small">
                  {state.password.message}
                </div>
              </CSSTransition>
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
