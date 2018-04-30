import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import axios from 'axios';

export default class RunnerBox extends Component {
  constructor(props){
    super(props);
    this.state = {
      processing: false
    }
    this.handleProcessing = this.handleProcessing.bind(this);
  }

  handleProcessing(){
    this.setState({ processing: true });
    // axios GET 
  }

  render(){
    const icon = this.state.processing ? "fas fa-spinner" : "far fa-play-circle"
    return (
      <div className="uploadBox">
        {
          this.props.grayImg && this.props.colorImg ? (
          <div onClick={this.handleProcessing}>
            <FontAwesome
              name={icon}
              size="5x"
              style={{ color: "#00C516" }}
              spin={this.state.processing}
            />
          </div>
          ) : (
            <img src={this.props.src} width="200px" alt="" />
          )
        }
        <h3>{this.state.processing ? 'Processing image...' : this.props.text}</h3>
    </div>
    )
  }
}