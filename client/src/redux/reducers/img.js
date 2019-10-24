import ACTIONS from "../actions/types";

const DEFAULT_STATE = {
  grayImg: "",
  colorImg: "",
  resultImage: {
    src: "",
    available: false
  },
  previous: []
};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case ACTIONS.SET_GRAY:
      return {
        ...state,
        grayImg: action.name
      };
    case ACTIONS.SET_COLOR:
      return {
        ...state,
        colorImg: action.name
      };
    case ACTIONS.SET_REQUESTED_IMAGE:
      return {
        ...state,
        resultImage: {
          ...state.resultImage,
          src: action.name
        }
      };
    case ACTIONS.SET_REQUESTED_IMAGE_AVAILABLE:
      return {
        ...state,
        resultImage: {
          ...state.resultImage,
          available: true
        },
        previous: [...state.previous, state.resultImage.src]
      };
    case ACTIONS.RESET: {
      return {
        ...DEFAULT_STATE,
        previous: [...state.previous]
      };
    }
    default:
      return state;
  }
};
