import React, { useState } from "react";

import { gql, useMutation } from "@apollo/client";

import dayjs from "dayjs";
import { Button, OverlayTrigger, Popover } from "react-bootstrap";

import { useAuthState } from "../context/authcontext";

const Message = ({ message }) => {
  const { user } = useAuthState();
  const sentByLoggedUser = message.from === user.email;
  const [showReactions, setShowReactions] = useState(false);
  const reactions = ["❤️", "😆", "😯", "😢", "😡", "👍", "👎"];
  const uniqueReactions = [...new Set(message.reactions.map((r) => r.content))];

  const react = (r) => {
    reactToMsg({ variables: { content: r, uuid: message.uuid } });
  };

  const [reactToMsg] = useMutation(REACT_TO_MSG, {
    onCompleted(data) {
      console.log(data);
      setShowReactions(false);
    },
    onError(err) {
      console.log(err);
    },
  });

  const reactButton = (
    <OverlayTrigger
      trigger="click"
      placement="top"
      show={showReactions}
      onToggle={setShowReactions}
      transition={false}
      rootClose
      overlay={
        <Popover>
          <Popover.Content className="d-flex align-items-center react-popover">
            {reactions.map((r) => (
              <Button
                className="react-btn"
                variant="link"
                key={r}
                onClick={() => react(r)}
              >
                {r}
              </Button>
            ))}
          </Popover.Content>
        </Popover>
      }
    >
      <Button variant="link" className="px-2">
        <i className="far fa-smile"></i>
      </Button>
    </OverlayTrigger>
  );
  return (
    <div className={`d-flex my-3 ${sentByLoggedUser ? "ml-auto" : "mr-auto"}`}>
      {sentByLoggedUser && reactButton}
      <div
        className={`py-2 px-3 rounded-pill ${
          sentByLoggedUser ? "bg-primary" : "bg-light"
        }`}
      >
        {message.reactions.length > 0 && (
          <div className="bg-light p1 rounded-pill">
            {uniqueReactions}
            {message.reactions.length}
          </div>
        )}
        <p className={sentByLoggedUser ? "text-white" : ""} key={message.uuid}>
          {message.content}
        </p>
        <p
          className={` ${sentByLoggedUser ? "text-white" : ""}`}
          style={{ float: "right" }}
        >
          {dayjs(message.createdAt).format("DD/MM/YY h:mm A")}
        </p>
      </div>
      {!sentByLoggedUser && reactButton}
    </div>
  );
};

const REACT_TO_MSG = gql`
  mutation reaction($content: String!, $uuid: String!) {
    reactToMessage(content: $content, uuid: $uuid) {
      content
      uuid
    }
  }
`;

export default Message;
