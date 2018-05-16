import React, { Component } from "react";
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import FontAwesome from "react-fontawesome";
import axios from "axios";
import uuidv1 from "uuid/v1";
import { IS_PRODUCTION } from "../utils/api-config";
import { setReadyImage } from '../actions/img';

class RunnerBox extends Component {
  constructor(props) {
    super(props);
    this.imageNameLength = 8;
    this.state = {
      processing: false,
      readyImg: null
    };
    this.handleProcessing = this.handleProcessing.bind(this);
  }

  handleProcessing() {
    this.setState({ processing: true });
    const url = "/process";
    axios
      .get(url, {
        params: {
          grayImg: this.props.grayImg,
          colorImg: this.props.colorImg,
          outImg: `${uuidv1().slice(0, this.imageNameLength)}.jpg`
        }
      })
      .then(res => {
        let readyImg = res.data.outImg;
        this.setState({ readyImg: `../img/gallery/${readyImg}`});
        this.props.dispatch(setReadyImage(readyImg));
      })
      .catch(err => console.log(err));
  }

  render() {
    const icon = this.state.processing
      ? "fas fa-spinner"
      : "far fa-play-circle";
    return (
      <div className="uploadBox">
        {this.props.grayImg && this.props.colorImg ? (
          this.state.readyImg ? (
            <div className="readyImageBox" onClick={() => this.props.history.push("/gallery")}>
              <img src={this.state.readyImg} width="200px" alt="" />
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
            ? this.state.readyImg
              ? ""
              : "Processing image..."
            : this.props.text}
        </h3>
      </div>
    );
  }
}

export default withRouter(connect()(RunnerBox));
