import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import FontAwesome from "react-fontawesome";
import axios from "axios";
import uuidv1 from "uuid/v1";
import { IS_PRODUCTION } from "../utils/api-config";

class RunnerBox extends Component {
  constructor(props) {
    super(props);
    this.imageNameLength = 8;
    this.state = {
      processing: false,
      readyImg: null
    };
    this.handleProcessing = this.handleProcessing.bind(this);
    this.goToGallery = this.goToGallery.bind(this);
  }

  handleProcessing() {
    this.setState({ processing: true });
    const url = IS_PRODUCTION ? "/process" : "http://localhost:5000/process";
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
        readyImg = `../img/ready/${readyImg}`;
        this.setState({ readyImg: readyImg });
      })
      .catch(err => console.log(err));
  }

  goToGallery() {
    const imgName = this.state.readyImg.slice(
      - (this.imageNameLength + ".jpg".length)
    );
    this.props.history.push(`/gallery/${imgName}`);
  }

  render() {
    const icon = this.state.processing
      ? "fas fa-spinner"
      : "far fa-play-circle";
    return (
      <div className="uploadBox">
        {this.props.grayImg && this.props.colorImg ? (
          this.state.readyImg ? (
            <div className="readyImageBox" onClick={this.goToGallery}>
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

export default withRouter(RunnerBox);
