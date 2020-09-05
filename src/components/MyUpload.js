import React from "react";

import Upload from "./upload";
import UploadwithPreview from "./uploadWithPreview";
import Uploads from "./Uploads";

const MyUpload = () => {
  return (
    <div className=" text-white container">
      <Upload />
      <UploadwithPreview />
      <Uploads />
    </div>
  );
};

export default MyUpload;
