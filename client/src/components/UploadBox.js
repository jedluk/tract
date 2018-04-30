import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import uuidv1 from "uuid/v1";
import axios from "axios";
import Modal from "./CustomModal";
import { MODAL_CONTENT_TEXT } from "../utils/stringConstant";

export default class UploadBox extends Component {
  constructor(props) {
    super(props);
    this.boxID = uuidv1().slice(0, 8);
    this.state = {
      uploaded: false,
      dragActive: false,
      modal: false,
      modalText: null
    };
    this.handleModalClose = this.handleModalClose.bind(this);
  }

  componentDidMount() {
    const box = document.getElementById(this.boxID);
    box.addEventListener("dragenter", () => {
      this.setState({ dragActive: true });
    });
    box.addEventListener("dragleave", () => {
      this.setState({ dragActive: false });
    });
    box.addEventListener("drop", evt => {
      evt.stopPropagation();
      evt.preventDefault();
      const files = evt.dataTransfer.files;
      if (files.length > 1) {
        this.setState({
          modal: true,
          modalText: MODAL_CONTENT_TEXT.MUL_INFO
      });
      } else {
        if (/(\.png)|(\.jpg)|(\.tif?f)$/.test(files[0].name)) {
          this.handleUploadFile(files[0]);
        } else {
          this.setState({
            modal: true,
            modalText: MODAL_CONTENT_TEXT.EXT_INFO
          });
        }
      }
    });
    box.addEventListener("dragover", evt => {
      evt.preventDefault();
      evt.stopPropagation();
      evt.dataTransfer.dropEffect = "copy";
    });
  }

  handleUploadFile(file, idx) {
    console.log('handling')
    const fd = new FormData();
    let fileName = uuidv1().slice(0,8);
    if(this.props.gray){
      fileName = `black_${fileName}`;
    }
    const extension = file.name.slice(-(file.name.length - file.name.lastIndexOf('.')));
    fileName = `${fileName}${extension}`;
    fd.append(fileName, file);
    axios
      .post("http://localhost:5000/upload", fd)
      .then(res => {
        // call parent method
        this.setState({ uploaded: true });
        if (this.props.gray){
          this.props.setGrayImg(fileName);
        } else {
          this.props.setColorImg(fileName);
        }
      })
      .catch(err => {
        this.setState({ 
          modal: true,
          modalText: MODAL_CONTENT_TEXT.ERR_UPL
       });
      });
  }

  handleModalClose() {
    this.setState({
      ...this.state,
      modal: false,
      dragActive: false
    });
  }

  deduceText() {
    if (this.state.imageUploaded) {
      return "Image uploaded sucesfully!";
    } else if (this.state.dragActive) {
      return `Drop ${this.props.gray ? 'gray' : 'color'} image here`;
    } else {
      return this.props.text;
    }
  }

  render() {
    const customBorder = this.state.dragActive ? "customBorder" : "";
    const boxClasses = `uploadBox ${customBorder}`;
    const text = this.deduceText();
    const fontName = this.state.uploaded ? "fas fa-check" : "far fa-image";
    const fontColor = this.state.uploaded ? "#00C516" : "#abc";

    return (
      <div id={this.boxID} className={boxClasses}>
        <Modal
          show={this.state.modal}
          handleModalClose={this.handleModalClose}
          text={this.state.modalText}
        />
        {this.state.dragActive ? (
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
