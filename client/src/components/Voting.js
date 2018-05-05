import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import { STATIC_IMG_NAMES } from "../utils/stringConstant";

export default class Voting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSocial: null
    };
  }

  componentWillReceiveProps(nextProps) {
    const { current } = nextProps;
    if (nextProps.current !== null) {
      const data =
        JSON.parse(localStorage.getItem("votes")) || this.createEmptyVotes();
      const activeSocial = data.find(image => image.name === current).social;
      this.setState({ activeSocial });
    }
  }

  createEmptyVotes() {
    const data = STATIC_IMG_NAMES.map(name => {
      return {
        name,
        social: null
      };
    });
    localStorage.setItem("votes",JSON.stringify(data));
    return data;
  }

  updateVote(vote) {
    let data = JSON.parse(localStorage.getItem("votes"));
    let updatingElem = data.find(elem => elem.name === this.props.current);
    updatingElem.social = vote;
    data[data.indexOf(this.props.current)] = updatingElem;
    localStorage.setItem("votes", JSON.stringify(data));
    this.setState({ activeSocial: vote });
  }

  render() {
    const socials = ["like", "love", "smile"];

    return (
      <div className="social">
        <FontAwesome
          name="far fa-thumbs-up"
          onClick={() => this.updateVote(socials[0])}
          style={{
            color: this.state.activeSocial === socials[0] ? "blue" : ""
          }}
        />
        <FontAwesome
          name="fas fa-heart"
          onClick={() => this.updateVote(socials[1])}
          style={{ color: this.state.activeSocial === socials[1] ? "red" : "" }}
        />
        <FontAwesome
          name="far fa-smile-o"
          onClick={() => this.updateVote(socials[2])}
          style={{
            color: this.state.activeSocial === socials[2] ? "yellow" : ""
          }}
        />
      </div>
    );
  }
}
