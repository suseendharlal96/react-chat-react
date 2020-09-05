import React from "react";
import { gql, useQuery } from "@apollo/client";

export const FileQuery = gql`
  {
    files {
      id
      filename
      mimetype
      path
    }
  }
`;

export default function Uploads() {
  const { loading, data } = useQuery(FileQuery);

  if (loading) {
    return <h1>Loading...</h1>;
  } else if (!data) {
    return <h1>No images to show</h1>;
  } else {
    return (
      <>
        <h1 className="text-center">Recent uploads</h1>
        {data &&
          data.files &&
          data.files.length > 0 &&
          data.files.map((file) => {
            console.log(file);
            return (
              file.mimetype.split("/")[0].includes("image") && (
                <div
                  style={{
                    padding: 16,
                    border: "1px solid gray",
                    borderRadius: 5,
                    margin: "16px 0",
                  }}
                  key={file.filename}
                >
                  <img
                    src={"/" + file.path}
                    alt={file.filename}
                    style={{ width: "100%" }}
                  />
                  <p>{file.filename}</p>
                </div>
              )
            );
          })}
      </>
    );
  }
}
