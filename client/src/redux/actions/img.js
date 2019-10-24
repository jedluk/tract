import { grayImgSelector, colorImgSelector } from "../selectors/img";
import { store } from "../../index";
import {
  requestedImageAvailableSelector,
  requestedImageSelector,
  previousImagesSelector
} from "../selectors/img";
import ACTIONS from "./types";
import io from "socket.io-client";
import uuid from "uuid/v1";

const { NODE_ENV, SOCKET_PORT = 5000 } = process.env;
const worker = NODE_ENV === "development" ? `http://localhost:${SOCKET_PORT}` : "";
const socket = io(worker);

socket.on("response", data => {
  const { status, msg } = data;
  if (status === "OK") {
    store.dispatch(setRequestedImageAvailable());
  } else {
    //TODO: show error placeholder to the user
    console.error(msg);
  }
});

socket.on("reconnect", () => {
  // sometimes connection hangs while processing -
  // this is why we check for ready image existence while reconnect
  const imageAvailable = requestedImageAvailableSelector(store.getState());
  const requestedImage = requestedImageSelector(store.getState());
  const previousImages = previousImagesSelector(store.getState());
  if (requestedImage && !imageAvailable && !previousImages.includes(requestedImage)) {
    socket.emit("check img", requestedImage);
  }
});

export const setGrayImage = name => ({
  type: ACTIONS.SET_GRAY,
  name
});

export const setColorImage = name => ({
  type: ACTIONS.SET_COLOR,
  name
});

export const setRequestedImage = name => ({
  type: ACTIONS.SET_REQUESTED_IMAGE,
  name
});

export const setRequestedImageAvailable = () => ({
  type: ACTIONS.SET_REQUESTED_IMAGE_AVAILABLE
});

export const reset = () => ({
  type: ACTIONS.RESET
});

export const processImage = () => (dispatch, getState) => {
  const outImg = `${uuid()}.png`;
  dispatch(setRequestedImage(outImg));
  const N = window.TRACT_CLUSTERS || 10;
  socket.emit("process", {
    N,
    outImg,
    inputGray: grayImgSelector(getState()),
    inputColor: colorImgSelector(getState()),
  });
};
