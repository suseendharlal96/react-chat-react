import React, { useEffect } from "react";

import { useLazyQuery, gql } from "@apollo/client";

const Message = ({ username }) => {
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
    <div>
      {!messageLoading ? (
        messageData ? (
          messageData.getMessages && messageData.getMessages.length > 0 ? (
            messageData.getMessages.map((message) => (
              <p key={message.uuid}>{message.content}</p>
            ))
          ) : (
            <p>Start a conversation.Say Hi!</p>
          )
        ) : (
          <p>Click an user to see the conversations</p>
        )
      ) : (
        <p>Getting Messages..</p>
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

export default Message;
