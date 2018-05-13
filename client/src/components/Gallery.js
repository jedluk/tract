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
    const pathname = this.props.location.pathname;
    let userImg = null;
    if(pathname.length > 'gallery/'.length){
      userImg = pathname.substring(pathname.lastIndexOf('/') + 1);
    }
    const [current, imgs] = [
      document.querySelector("#current"),
      document.querySelectorAll(".imgs img")
    ];
    current.src = userImg ? `../img/ready/` : `../img/gallery/`;
    userImg = userImg || STATIC_IMG_NAMES[Math.round(Math.random() * 3)];
    current.src += userImg;
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
    this.setState({current: userImg });
  }

  render() {
    return (
      <div className="galeryBackground">
        <div className="container">
          <div className="main-img">
            <img id="current" />
            {/* <Voting current={this.state.current}/> */}
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
