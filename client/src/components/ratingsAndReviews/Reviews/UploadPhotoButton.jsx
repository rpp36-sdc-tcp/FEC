import React from 'react';

const UploadPhotoButton = (props) => {
  return (
    <div>
      <form>
        <input type="file" id="myFile" name="filename" disabled={props.disabled} onChange={(e) => { props.photoUploadedFunc(e); }}></input>
      </form>
    </div>
  );
};

export default UploadPhotoButton;

