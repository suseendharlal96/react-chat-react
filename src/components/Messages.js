import React, { useEffect } from "react";

import { useLazyQuery, gql } from "@apollo/client";

import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

import Message from "./Message";

const Messages = ({ username }) => {
  useEffect(() => {
    if (username) {
      getMessages({ variables: { from: username } });
    }
  }, [username]);

  const [
    getMessages,
    { loading: messageLoading, data: messageData },
  ] = useLazyQuery(GET_MESSAGES);

  return (
    <div className="d-flex  flex-column-reverse">
      {!messageLoading ? (
        messageData ? (
          messageData.getMessages && messageData.getMessages.length > 0 ? (
            messageData.getMessages.map((message, index) => (
              <React.Fragment key={message.uuid}>
                <Message message={message} />
                {index === messageData.getMessages.length - 1 && (
                  <div className="invisibe">
                    <hr className="m-0" />
                  </div>
                )}
              </React.Fragment>
            ))
          ) : (
            <p>Start a conversation.Say Hi!</p>
          )
        ) : (
          <p>Click an user to see the conversations</p>
        )
      ) : (
        Array.from({ length: 5 }).map((_, index) => (
          <div
            style={index % 2 === 0 ? { float: "right" } : { float: "left" }}
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

export default Messages;
