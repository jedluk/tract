import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import { connect } from 'react-redux';
import Modal from './CustomModal';
import { uploadImage, FILE_SERVER } from '../services/fileServer';
import { MODAL_CONTENT_TEXT } from '../utils/stringConstant';
import { setGrayImage, setColorImage } from '../redux/actions/img';
import { grayImgSelector, colorImgSelector } from '../redux/selectors/img';

const getReadyImageStyles = (imgURL, gray) => ({
  backgroundImage: `url(${FILE_SERVER}/${imgURL}`,
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  ...(gray && { filter: 'grayscale(100%)' })
});

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
    const { gray, imageSource } = this.props;
    const { uploaded, modal, modalText, dragActive } = this.state;
    return (
      <div
        {...(!imageSource && {
          onDrop: this.handleDrop,
          onDragOver: this.handleDragOver,
          onDragLeave: this.handleDragLeave,
          onDragEnter: this.handleDragEnter
        })}
        className={`uploadBox ${dragActive && !uploaded ? 'customBorder' : ''}`}
        style={{
          ...(uploaded && getReadyImageStyles(imageSource, gray))
        }}
      >
        <Modal show={modal} handleModalClose={this.handleModalClose} text={modalText} />
        {dragActive ? (
          <FontAwesome
            name={uploaded ? 'fas fa-check' : 'far fa-image'}
            size="5x"
            style={{ color: uploaded ? '#00C516' : '#abc' }}
          />
        ) : (
          <img src={this.props.src} width="200px" alt="" />
        )}
        <h3>{this.deduceText()}</h3>
        {!uploaded && <h5>Drop here</h5>}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  imageSource: ownProps.gray ? grayImgSelector(state) : colorImgSelector(state)
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
