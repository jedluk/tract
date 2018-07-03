import React, { Component } from "react";
import { Link } from "react-router-dom";
import uuidv1 from "uuid/v1";
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
      refresh: false
    };
    this.headerId = uuidv1().slice(0, 8);
    this.refreshBoxes = this.refreshBoxes.bind(this);
    this.generateBlob = this.generateBlob.bind(this);
  }

  componentDidMount() {
    const container = document.getElementById(this.headerId);
    const generateBlob = this.generateBlob;
    container.addEventListener("mousemove", function(evt) {
      if (window.innerHeight * 0.69 > evt.clientY) {
        generateBlob(evt, container);
      }
    });
  }

  generateBlob(e, container) {
    const time = new Date().getTime();
    const color = `rgb(${this.genColor(time, 0.002)}, ${this.genColor(
      time,
      0.003
    )}, ${this.genColor(time, 0.005)})`;
    const pixelDiv = document.createElement("div");
    pixelDiv.style.position = "absolute";
    pixelDiv.style.left = `${e.clientX}px`;
    pixelDiv.style.top = `${e.clientY}px`;
    pixelDiv.style.width = "10px";
    pixelDiv.style.height = "10px";
    pixelDiv.style.borderRadius = "50px";
    pixelDiv.style.backgroundColor = color;
    container.appendChild(pixelDiv);
    setTimeout(() => {
      container.removeChild(pixelDiv);
    }, 1000);
  }

  genColor(time, factor) {
    return Math.round(Math.abs(Math.sin(time * factor)) * 255);
  }

  refreshBoxes() {
    this.setState({ refresh: true });
  }

  render() {
    return (
      <div>
        <header id={this.headerId}>
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
            refresh={this.state.refresh}
          />
          <UploadBox
            text={STEP_DESCRIPTION[2]}
            src={IMG_PATH[2]}
            refresh={this.state.refresh}
          />
          <RunnerBox
            text={STEP_DESCRIPTION[3]}
            src={IMG_PATH[3]}
            refreshBoxes={this.refreshBoxes}
          />
        </section>
        <footer>
          Go to <Link to="/gallery">gallery</Link>
        </footer>
      </div>
    );
  }
}
