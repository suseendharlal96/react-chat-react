import React, { useState } from "react";

import { gql, useMutation, useLazyQuery } from "@apollo/client";
import { Row, Col, Form, Button, Spinner } from "react-bootstrap";

import { userFragment } from "../util/userFragment";
import { useAuthDispatch } from "../context/authcontext";

const RegisterForm = (props) => {
  const [form, setformData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    imageUrl: "",
  });

  const [isSignup, setMode] = useState(false);

  const [errors, setErrors] = useState({});

  const dispatch = useAuthDispatch();

  const [suseeRegister, { loading }] = useMutation(REGISTER_USER, {
    update(_, result) {
      console.log(result);
      dispatch({ type: "SIGNUP", userData: result.data.signup });
      props.history.push("/");
    },
    onError(err) {
      console.log(err);
      // console.log(err.graphQLErrors[0].extensions.errors);
      // setErrors(err.graphQLErrors[0].extensions.errors);
    },
  });

  const [suseeLogin, { loading: loginLoading }] = useLazyQuery(LOGIN_USER, {
    onCompleted(data) {
      dispatch({ type: "LOGIN", userData: data.signin });
      props.history.push("/");
    },
    onError(err) {
      console.log(err.graphQLErrors[0].extensions.errors);
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
  });

  const handleChange = (e) => {
    setformData({ ...form, [e.target.name]: e.target.value });
  };

  const switchMode = () => {
    setMode(!isSignup);
    setErrors({
      ...errors,
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    });
  };

  const register = (e) => {
    e.preventDefault();
    console.log(form);
    isSignup
      ? suseeRegister({ variables: form })
      : suseeLogin({ variables: form });
  };

  return (
    <Row className="py-5 justify-content-center">
      <Col sm={8} md={6} lg={4}>
        <h2 className="text-center text-white">
          {isSignup ? "Register" : "Login"}
        </h2>
        <Form onSubmit={register} noValidate>
          <Form.Group controlId="formBasicEmail">
            <Form.Label className={errors.email ? "text-danger" : "text-white"}>
              Email address
            </Form.Label>
            <Form.Control
              type="email"
              value={form.email}
              autoFocus
              name="email"
              onChange={handleChange}
              placeholder="Enter email"
              className={errors.email && "is-invalid"}
              disabled={loading || loginLoading}
            />
            {errors.email && (
              <Form.Text className="text-danger">{errors.email}</Form.Text>
            )}
          </Form.Group>
          {isSignup && (
            <Form.Group controlId="formBasicUsername">
              <Form.Label
                className={errors.username ? "text-danger" : "text-white"}
              >
                Username
              </Form.Label>
              <Form.Control
                type="text"
                value={form.username}
                name="username"
                onChange={handleChange}
                placeholder="Username"
                className={errors.username && "is-invalid"}
                disabled={loading}
              />
              {errors.username && (
                <Form.Text className="text-danger">{errors.username}</Form.Text>
              )}
            </Form.Group>
          )}
          <Form.Group controlId="formBasicPassword">
            <Form.Label
              className={errors.password ? "text-danger" : "text-white"}
            >
              Password
            </Form.Label>
            <Form.Control
              type="password"
              value={form.password}
              name="password"
              onChange={handleChange}
              placeholder="Password"
              className={errors.password && "is-invalid"}
              disabled={loading || loginLoading}
            />
            {errors.password && (
              <Form.Text className="text-danger">{errors.password}</Form.Text>
            )}
          </Form.Group>
          {isSignup && (
            <>
              <Form.Group controlId="formBasicConfirmPassword">
                <Form.Label
                  className={
                    errors.confirmPassword ? "text-danger" : "text-white"
                  }
                >
                  ConfirmPassword
                </Form.Label>
                <Form.Control
                  type="password"
                  value={form.confirmPassword}
                  name="confirmPassword"
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className={errors.confirmPassword && "is-invalid"}
                  disabled={loading}
                />
                {errors.confirmPassword && (
                  <Form.Text className="text-danger">
                    {errors.confirmPassword}
                  </Form.Text>
                )}
              </Form.Group>
              <Form.Group controlId="formBasicConfirmPassword">
                <Form.Label className="text-white">Image Url</Form.Label>
                <Form.Control
                  type="text"
                  value={form.imageUrl}
                  name="imageUrl"
                  onChange={handleChange}
                  placeholder="Profile imageurl"
                  disabled={loading}
                />
              </Form.Group>
            </>
          )}
          <Row>
            <Col>
              <div>
                <Button
                  variant="primary"
                  onClick={switchMode}
                  style={{ whiteSpace: "nowrap" }}
                  disabled={loading || loginLoading}
                >
                  {isSignup ? "Switch to Login" : "Switch to Register"}
                </Button>
              </div>
            </Col>
            <Col>
              <div className="text-right">
                <Button
                  variant="success"
                  type="submit"
                  disabled={loading || loginLoading}
                >
                  {(loading || loginLoading) && (
                    <Spinner
                      as="span"
                      animation="grow"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                  )}
                  {isSignup
                    ? loading
                      ? "Registering.."
                      : "Register"
                    : loginLoading
                    ? "Logging in.."
                    : "Login"}
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
};

// const userFragment = gql`
//   # this type 'User' comes from graphql typeDef
//   fragment userData on User {
//     username
//     token
//     email
//   }
// `;

const REGISTER_USER = gql`
  mutation suseesignup(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
    $imageUrl: String!
  ) {
    signup(
      signupInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
        imageUrl: $imageUrl
      }
    ) {
      ...userData
    }
  }
  ${userFragment}
`;

const LOGIN_USER = gql`
  query suseelogin($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      ...userData
    }
  }
  ${userFragment}
`;

export default RegisterForm;
