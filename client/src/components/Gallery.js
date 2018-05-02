import React, { Component } from "react";
import { Link } from "react-router-dom";
import { STATIC_IMG_NAMES } from "../utils/stringConstant";

export default class Gallery extends Component {
  constructor(props) {
    super(props);
    this.imgNames = STATIC_IMG_NAMES; // maybe later names should be obtained from store ?
  }

  componentDidMount() {
    const [current, imgs] = [
      document.querySelector("#current"),
      document.querySelectorAll(".imgs img")
    ];
    imgs.forEach(img =>
      img.addEventListener("click", e => {
        current.src = e.target.src;
        current.classList.add("fade-in");
        setTimeout(() => current.classList.remove("fade-in"), 500);
      })
    );
  }

  render() {
    return (
      <div className="galeryBackground">
        <div class="container">
          <div class="main-img">
            <img
              src={`../img/gallery/${
                this.imgNames[Math.floor(Math.random() * 4)]
              }`}
              id="current"
            />
          </div>
          <div class="imgs">
            {this.imgNames.map(imgName => (
              <img src={`../img/gallery/${imgName}`} />
            ))}
          </div>
        </div>
        <footer>
          <div className="goHome">
            go <Link to="/">home</Link>
          </div>
          Bare awesome free images are taken from{" "}
          <a href="https://www.pexels.com/" target="_blank">
            pexels
          </a>
        </footer>
      </div>
    );
  }
}
