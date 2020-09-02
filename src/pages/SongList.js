import React, { useState } from "react";
import { Link } from "react-router-dom";

import { gql, useQuery, useMutation, useSubscription } from "@apollo/client";

import { Card, ListGroup, Button } from "react-bootstrap";

import { slugify } from "../util/slugify";
import { useAuthState } from "../context/authcontext";
import { GET_SONG_LIST } from "../util/songsQuery";

const SongList = (props) => {
  const [delIndex, setDelIndex] = useState(null);

  const { user } = useAuthState();

  const { data: mysongs, loading } = useQuery(GET_SONG_LIST);

  const detail = (id, title) => {
    props.history.push(`/songs/${slugify(title)}`, { id });
  };
  const removeSong = (id, index) => {
    setDelIndex(index);
    deleteSong({ variables: { songId: id } });
  };
  const [deleteSong, { loading: deleteLoading }] = useMutation(DELETE_SONG, {
    refetchQueries: [{ query: GET_SONG_LIST }],
    onError: (err) => {
      console.log(err);
    },
  });

  // if (songAdded) {
  //   console.log("subs", songAdded);
  // }

  return (
    <div className="py-5">
      {!loading ? (
        <Card>
          <Button variant="success" as={Link} to="/songs/create">
            Create a song
          </Button>
          <ListGroup variant="flush">
            {mysongs.songs.map(({ id, title, user: { username } }, index) => (
              <React.Fragment key={id}>
                <ListGroup.Item>{title}</ListGroup.Item>
                <ListGroup.Item>
                  <Button
                    onClick={() => detail(id, title)}
                  >{`Details of ${title}`}</Button>
                  {delIndex === index && deleteLoading ? (
                    <Button
                      style={{ float: "right" }}
                      variant="danger"
                    >{`Deleting ${title}...`}</Button>
                  ) : user && user.username === username ? (
                    <Button
                      style={{ float: "right" }}
                      variant="danger"
                      onClick={() => removeSong(id, index)}
                    >{`Delete ${title}`}</Button>
                  ) : null}
                </ListGroup.Item>
              </React.Fragment>
            ))}
          </ListGroup>
        </Card>
      ) : (
        <p className="text-white">Loading..</p>
      )}
    </div>
  );
};

const DELETE_SONG = gql`
  mutation deleteSong($songId: ID!) {
    deleteSong(songId: $songId)
  }
`;

export default SongList;
