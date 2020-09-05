import React from "react";
import { Link } from "react-router-dom";

import { Button, Navbar, Image } from "react-bootstrap";

import { useAuthDispatch, useAuthState } from "../context/authcontext";
import Profile from "../assets/blank-profile.png";

const NavBar = (props) => {
  const dispatch = useAuthDispatch();
  const { user } = useAuthState();

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    window.location.href = "/";
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
            <Button onClick={logout}>Logout</Button>
            <Image
              src={user.imageUrl ? user.imageUrl : Profile}
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

export default NavBar;
