import React from 'react';

function CreatePost() {
  return (
    <div
      className="card input-field"
      style={{
        margin: '30px auto',
        maxWidth: '500px',
        padding: '20px',
        textAlign: 'center',
      }}
    >
      <input type="text" placeholder="title" />
      <input type="text" placeholder="body" />

      <form action="#">
        <div className="file-field input-field">
          <div className="btn">
            <span>Upload Image</span>
            <input type="file" />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
        <button className="btn waves-effect waves-light" type="submit">
          Post
        </button>
      </form>
    </div>
  );
}

export default CreatePost;
