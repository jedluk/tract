import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import { connect } from 'react-redux';
import uuidv1 from 'uuid/v1';
import axios from 'axios';
import Modal from './CustomModal';
import { MODAL_CONTENT_TEXT } from '../utils/stringConstant';
import { setGrayImage, setColorImage } from '../redux/actions/img';

class UploadBox extends Component {
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
    // box.addEventListener('dragenter', () => {
    //   this.setState({ dragActive: true });
    // });
    box.addEventListener('dragleave', () => {
      if (this.state.uploaded !== true) {
        this.setState({ dragActive: false });
      }
    });
    box.addEventListener('drop', evt => {
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
    box.addEventListener('dragover', evt => {
      evt.preventDefault();
      evt.stopPropagation();
      evt.dataTransfer.dropEffect = 'copy';
    });
  }

  handleUploadFile(file, idx) {
    const fd = new FormData();
    fd.append('file', file, this.props.gray ? `gray_${file.name}` : file.name);
    const url = '/upload';
    axios
      .post(url, fd)
      .then(res => {
        const { fileName: name } = res.data;
        this.setState({ uploaded: true });
        if (this.props.gray) {
          this.props.setGray(name);
        } else {
          this.props.setColor(name);
        }
      })
      .catch(error => {
        const { message: msg } = error.response.data;
        const modalText = msg.toLowerCase().match(/too large/)
          ? MODAL_CONTENT_TEXT.ERR_SIZE
          : MODAL_CONTENT_TEXT.ERR_UPL;
        this.setState({
          modalText,
          modal: true
        });
      });
  }

  handleModalClose() {
    this.setState({
      modal: false,
      dragActive: false
    });
  }

  deduceText() {
    if (this.state.uploaded) {
      return 'Image uploaded sucesfully!';
    } else if (this.state.dragActive) {
      return `Drop ${this.props.gray ? 'gray' : 'color'} image here`;
    } else {
      return this.props.text;
    }
  }

  render() {
    const customBorder = this.state.dragActive ? 'customBorder' : '';
    const boxClasses = `uploadBox ${customBorder}`;
    const text = this.deduceText();
    const fontName = this.state.uploaded ? 'fas fa-check' : 'far fa-image';
    const fontColor = this.state.uploaded ? '#00C516' : '#abc';

    return (
      <div
        id={this.boxID}
        className={boxClasses}
        onDragEnter={() => this.setState({ dragActive: true })}
        onDragLeave={() => this.setState({})}
      >
        <Modal
          show={this.state.modal}
          handleModalClose={this.handleModalClose}
          text={this.state.modalText}
        />
        {this.state.dragActive ? (
          <FontAwesome name={fontName} size="5x" style={{ color: fontColor }} />
        ) : (
          <img src={this.props.src} width="200px" alt="" />
        )}
        <h3>{text}</h3>
        <h5>{this.state.dragActive ? '' : 'Drop here'}</h5>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setColor: name => dispatch(setColorImage(name)),
    setGray: name => dispatch(setGrayImage(name))
  };
};

export default connect(
  undefined,
  mapDispatchToProps
)(UploadBox);
