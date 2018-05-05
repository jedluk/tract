import React, { Component } from "react";
import Voting from './Voting';
import { Link } from "react-router-dom";
import { STATIC_IMG_NAMES } from "../utils/stringConstant";

export default class Gallery extends Component {
  constructor(props) {
    super(props);
    this.imgNames = STATIC_IMG_NAMES;
    this.state = {
      current: null
    }
  }

  componentDidMount() {
    const [current, imgs] = [
      document.querySelector("#current"),
      document.querySelectorAll(".imgs img")
    ];
    imgs.forEach(img =>
      img.addEventListener("click", e => {
        current.src = e.target.src;
        const cutIndex = e.target.src.lastIndexOf("/");
        const currentImg = e.target.src.slice(cutIndex + 1);
        this.setState({ current: currentImg });
        current.classList.add("fade-in");
        setTimeout(() => current.classList.remove("fade-in"), 500);
      })
    );
    const randomPic = STATIC_IMG_NAMES[Math.floor(Math.random() * 4)];
    this.setState({current: randomPic });
    current.src = `../img/gallery/${randomPic}`;
  }

  render() {
    return (
      <div className="galeryBackground">
        <div className="container">
          <div className="main-img">
            <img id="current" />
            <Voting current={this.state.current}/>
          </div>
          <div className="imgs">
            {this.imgNames.map(imgName => (
              <img key={imgName} src={`../img/gallery/${imgName}`} />
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
