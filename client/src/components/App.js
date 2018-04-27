import React, { Component } from "react";
import UploadBox from "./UploadBox";
import RunnerBox from "./RunnerBox";
import axios from "axios";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dragStates: [{ active: false }, { active: false }],
      uploadedStates: [{ uploaded: null }, { uploaded: null }]
    };
  }

  componentDidMount() {
    const items = document.querySelectorAll(".uploadBox:not(:last-child)");
    items.forEach((item, idx) => {
      item.addEventListener("dragenter", () => {
        const dragStates = this.refreshDragStates(idx, true);
        this.setState({ ...this.state, dragStates });
      });
      item.addEventListener("dragleave", () => {
        const dragStates = this.refreshDragStates(idx, false);
        this.setState({ ...this.state, dragStates });
      });
      item.addEventListener("drop", evt => {
        evt.stopPropagation();
        evt.preventDefault();
        const files = evt.dataTransfer.files;
        this.handleUploadFile(files[0], idx);
      });
      item.addEventListener("dragover", evt => {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = "copy";
      });
    });
  }

  refreshDragStates(idx, value) {
    const dragStates = [...this.state.dragStates];
    dragStates[idx].active = value;
    return dragStates;
  }

  refreshUploadedStates(idx, value) {
    const uploadedStates = [...this.state.uploadedStates];
    uploadedStates[idx].uploaded = value;
    return uploadedStates;
  }

  handleUploadFile(file, idx) {
    const fd = new FormData();
    fd.append("image", file, file.name);
    axios
      .post("/upload", fd)
      .then(res => {
        console.log(res);
        const uploadedStates = this.refreshUploadedStates(idx, true);
        this.setState({ ...this.state, uploadedStates });
      })
      .catch(err => {
        // show image
        const uploadedStates = this.refreshUploadedStates(idx, false);
        this.setState({ ...this.state, uploadedStates });
      });
  }

  render() {
    return (
      <div>
        <header>
          <div className="row">
            <h1>Deep learning based coloring</h1>
            <h2>Refresh appearance of your old image in 3 simple steps</h2>
          </div>
        </header>
        <section className="content">
          <UploadBox
            dragActive={this.state.dragStates[0].active}
            uploaded={this.state.uploadedStates[0].uploaded}
            text="1. Upload gray-scale image"
            src="../img/pencil_gray.jpg"
          />
          <UploadBox
            dragActive={this.state.dragStates[1].active}
            uploaded={this.state.uploadedStates[1].uploaded}
            text="2. Add some colorfull pattern"
            src="../img/pencil.jpg"
          />
          <RunnerBox
            text="3. Hit start and wait for result!"
            src="../img/pencil_mix.jpg"
          />
        </section>
      </div>
    );
  }
}
