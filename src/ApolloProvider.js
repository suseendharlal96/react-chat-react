import React from "react";

import {
  ApolloClient,
  split,
  InMemoryCache,
  HttpLink,
  ApolloProvider as Provider,
} from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";
import { setContext } from "@apollo/client/link/context";

const httpLink = new HttpLink({
  uri: "http://localhost:5000/graphql",
});

const wsLink = new WebSocketLink({
  uri: "ws://localhost:5000/graphql",
  options: {
    reconnect: true,
    connectionParams: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  },
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from localstorage if it exists
  const token = localStorage.getItem("token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const uploadLink = createUploadLink({
  uri: "http://localhost:5000/graphql",
});

const client = new ApolloClient({
  link: authLink.concat(uploadLink).concat(splitLink),
  cache: new InMemoryCache(),
});

const ApolloProvider = (props) => <Provider client={client} {...props} />;

export default ApolloProvider;
