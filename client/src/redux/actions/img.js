export const ACTIONS = Object.freeze({
  SET_GRAY: "SET_GRAY",
  SET_COLOR: "SET_COLOR",
  SET_READY: "SET_READY",
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

export const setReadyImage = name => ({
  type: ACTIONS.SET_READY,
  name
});

export const reset = () => ({
  type: ACTIONS.RESET
})

export const processImage = () => ({
  type: ACTIONS.PROCESS
});
