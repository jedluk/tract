import React from 'react';

const UploadBox = (props) => (
    <section className="content">
      <div className="item">
        <img src="../img/pencil_gray.jpg" width="200px" alt="" />
        <h3>Upload your gray-scale image here</h3>
      </div>
      <div className="item">
        <img src="../img/pencil.jpg" width="200px" alt="" />
        <h3>Put colorfull image here</h3>
      </div>
      <div className="item">
        <img src="../img/pencil_mix.jpg" width="200px" alt="" />
        <h3>Hit start and wait for result!</h3>
      </div>
    </section>
)

export default UploadBox;