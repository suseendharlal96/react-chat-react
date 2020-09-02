import { gql } from "@apollo/client";

export const GET_SONG_LIST = gql`
  query getSongs {
    songs {
      id
      title
      user {
        username
      }
    }
  }
`;
