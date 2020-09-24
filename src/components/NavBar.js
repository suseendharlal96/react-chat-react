import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Link } from "react-router-dom";

import { Button, Navbar, Image } from "react-bootstrap";

import { useAuthDispatch, useAuthState } from "../context/authcontext";
import Profile from "../assets/blank-profile.png";

const NavBar = (props) => {
  const [image, setImage] = useState(null);
  const dispatch = useAuthDispatch();
  const { user } = useAuthState();

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    window.location.href = "/";
  };

  const [uploadFile] = useMutation(UPLOAD_FILE, {
    onCompleted: (data) => {
      console.log(data.fileUpload);
      setImage(data.fileUpload);
    },
  });

  const fileChangeHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    uploadFile({ variables: { file, username: user.username } });
  };

  return (
    <Navbar fixed="top" bg="primary" variant="dark">
      <Navbar.Brand>
        <Link to={user && user.username ? "/" : "/auth"}>
          <Button>Home</Button>
        </Link>
        {/* <Link to="/songs">
          <Button>Songs</Button>
        </Link> */}
        {/* <Link to="/upload">
          <Button>upload</Button>
        </Link> */}
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse className="justify-content-end">
        {user && user.username ? (
          <>
            <input type="file" onChange={fileChangeHandler} />
            <Button onClick={logout}>Logout</Button>
            <Image
              src={image ? image : user.imageUrl ? user.imageUrl : Profile}
              roundedCircle
              className="mr-2 "
              style={{ width: 50, height: 50, objectFit: "cover" }}
            />
            <Navbar.Text style={{ color: "yellow" }}>
              {user.username}
            </Navbar.Text>
          </>
        ) : (
          <Navbar.Brand>
            <Link to="/auth">
              <Button>Register/Signin</Button>
            </Link>
          </Navbar.Brand>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

const UPLOAD_FILE = gql`
  mutation uploadFile($file: Upload!, $username: String!) {
    fileUpload(file: $file, username: $username)
  }
`;

export default NavBar;
