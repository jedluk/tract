import React, { Component } from "react";
import { connect } from "react-redux";
import Voting from "./Voting";
import { Link } from "react-router-dom";
import axios from "axios";

class Gallery extends Component {
  constructor(props) {
    super(props);
    this.sampleImages = ["img1.jpg", "img2.jpg", "img3.jpg", "img4.jpg"];
    this.state = {
      current: null
    };
    this.changeCurrent = this.changeCurrent.bind(this);
  }

  componentDidMount() {
    let mainImg = null;
    if (this.props.readyImg) {
      mainImg = this.props.readyImg;
      this.sampleImages.shift();
      this.sampleImages.unshift(mainImg);
    } else {
      mainImg = this.sampleImages[Math.ceil(Math.random() * this.sampleImages.length - 1)];
    }
    this.setState({ current: mainImg });
    document.querySelector("#current").src = `/ready/${mainImg}`;
  }

  changeCurrent(e) {
    current.src = e.target.src;
    const cutIndex = e.target.src.lastIndexOf("/");
    const currentImg = e.target.src.slice(cutIndex + 1);
    this.setState({ current: currentImg });
    current.classList.add("fade-in");
    setTimeout(() => current.classList.remove("fade-in"), 500);
  }

  render() {
    return (
      <div className="galeryBackground">
        <div className="container">
          <div className="main-img">
            <img id="current" />
          </div>
          <div className="imgs">
            {this.sampleImages.map(imgName => (
              <img
                onClick={e => this.changeCurrent(e)}
                key={imgName}
                src={`/ready/${imgName}`}
              />
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

const mapStateToProps = state => ({
  readyImg: state.img.readyImg
});

export default connect(mapStateToProps)(Gallery);
