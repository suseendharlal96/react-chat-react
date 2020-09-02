import { gql } from "@apollo/client";

export const userFragment = gql`
  # this type 'User' comes from graphql typeDef
  fragment userData on User {
    username
    token
    email
    id
    imageUrl
  }
`;
