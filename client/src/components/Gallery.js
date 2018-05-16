import React, { Component } from "react";
import { connect } from "react-redux";
import Voting from "./Voting";
import { Link } from "react-router-dom";
import axios from "axios";

class Gallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: null,
      imgNames: null
    };
    this.changeCurrent = this.changeCurrent.bind(this);
  }

  componentDidMount() {
    let mainImg = null;
    const readyImg = this.props.img.readyImg;
    if (readyImg && readyImg.length > 0) {
      mainImg = readyImg;
      this.setState({ current: readyImg });
    } 
    const url = "/random";
    axios
      .get(url)
      .then(res => {
        let imgs = res.data;
        if (mainImg !== null){
          if(!imgs.some(name => name === mainImg)){
            imgs[0] = mainImg;
          }
        } else {
          mainImg = imgs[0];
        }
        this.setState({ imgNames: imgs, current: mainImg });
        document.querySelector("#current").src = `../img/gallery/${mainImg}`;
      })
      .catch(err => console.log(err));
  }
  
  changeCurrent(e){
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
            {/* <Voting current={this.state.current}/> */}
          </div>
          <div className="imgs">
            {this.state.imgNames ? (
              this.state.imgNames.map(imgName => (
                <img onClick={(e) => this.changeCurrent(e)} key={imgName} src={`../img/gallery/${imgName}`} />
              ))
            ) : (
              <p>Loading images...</p>
            )}
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
  img: state.img
});

export default connect(mapStateToProps)(Gallery);
