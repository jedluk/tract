import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { reset } from '../redux/actions/img';
import FontAwesome from 'react-fontawesome';
import {
  previousImagesSelector,
  requestedImageAvailableSelector,
  requestedImageSelector
} from '../redux/selectors/img';
import { getSamples, FILE_SERVER } from '../services/fileServer';

class Gallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mainImg: '',
      sampleImages: []
    };
    this.mainImgRef = React.createRef();
  }

  componentDidMount() {
    getSamples()
      .then(sample => {
        const { readyImg, imgAvailable, previous } = this.props;
        const sampleImages = [...previous, ...sample].filter(Boolean).slice(0, 4);
        const mainImg =
          (imgAvailable && readyImg) || sample[Math.ceil(Math.random() * sample.length - 1)];
        this.setState({ mainImg, sampleImages });
      })
      .catch(err => console.error('cannot get sample images'));
  }

  changeMain = mainImg => {
    this.setState({ mainImg });
    const { current } = this.mainImgRef;
    current.classList.add('fade-in');
    setTimeout(() => current.classList.remove('fade-in'), 500);
  };

  render() {
    return (
      <div className="galeryBackground">
        <div className="container">
          <div className="main-img">
            <img ref={this.mainImgRef} alt="main" src={`${FILE_SERVER}/${this.state.mainImg}`} />
            {!!this.state.mainImg && (
              <a href={`${FILE_SERVER}/${this.state.mainImg}`} download={this.state.mainImg}>
                <FontAwesome name="fas fa-download" className="main-img__download-icon" size="5x" />
              </a>
            )}
          </div>
          <div className="imgs">
            {this.state.sampleImages.map(imgName => (
              <img
                key={imgName}
                alt="sample"
                onClick={() => this.changeMain(imgName)}
                src={`${FILE_SERVER}/${imgName}`}
              />
            ))}
          </div>
        </div>
        <footer>
          <div className="goHome">
            go <Link to="/">home</Link>
          </div>
          Bare awesome free images are taken from{' '}
          <a href="https://www.pexels.com/" rel="noopener noreferrer" target="_blank">
            pexels
          </a>
        </footer>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  imgAvailable: requestedImageAvailableSelector(state),
  readyImg: requestedImageSelector(state),
  previous: previousImagesSelector(state)
});

const mapDispatchToProps = dispatch => ({
  reset: () => dispatch(reset())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Gallery);
