import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

import { gql, useQuery, useSubscription } from "@apollo/client";

import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { Row, Col, Image } from "react-bootstrap";

import Profile from "../assets/blank-profile.png";
import Messages from "../components/Messages";
import { useAuthState } from "../context/authcontext";

export const MESSAGE_SENT = gql`
  subscription messageSent {
    messageSent {
      uuid
      content
      to
      from
      createdAt
      reactions {
        uuid
        content
      }
    }
  }
`;
export const MESSAGE_REACTED = gql`
  subscription reacted {
    reacted {
      uuid
      content
      message {
        from
        uuid
        to
      }
      user {
        id
      }
    }
  }
`;

const Home = () => {
  const { user: loggedUser } = useAuthState();
  const [userData, setUserData] = useState(null);
  const [selectedUser, setUser] = useState(null);
  const [messageData, setMessageData] = useState("");

  const { data: subsData, error: subsErr } = useSubscription(MESSAGE_SENT);
  const { data: reactData, error: reactErr } = useSubscription(MESSAGE_REACTED);
  if (subsData) {
  }
  if (reactErr) {
  }
  useEffect(() => {
    if (subsData) {
      if (
        (subsData.messageSent.from === loggedUser.email &&
          subsData.messageSent.to === (selectedUser && selectedUser.email)) ||
        (subsData.messageSent.from === (selectedUser && selectedUser.email) &&
          subsData.messageSent.to === loggedUser.email)
      ) {
        const currentusermsgIndex = messageData.findIndex(
          (u) => u.to === selectedUser.email || u.from === selectedUser.email
        );
        const a = [...messageData];
        if (currentusermsgIndex !== -1) {
          a.unshift(subsData.messageSent);
          setMessageData(a);
        } else if (messageData.length === 0) {
          a.unshift(subsData.messageSent);
          setMessageData(a);
        }
      }

      const senderIndex = userData.findIndex(
        (u) => u.email === subsData.messageSent.to
      );
      const userSenderCopy = [...userData];
      if (senderIndex !== -1) {
        const currentSender = {
          ...userSenderCopy[senderIndex],
          latestMessage: subsData.messageSent,
        };
        userSenderCopy[senderIndex] = currentSender;
        setUserData(userSenderCopy);
      }
      const receiverIndex = userData.findIndex(
        (u) => u.email === subsData.messageSent.from
      );
      const userReceiverCopy = [...userData];
      if (receiverIndex !== -1) {
        const currentReceiver = {
          ...userReceiverCopy[receiverIndex],
          latestMessage: subsData.messageSent,
        };
        userReceiverCopy[receiverIndex] = currentReceiver;
        setUserData(userReceiverCopy);
      }
    }
  }, [subsData]);

  useEffect(() => {
    if (reactData) {
      if (
        (reactData.reacted.message.from === loggedUser.email &&
          reactData.reacted.message.to ===
            (selectedUser && selectedUser.email)) ||
        (reactData.reacted.message.from ===
          (selectedUser && selectedUser.email) &&
          reactData.reacted.message.to === loggedUser.email)
      ) {
        const a = [...messageData];
        const mIndex = a.findIndex(
          (m) => m.uuid === reactData.reacted.message.uuid
        );
        const rIndex = a[mIndex].reactions.findIndex(
          (r) => r.uuid === reactData.reacted.uuid
        );
        if (a[mIndex].reactions.length === 0) {
          a[mIndex] = {
            ...a[mIndex],
            reactions: [
              {
                content: reactData.reacted.content,
                uuid: reactData.reacted.uuid,
              },
            ],
          };
          // setMessageData(a);
        } else {
          let reactionsCopy = [...a[mIndex].reactions];
          if (rIndex >= 0) {
            reactionsCopy[rIndex] = reactData.reacted;
          } else {
            reactionsCopy = [...reactionsCopy, reactData.reacted];
          }
          a[mIndex] = {
            ...a[mIndex],
            reactions: reactionsCopy,
          };
        }
        setMessageData(a);
      }
    }
  }, [reactData]);

  const { loading, data, error } = useQuery(GET_USERS, {
    onCompleted(data) {
      setUserData(data && data.getUsers);
    },
  });

  const selectUser = (user) => {
    setUser(user);
  };

  const setSelectedMessage = (msg) => {
    // const a = [...messageData];
    // a.unshift(msg);
    setMessageData(msg);
  };

  let userContent;
  if (!userData || loading) {
    userContent = Array.from({ length: 5 }).map((item, index) => (
      <Row key={index} className="d-flex p-3">
        <Col sm={12} md="auto">
          <SkeletonTheme color="darkgray">
            <Skeleton width={50} height={50} circle={true} />
          </SkeletonTheme>
        </Col>
        <Col sm={12} md="auto">
          <SkeletonTheme color="#ffc107">
            <Skeleton width={65} height={10} />
          </SkeletonTheme>
          <SkeletonTheme color="#fff">
            <Skeleton width={265} height={10} />
          </SkeletonTheme>
        </Col>
      </Row>
    ));
  } else if (userData.length === 0) {
    userContent = <p>No users have joined yet..</p>;
  } else {
    userContent = userData.map((user, index) => (
      <div
        role="button"
        onClick={() => selectUser(user)}
        className={`user-content d-flex p-3 ${
          selectedUser && selectedUser.username === user.username
            ? "selected-user"
            : ""
        }`}
        style={{ borderBottom: "1px solid black" }}
        key={index}
      >
        <Image
          src={user.imageUrl ? user.imageUrl : Profile}
          roundedCircle
          className="mr-2"
          style={{ width: 50, height: 50, objectFit: "cover" }}
        />
        <div className="d-none d-md-block">
          <p className="text-warning">{user.username}</p>
          <p style={{ wordBreak: "break-all" }} className="font-weight-light">
            {user.latestMessage ? (
              user.latestMessage.content &&
              user.latestMessage.from === loggedUser.email ? (
                <>
                  {user.latestMessage.content}
                  <span style={{ marginLeft: "25px", color: "lawngreen" }}>
                    <i className="fa fa-check" aria-hidden="true"></i>
                  </span>
                </>
              ) : (
                user.latestMessage.content
              )
            ) : (
              "You are now connected"
            )}
          </p>
        </div>
      </div>
    ));
  }

  return (
    <div>
      {loggedUser && loggedUser.username ? (
        <Row className="bg-white">
          <Col xs={2} md={4} className="p-0 text-white users-section">
            {userContent}
          </Col>
          <Col
            style={{
              backgroundColor: "lightblue",
              minWidth: "400px",
            }}
            xs={10}
            md={8}
          >
            {data && data.getUsers.length > 0 && (
              <Messages
                user={selectedUser}
                messageData={messageData}
                setMessageData={(data) => setSelectedMessage(data)}
              />
            )}
          </Col>
        </Row>
      ) : (
        <Redirect to="/auth" />
      )}
    </div>
  );
};

const GET_USERS = gql`
  query getUsers {
    getUsers {
      username
      email
      imageUrl
      latestMessage {
        content
        from
      }
    }
  }
`;

export default Home;
