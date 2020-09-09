import React from "react";

import dayjs from "dayjs";

import { useAuthState } from "../context/authcontext";

const Message = ({ message }) => {
  const { user } = useAuthState();
  const sentByLoggedUser = message.from === user.email;
  const received = !sentByLoggedUser;

  return (
    <div className={`d-flex my-3 ${sentByLoggedUser ? "ml-auto" : "mr-auto"}`}>
      <div
        className={`py-2 px-3 rounded-pill ${
          sentByLoggedUser ? "bg-primary" : "bg-light"
        }`}
      >
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
    </div>
  );
};

export default Message;
