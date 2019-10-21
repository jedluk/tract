import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import FontAwesome from 'react-fontawesome';
import { processImage } from '../redux/actions/img';

class RunnerBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      processing: false
    };
    this.handleProcessing = this.handleProcessing.bind(this);
  }

  handleProcessing() {
    this.props.process();
    this.setState({ processing: true });
  }

  render() {
    const { grayImg, colorImg, readyImg, history } = this.props;
    const { processing } = this.state;
    const icon = processing ? 'fas fa-spinner' : 'far fa-play-circle';
    return (
      <div className="uploadBox">
        {grayImg && colorImg ? (
          readyImg ? (
            <div className="readyImageBox" onClick={() => history.push('/gallery')}>
              <img src={`/ready/${readyImg}`} width="200px" alt="" />
            </div>
          ) : (
            <div onClick={this.handleProcessing}>
              <FontAwesome name={icon} size="5x" style={{ color: '#00C516' }} spin={processing} />
            </div>
          )
        ) : (
          <img src={this.props.src} width="200px" alt="" />
        )}
        {!processing && <h3>{this.props.text}</h3>}
        <h3>{!processing && readyImg && 'Processing image...'}</h3>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    grayImg: state.getState().img.grayImg,
    colorImg: state.getState().img.colorImg,
    readyImg: state.getState().img.readyImg
  };
};

const mapDispatchToProps = dispatch => ({
  process: () => dispatch(processImage())
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(RunnerBox)
);
