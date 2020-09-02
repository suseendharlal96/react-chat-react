import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { gql, useQuery, useMutation } from "@apollo/client";

import { Card, Button, Form } from "react-bootstrap";

import { useAuthState } from "../context/authcontext";
import Music from "../assets/music.jpg";

const SongDetail = (props) => {
  const [lyrics, setLyrics] = useState("");
  const [username, setUsername] = useState("");
  const { user, isLoaded } = useAuthState();

  useEffect(() => {
    console.log(props);
    console.log(user);
    if (!props.location.state.id) {
      props.history.push("/songs");
    }
  }, [props]);

  const { data, loading } = useQuery(SONG_DETAIL, {
    onCompleted: (data) => {
      setUsername(data.song.user.username);
    },
    variables: { id: props.location.state.id },
  });

  const [addLyric, { loading: lyricLoading }] = useMutation(ADD_LYRIC, {
    update(_, res) {
      setLyrics("");
    },
    refetchQueries: [
      { query: SONG_DETAIL, variables: { id: props.location.state.id } },
    ],
    onError(err) {
      console.log(err);
    },
  });

  const [likeLyric] = useMutation(LIKE_LYRIC, {
    refetchQueries: [
      { query: SONG_DETAIL, variables: { id: props.location.state.id } },
    ],
  });

  const lyricsHandler = (e) => {
    setLyrics(e.target.value);
  };

  const likeUnlikeButton = (likes, id) => {
    return likes.findIndex(
      (userId) => userId.toString() === user.id.toString()
    ) >= 0 ? (
      <Button
        variant="primary"
        onClick={() =>
          likeLyric({
            variables: { lyricId: id },
          })
        }
      >
        Unlike
      </Button>
    ) : (
      <Button
        variant="primary"
        onClick={() =>
          likeLyric({
            variables: { lyricId: id },
          })
        }
      >
        Like
      </Button>
    );
  };

  return !loading ? (
    <Card bg="success" style={{ width: "50%" }}>
      <Button variant="light" as={Link} to="/songs">
        Back to Song List
      </Button>
      <Card.Img variant="top" src={Music} />
      <Card.Body>
        <Card.Title className="text-white">{data.song.title}</Card.Title>
        {data.song.lyrics.map(({ id, content, likes }) => (
          <React.Fragment key={id}>
            <Card.Text className="text-white">
              {content}-
              {likes.length > 0
                ? likes.length > 1
                  ? `${likes.length}  likes`
                  : `${likes.length}like`
                : null}
            </Card.Text>
            {/* <Button
              variant="primary"
              onClick={() =>
                likeLyric({
                  variables: { lyricId: id },
                  optimisticResponse: {
                    __typename: "Mutation",
                    likeLyric: {
                      id,
                      __typename: "LyricType",
                      likes: likes + 1,
                    },
                  },
                })
              }
            >
              Like
            </Button> */}
            {likeUnlikeButton(likes, id)}
          </React.Fragment>
        ))}
        {user && user.username === username && (
          <>
            <Form.Control
              value={lyrics}
              onChange={lyricsHandler}
              type="text"
              placeholder="Add lyrics"
            />
            )
            {lyricLoading ? (
              <Button variant="primary">Adding lyrics..</Button>
            ) : (
              <Button
                disabled={lyrics.length === 0}
                variant="primary"
                onClick={() =>
                  addLyric({
                    variables: {
                      content: lyrics,
                      songId: props.location.state.id,
                    },
                  })
                }
              >
                Add lyrics
              </Button>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  ) : (
    <p className="text-white">Loading..</p>
  );
};

const SONG_DETAIL = gql`
  query getSong($id: ID!) {
    song(id: $id) {
      title
      user {
        username
      }
      lyrics {
        id
        content
        likes
      }
    }
  }
`;

const ADD_LYRIC = gql`
  mutation addLyric($content: String!, $songId: ID!) {
    addLyricToSong(content: $content, songId: $songId) {
      id
    }
  }
`;

const LIKE_LYRIC = gql`
  mutation likeLyric($lyricId: ID!) {
    likeLyric(lyricId: $lyricId) {
      id
      likes
    }
  }
`;

export default SongDetail;
