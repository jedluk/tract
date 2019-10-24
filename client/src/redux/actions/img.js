import { grayImgSelector, colorImgSelector } from "../selectors/img";
import { store } from "../../index";
import {
  requestedImageAvailableSelector,
  requestedImageSelector,
  previousImagesSelector
} from "../selectors/img";
import io from "socket.io-client";
import uuid from "uuid/v1";

const { NODE_ENV, SOCKET_PORT = 5000 } = process.env;

const worker = NODE_ENV === "development" ? `http://localhost:${SOCKET_PORT}` : "";
export const socket = io(worker);

// sometimes connection hangs while processing -
// this is why we check for ready image existence after connect
socket.on("connect", () => {
  const imageAvailable = requestedImageAvailableSelector(store.getState());
  const requestedImage = requestedImageSelector(store.getState());
  const previousImages = previousImagesSelector(store.getState());
  if (requestedImage && !imageAvailable && !previousImages.includes(requestedImage)) {
    socket.emit("check img", requestedImage);
    socket.on("response", data => {
      const { status } = data;
      if (status === "OK") {
        store.dispatch(setRequestedImageAvailable());
      }
    });
  }
});

export const ACTIONS = Object.freeze({
  SET_GRAY: "SET_GRAY",
  SET_COLOR: "SET_COLOR",
  SET_REQUESTED_IMAGE: "SET_REQUESTED_IMAGE",
  SET_REQUESTED_IMAGE_AVAILABLE: "SET_IMAGE_AVAILABLE",
  RESET: "RESET",
  PROCESS: "PROCESS"
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
    inputGray: grayImgSelector(getState()),
    inputColor: colorImgSelector(getState()),
    outImg,
    N
  });
  socket.on("response", data => {
    const { status, msg } = data;
    if (status === "OK") {
      dispatch(setRequestedImageAvailable());
    } else {
      console.error(msg);
    }
  });
};
