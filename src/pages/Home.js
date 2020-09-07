import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

import { gql, useQuery } from "@apollo/client";

import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { Row, Col, Image, Gri } from "react-bootstrap";

import Profile from "../assets/blank-profile.png";
import Messages from "../components/Messages";
import { useAuthState, useAuthDispatch } from "../context/authcontext";

const Home = () => {
  const { user } = useAuthState();

  const [selectedUser, setUser] = useState(null);

  const { loading, data, error } = useQuery(GET_USERS);

  if (error) {
    console.log(error);
  }

  let userContent;
  if (!data || loading) {
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
  } else if (data.getUsers.length === 0) {
    userContent = <p>No users have joined yet..</p>;
  } else {
    userContent = data.getUsers.map((user, index) => (
      <div
        role="button"
        onClick={() => setUser(user)}
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
          <p className="font-weight-light">
            {user.latestMessage
              ? user.latestMessage.content
              : "You are now connected"}
          </p>
        </div>
      </div>
    ));
  }

  return (
    <div>
      {user && user.username ? (
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
              <Messages user={selectedUser} />
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
      }
    }
  }
`;

export default Home;
