import React from "react";

export default ({ text, src }) => (
  <div className="uploadBox">
    <img src={src} width="200px" alt="" />
    <h3>{text}</h3>
  </div>
);
