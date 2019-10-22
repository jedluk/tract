import { grayImgSelector, colorImgSelector } from '../selectors/img';
import { socket } from '../../index';
import uuid from 'uuid/v1';

export const ACTIONS = Object.freeze({
  SET_GRAY: 'SET_GRAY',
  SET_COLOR: 'SET_COLOR',
  SET_READY: 'SET_READY',
  RESET: 'RESET',
  PROCESS: 'PROCESS'
});

export const setGrayImage = name => ({
  type: ACTIONS.SET_GRAY,
  name
});

export const setColorImage = name => ({
  type: ACTIONS.SET_COLOR,
  name
});

export const setReadyImage = name => ({
  type: ACTIONS.SET_READY,
  name
});

export const reset = () => ({
  type: ACTIONS.RESET
});

export const processImage = () => (dispatch, getState) => {
  const outImg = `${uuid()}.png`;
  socket.emit('process', {
    inputGray: grayImgSelector(getState()),
    inputColor: colorImgSelector(getState()),
    outImg,
    N: 10
  });
  socket.on('response', data => {
    const { status, msg } = data;
    if (status === 'OK') {
      dispatch(setReadyImage(outImg));
    } else {
      console.error(msg);
    }
  });
};
