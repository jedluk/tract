import React, { Component } from "react";
import UploadBox from "./UploadBox";
import RunnerBox from "./RunnerBox";
import {
  STEP_DESCRIPTION,
  IMG_PATH,
  MAIN_IMG_TEXT
} from "../utils/stringConstant";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grayImg: null,
      colorImg: null
    };
    this.setGrayImg = this.setGrayImg.bind(this);
    this.setColorImg = this.setColorImg.bind(this);
  }

  setGrayImg(name) {
    this.setState({ grayImg: name });
    console.log(`gray is set with name ${name}`);
  }

  setColorImg(name) {
    this.setState({ colorImg: name });
    console.log(`color is set with name ${name}`);
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
          />
          <UploadBox
            text={STEP_DESCRIPTION[2]}
            src={IMG_PATH[2]}
            setColorImg={this.setColorImg}
          />
          <RunnerBox
            grayImg={this.state.grayImg}
            colorImg={this.state.colorImg}
            text={STEP_DESCRIPTION[3]}
            src={IMG_PATH[3]}
          />
        </section>
      </div>
    );
  }
}
