import React, { useContext, useEffect, useRef } from "react";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import { useImmer } from "use-immer";
import { Link } from "react-router-dom";
// import io from "socket.io-client";
// const socket = io("http://localhost:8080");

const Chat = () => {
  const appState = useContext(StateContext);
  const appDispacth = useContext(DispatchContext);
  const chatField = useRef(null);
  const chatLog = useRef(null);
  const [state, setState] = useImmer({
    fieldValue: "",
    chatMessages: [],
  });

  useEffect(() => {
    if (appState.isChatOpen) {
      chatField.current.focus();
      appDispacth({ type: "clearUnredcount" });
    }
  }, [appState.isChatOpen]);

  useEffect(() => {
    // socket.on("chatFromServer", (message) => {
    //   setState((draft) => {
    //     draft.chatMessages.push(message);
    //   });
    // });
    // return () => {
    //   socket.disconnect();
    // }
  }, []);

  useEffect(() => {
    chatLog.current.scrollTop = chatLog.current.scrollHeight;
    // if (state.chatMessages.length > 0 && !appState.isChatOpen) {
    //   appDispacth({ type: "incrementUnredChat" });
    // }
  }, [state.chatMessages]);

  const handleFieldChnage = (e) => {
    const value = e.target.value;
    setState((draft) => {
      draft.fieldValue = value;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // send message to chat server

    // socket.emit("chatFromBrowser", {
    //   message: state.fieldValue,
    //   token: appState.user.token,
    // });

    setState((draft) => {
      // add message to state collection
      draft.chatMessages.push({
        message: draft.fieldValue,
        username: appState.user.username,
        avatar: appState.user.avatar,
      });
      draft.fieldValue = "";
    });
  };
  return (
    <div
      id="chat-wrapper"
      className={
        "chat-wrapper shadow border-top border-left border-right " +
        (appState.isChatOpen ? " chat-wrapper--is-visible" : "")
      }
    >
      <div className="chat-title-bar bg-primary">
        Chat
        <span
          onClick={(e) => appDispacth({ type: "closeChat" })}
          className="chat-title-bar-close"
        >
          <i className="fas fa-times-circle"></i>
        </span>
      </div>
      <div id="chat" className="chat-log" ref={chatLog}>
        {state.chatMessages.map((message, index) => {
          if (message.username === appState.user.username) {
            return (
              <div className="chat-self" key={index}>
                <div className="chat-message">
                  <div className="chat-message-inner"> {message.message} </div>
                </div>
                <img className="chat-avatar avatar-tiny" src={message.avatar} />
              </div>
            );
          } else {
            return (
              <div className="chat-other" key={index}>
                <Link to={`/profile/${message.username}`}>
                  <img className="avatar-tiny" src={message.avatar} />
                </Link>
                <div className="chat-message">
                  <div className="chat-message-inner">
                    <Link to={`/profil/${message.username}`}>
                      <strong>{message.username}: </strong>
                    </Link>
                    {message.message}
                  </div>
                </div>
              </div>
            );
          }
        })}
      </div>

      <form
        onSubmit={handleSubmit}
        id="chatForm"
        className="chat-form border-top"
      >
        <input
          ref={chatField}
          onChange={handleFieldChnage}
          value={state.fieldValue}
          type="text"
          className="chat-field"
          id="chatField"
          placeholder="Type a message…"
          autoComplete="off"
        />
      </form>
    </div>
  );
};

export default Chat;
