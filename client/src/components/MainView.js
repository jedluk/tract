import React, { Component } from "react";
import UploadBox from "./UploadBox";
import RunnerBox from "./RunnerBox";
import {
  STEP_DESCRIPTION,
  IMG_PATH,
  MAIN_IMG_TEXT
} from "../utils/stringConstant";

export default class MainView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grayImg: null,
      colorImg: null,
      refresh: false
    };
    this.setGrayImg = this.setGrayImg.bind(this);
    this.setColorImg = this.setColorImg.bind(this);
    this.refreshBoxes = this.refreshBoxes.bind(this);
  }

  setGrayImg(name) {
    this.setState({ grayImg: name });
  }

  setColorImg(name) {
    this.setState({ colorImg: name });
  }

  refreshBoxes(){
    this.setState({ refresh: true });
  }

  render() {
    return (
      <div>
        <header>
          <div className="row">
            <h1>{MAIN_IMG_TEXT.title}</h1>
            <h2>{MAIN_IMG_TEXT.subtitile}</h2>
          </div>
        </header>
        <section className="content">
          <UploadBox
            gray={true}
            text={STEP_DESCRIPTION[1]}
            src={IMG_PATH[1]}
            setGrayImg={this.setGrayImg}
            refresh={this.state.refresh}
          />
          <UploadBox
            text={STEP_DESCRIPTION[2]}
            src={IMG_PATH[2]}
            setColorImg={this.setColorImg}
            refresh={this.state.refresh}
          />
          <RunnerBox
            grayImg={this.state.grayImg}
            colorImg={this.state.colorImg}
            text={STEP_DESCRIPTION[3]}
            src={IMG_PATH[3]}
            refreshBoxes={this.refreshBoxes}
          />
        </section>
      </div>
    );
  }
}
