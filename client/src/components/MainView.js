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
      refresh: false,
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

  refreshBoxes = () => this.setState({ refresh: true });

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
          <UploadBox
            gray
            text={STEP_DESCRIPTION[1]}
            src={IMG_PATH[1]}
            refresh={this.state.refresh}
          />
          <UploadBox text={STEP_DESCRIPTION[2]} src={IMG_PATH[2]} refresh={this.state.refresh} />
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
