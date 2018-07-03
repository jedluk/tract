import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import FontAwesome from "react-fontawesome";
import axios from "axios";
import uuidv1 from "uuid/v1";
import { setReadyImage, processImage } from "../actions/img";

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
    const icon = this.state.processing
      ? "fas fa-spinner"
      : "far fa-play-circle";
    return (
      <div className="uploadBox">
        {this.props.grayImg && this.props.colorImg ? (
          this.props.readyImg ? (
            <div
              className="readyImageBox"
              onClick={() => this.props.history.push("/gallery")}
            >
              <img src={`/ready/${this.props.readyImg}`} width="200px" alt="" />
            </div>
          ) : (
            <div onClick={this.handleProcessing}>
              <FontAwesome
                name={icon}
                size="5x"
                style={{ color: "#00C516" }}
                spin={this.state.processing}
              />
            </div>
          )
        ) : (
          <img src={this.props.src} width="200px" alt="" />
        )}
        <h3>
          {this.state.processing
            ? this.props.readyImg
              ? ""
              : "Processing image..."
            : this.props.text}
        </h3>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  grayImg: state.img.grayImg,
  colorImg: state.img.colorImg,
  readyImg: state.img.readyImg
});

const mapDispatchToProps = dispatch => ({
  process: () => dispatch(processImage())
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(RunnerBox)
);
