import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import FontAwesome from 'react-fontawesome';
import { processImage, reset } from '../redux/actions/img';
import {
  grayImgSelector,
  colorImgSelector,
  requestedImageAvailableSelector,
  requestedImageSelector
} from '../redux/selectors/img';
import { FILE_SERVER } from '../services/fileServer';
import { scaleToClustersRange } from '../utils/numbers';

class RunnerBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clusters: 4,
      cartoon: false,
      processing: false
    };
  }

  componentDidMount() {
    this.props.reset();
  }

  handleProcessing = () => {
    const { clusters, cartoon } = this.state;
    this.props.process(clusters, cartoon);
    this.setState({ processing: true });
  };

  increaseClusters = () =>
    this.state.clusters < 10 && this.setState({ clusters: this.state.clusters + 1 });

  decreaseClusters = () =>
    this.state.clusters > 1 && this.setState({ clusters: this.state.clusters - 1 });

  handleToggleCartoon = () => this.setState({ cartoon: !this.state.cartoon });

  countClusterFontWeight = () => ({
    fontWeight: scaleToClustersRange(100, 900, this.state.clusters)
  });

  render() {
    const { grayImg, colorImg, readyImg, imgAvailable, history } = this.props;
    const { processing, cartoon, clusters } = this.state;
    const icon = processing ? 'fas fa-spinner' : 'far fa-play-circle';
    return (
      <div className="uploadBox">
        {(!grayImg || !colorImg) && (
          <img src={this.props.src} width="200px" alt="" style={{ paddingTop: 10 }} />
        )}
        {grayImg && colorImg && !imgAvailable && (
          <div className={!processing ? 'uploadBox__processing-panel' : ''}>
            {!processing && (
              <>
                <h3>Number of clusters:</h3>
                <div className="uploadBox__counter-box">
                  <FontAwesome onClick={this.decreaseClusters} name="fas fa-minus" size="2x" />
                  <span className="uploadBox__counter" style={this.countClusterFontWeight()}>
                    {clusters}
                  </span>
                  <FontAwesome onClick={this.increaseClusters} name="fas fa-plus" size="2x" />
                </div>
                <div>
                  <input
                    name="cartoon"
                    type="checkbox"
                    value={cartoon}
                    onChange={this.handleToggleCartoon}
                  />
                  <label htmlFor="cartoon" style={{ ...(cartoon && { fontWeight: 'bold' }) }}>
                    cartoon filter
                  </label>
                </div>
              </>
            )}
            <FontAwesome
              onClick={this.handleProcessing}
              name={icon}
              size="5x"
              style={{ color: '#00C516' }}
              spin={processing}
            />
            {processing && <h3>Processing image with {this.state.clusters} clusters...</h3>}
          </div>
        )}
        {imgAvailable && (
          <div className="readyImageBox" onClick={() => history.push('/gallery')}>
            <img src={`${FILE_SERVER}/${readyImg}`} width="200px" alt="" />
          </div>
        )}
        {!processing && !grayImg && !colorImg && <h3>{this.props.text}</h3>}
        {!processing && !grayImg && !colorImg && <h5>...and enjoy it!</h5>}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  grayImg: grayImgSelector(state),
  colorImg: colorImgSelector(state),
  imgAvailable: requestedImageAvailableSelector(state),
  readyImg: requestedImageSelector(state)
});

const mapDispatchToProps = dispatch => ({
  reset: () => dispatch(reset()),
  process: (n, useCartoon) => dispatch(processImage(n, useCartoon))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(RunnerBox)
);
