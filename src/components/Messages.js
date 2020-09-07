import React, { useState, useEffect } from "react";

import { useLazyQuery, gql, useMutation } from "@apollo/client";

import { Form } from "react-bootstrap";

import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

import Message from "./Message";

const Messages = ({ user }) => {
  const [myMessage, setMyMessage] = useState("");
  const [messageData, setMessageData] = useState("");

  useEffect(() => {
    console.log(user);
    if (user) {
      getMessages({ variables: { from: user.username } });
    }
  }, [user]);

  const [getMessages, { loading: messageLoading, data }] = useLazyQuery(
    GET_MESSAGES,
    {
      onCompleted(data) {
        setMessageData(data.getMessages);
      },
    }
  );

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    update(_, res) {
      const a = [...messageData];
      a.unshift(res.data.sendMessage);
      setMessageData(a);
      setMyMessage("");
    },
    onError(err) {
      console.log(err);
    },
  });

  const sendText = (e) => {
    e.preventDefault();
    if (user && user.email) {
      sendMessage({
        variables: { content: myMessage, to: user.email },
      });
    }
  };

  const form = (
    <Form onSubmit={sendText}>
      <Form.Group className="d-flex align-items-center">
        <Form.Control
          type="text"
          className="rounded-pill bg-light"
          placeholder="Type your message.."
          value={myMessage}
          onChange={(e) => setMyMessage(e.target.value)}
        />
        <i
          onClick={sendText}
          style={{ cursor: "pointer" }}
          className="fa fa-paper-plane text-primary ml-2 fa-2x"
          aria-hidden="true"
        ></i>
      </Form.Group>
    </Form>
  );

  return (
    <div>
      {!messageLoading ? (
        messageData ? (
          messageData.length > 0 ? (
            <>
              <div
                style={{ height: "400px", overflow: "auto" }}
                className="d-flex  flex-column-reverse"
              >
                {messageData.map((message, index) => (
                  <React.Fragment key={message.uuid}>
                    <Message message={message} />
                    {index === messageData.length - 1 && (
                      <div className="invisibe">
                        <hr className="m-0" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
              <div>{form}</div>
            </>
          ) : (
            <>
              <div style={{ height: "400px", overflow: "auto" }}>
                <p>Start a conversation.Say Hi!</p>
              </div>
              <div>{form}</div>
            </>
          )
        ) : (
          <p>Click an user to see the conversations</p>
        )
      ) : (
        Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            style={
              index % 2 === 0
                ? { height: "150px", overflow: "auto", float: "right" }
                : { float: "left", height: "150px", overflow: "auto" }
            }
            className={`d-flex my-2 ${
              (index + 1) % 2 === 0 ? "mr-auto" : "ml-auto"
            }`}
          >
            <SkeletonTheme
              key={index}
              color={(index + 1) % 2 === 0 ? "grey" : "blue"}
            >
              <Skeleton width={250} className="rounded-pill" height={50} />
            </SkeletonTheme>
          </div>
        ))
      )}
    </div>
  );
};

const GET_MESSAGES = gql`
  query getMessages($from: String!) {
    getMessages(from: $from) {
      content
      to
      from
      uuid
      createdAt
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation sendMessage($content: String!, $to: String!) {
    sendMessage(content: $content, to: $to) {
      createdAt
      from
      to
      uuid
      content
    }
  }
`;

export default Messages;
