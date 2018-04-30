import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import axios from "axios";
import uuidv1 from "uuid/v1";

export default class RunnerBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      processing: false,
      readyImg: null
    };
    this.handleProcessing = this.handleProcessing.bind(this);
  }

  handleProcessing() {
    this.setState({ processing: true });
    axios.get('http://localhost:5000/process', {
      params: {
        grayImg: this.props.grayImg,
        colorImg: this.props.colorImg,
        outImg: `${uuidv1().slice(0,8)}.jpg`
      }
    })
    .then((res) => {
      let readyImgPath = res.data.outImg;
      // readyImgPath = `http://localhost:3000/../server/assets/ready/${readyImgPath}`;
      this.setState({ readyImg: readyImgPath})
    })
    .catch((err) => console.log(err));
  }

  render() {
    const icon = this.state.processing
      ? "fas fa-spinner"
      : "far fa-play-circle";
    return (
      <div className="uploadBox">
        {this.props.grayImg && this.props.colorImg ? (
          this.state.readyImg ? (
            <div className="downloadBox">
              <img src={this.state.readyImg} width="200px" alt="" />
              <h3>Ready Image !!!</h3>
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
          {this.state.processing ? this.state.readyImg ? "" : "Processing image..." : this.props.text}
        </h3>
      </div>
    );
  }
}
