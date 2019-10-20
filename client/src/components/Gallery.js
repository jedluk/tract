import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { reset } from '../redux/actions/img';

class Gallery extends Component {
  constructor(props) {
    super(props);
    this.sampleImages = ['img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg'];
    this.state = {
      current: null
    };
    this.changeCurrent = this.changeCurrent.bind(this);
    this.previousExist = this.previousExist.bind(this);
    this.loadPrevious = this.loadPrevious.bind(this);
  }

  componentDidMount() {
    if (this.props.readyImg) {
      this.loadPrevious();
      this.sampleImages = [...this.sampleImages.slice(1), this.props.readyImg];
      this.props.reset();
    } else if (this.previousExist()) {
      this.loadPrevious();
    }
    const mainImg =
      this.props.readyImg ||
      this.sampleImages[Math.ceil(Math.random() * this.sampleImages.length - 1)];
    this.setState({ current: mainImg });
    document.querySelector('#current').src = `/ready/${mainImg}`;
  }

  previousExist() {
    return this.props.previous.length >= 1;
  }

  loadPrevious() {
    this.props.previous.forEach(img => (this.sampleImages = [...this.sampleImages.slice(1), img]));
  }

  changeCurrent(e) {
    current.src = e.target.src;
    const cutIndex = e.target.src.lastIndexOf('/');
    const currentImg = e.target.src.slice(cutIndex + 1);
    this.setState({ current: currentImg });
    current.classList.add('fade-in');
    setTimeout(() => current.classList.remove('fade-in'), 500);
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
              <img onClick={e => this.changeCurrent(e)} key={imgName} src={`/ready/${imgName}`} />
            ))}
          </div>
        </div>
        <footer>
          <div className="goHome">
            go <Link to="/">home</Link>
          </div>
          Bare awesome free images are taken from{' '}
          <a href="https://www.pexels.com/" target="_blank">
            pexels
          </a>
        </footer>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  readyImg: state.img.readyImg,
  previous: state.img.previous
});

const mapDispatchToProps = dispatch => ({
  reset: () => dispatch(reset())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Gallery);
