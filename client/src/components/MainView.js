import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import UploadBox from './UploadBox';
import Glow from './Glow';
import RunnerBox from './RunnerBox';
import { STEP_DESCRIPTION, IMG_PATH, MAIN_IMG_TEXT } from '../utils/stringConstant';

export default class MainView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      points: {}
    };
  }

  handleMouseMove = e => {
    const now = new Date().getTime();
    const { clientY, clientX } = e;
    const point = { [now]: { clientY, clientX } };
    this.setState({ points: { ...this.state.points, ...point } });
    setTimeout(() => {
      const newPoints = { ...this.state.points };
      delete newPoints[now];
      this.setState({ points: { ...newPoints } });
    }, 1500);
  };

  render() {
    return (
      <div>
        <header onMouseMove={this.handleMouseMove}>
          <Glow points={this.state.points} />
          <div className="row">
            <h1>{MAIN_IMG_TEXT.title}</h1>
            <h2>{MAIN_IMG_TEXT.subtitile}</h2>
          </div>
        </header>
        <section className="content">
          <UploadBox gray text={STEP_DESCRIPTION.GRAY} src={IMG_PATH.GRAY} />
          <UploadBox text={STEP_DESCRIPTION.COLOR} src={IMG_PATH.COLOR} />
          <RunnerBox text={STEP_DESCRIPTION.MIX} src={IMG_PATH.MIX} />
        </section>
        <footer>
          Go to <Link to="/gallery">gallery</Link>
        </footer>
      </div>
    );
  }
}
