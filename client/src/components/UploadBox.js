import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import { connect } from 'react-redux';
import Modal from './CustomModal';
import { uploadImage } from '../services/fileServer';
import { MODAL_CONTENT_TEXT } from '../utils/stringConstant';
import { setGrayImage, setColorImage } from '../redux/actions/img';
import { grayImgSelector, colorImgSelector } from '../redux/selectors/img';

class UploadBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploaded: false,
      dragActive: false,
      modal: false,
      modalText: null
    };
    this.handleModalClose = this.handleModalClose.bind(this);
  }

  handleDrop = evt => {
    evt.stopPropagation();
    evt.preventDefault();
    const files = evt.dataTransfer.files;
    if (files.length > 1) {
      this.setState({
        modal: true,
        modalText: MODAL_CONTENT_TEXT.MUL_INFO
      });
    }
    if (/(\.png)|(\.jpg)|(\.tif?f)$/.test(files[0].name)) {
      this.handleUploadFile(files[0]);
    } else {
      this.setState({
        modal: true,
        modalText: MODAL_CONTENT_TEXT.EXT_INFO
      });
    }
  };

  handleDragLeave = () => {
    if (!this.state.uploaded) {
      this.setState({ dragActive: false });
    }
  };

  handleDragOver = evt => {
    evt.preventDefault();
    evt.stopPropagation();
    evt.dataTransfer.dropEffect = 'copy';
  };

  handleDragEnter = () => this.setState({ dragActive: true });

  handleDragLeave = () => {
    this.setState({ dragActive: false });
  };

  async handleUploadFile(file) {
    try {
      const { fileName: name } = await uploadImage(file);
      this.props.gray ? this.props.setGray(name) : this.props.setColor(name);
      this.setState({ uploaded: true });
    } catch (error) {
      const { message: msg } = error.response.data;
      const modalText = msg.toLowerCase().match(/too large/)
        ? MODAL_CONTENT_TEXT.ERR_SIZE
        : MODAL_CONTENT_TEXT.ERR_UPL;
      this.setState({ modalText, modal: true });
    }
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
        className={boxClasses}
        {...(!this.props.imgAvailable && {
          onDrop: this.handleDrop,
          onDragOver: this.handleDragOver,
          onDragLeave: this.handleDragLeave,
          onDragEnter: this.handleDragEnter
        })}
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
        {!this.state.uploaded && <h5>Drop here</h5>}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  imgAvailable: ownProps.gray ? grayImgSelector(state) : colorImgSelector(state)
});

const mapDispatchToProps = dispatch => {
  return {
    setColor: name => dispatch(setColorImage(name)),
    setGray: name => dispatch(setGrayImage(name))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadBox);
