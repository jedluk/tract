import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import uuidv1 from "uuid";

export default class UploadBox extends Component {
  constructor(props) {
    super(props);
    this.dragID = uuidv1().slice(0, 8);
  }

  deduceText() {
    if (this.props.uploaded) {
      return "Image uploaded sucesfully!";
    } else if (this.props.dragActive) {
      return "Drop image here";
    } else {
      return this.props.text;
    }
  }

  render() {
    const customBorder = this.props.dragActive ? "customBorder" : "";
    const itemClasses = `uploadBox ${customBorder}`;
    const text = this.deduceText();
    const fontName = this.props.uploaded ? "fas fa-check" : "far fa-image";
    const fontColor = this.props.uploaded ? "#00C516" : "#abc";

    return (
      <div id={this.dragID} className={itemClasses}>
        {this.props.dragActive ? (
          <FontAwesome name={fontName} size="5x" style={{ color: fontColor }} />
        ) : (
          <img
            src={this.props.src} // store here (optionally from user)
            width="200px"
            alt=""
          />
        )}
        <h3>{text}</h3>
      </div>
    );
  }
}
