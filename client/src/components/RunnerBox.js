import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import FontAwesome from 'react-fontawesome';
import { processImage, reset } from '../redux/actions/img';
import { grayImgSelector, colorImgSelector, readyImgSelector } from '../redux/selectors/img';
import { FILE_SERVER } from '../services/fileServer';

class RunnerBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      processing: false
    };
  }

  componentDidMount() {
    this.props.reset();
  }

  handleProcessing = () => {
    this.props.process();
    this.setState({ processing: true });
  };

  render() {
    const { grayImg, colorImg, readyImg, history } = this.props;
    const { processing } = this.state;
    const icon = processing ? 'fas fa-spinner' : 'far fa-play-circle';
    return (
      <div className="uploadBox">
        {(!grayImg || !colorImg) && (
          <img src={this.props.src} width="200px" alt="" style={{ paddingTop: 10 }} />
        )}
        {grayImg && colorImg && !readyImg && (
          <div onClick={this.handleProcessing}>
            <FontAwesome name={icon} size="5x" style={{ color: '#00C516' }} spin={processing} />
          </div>
        )}
        {readyImg && (
          <div className="readyImageBox" onClick={() => history.push('/gallery')}>
            <img src={`${FILE_SERVER}/${readyImg}`} width="200px" alt="" />
          </div>
        )}
        {!processing && <h3>{this.props.text}</h3>}
        {!processing && <h5>...and enjoy it!</h5>}
        <h3>{!processing && readyImg && 'Processing image...'}</h3>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  grayImg: grayImgSelector(state),
  colorImg: colorImgSelector(state),
  readyImg: readyImgSelector(state)
});

const mapDispatchToProps = dispatch => ({
  reset: () => dispatch(reset()),
  process: () => dispatch(processImage())
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(RunnerBox)
);
