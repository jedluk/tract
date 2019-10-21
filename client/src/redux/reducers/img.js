import { ACTIONS } from '../actions/img';

const DEFAULT_STATE = {
  grayImg: '',
  colorImg: '',
  readyImg: '',
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
    case ACTIONS.SET_READY: {
      return {
        ...state,
        readyImg: action.name
      };
    }
    case ACTIONS.RESET: {
      return {
        ...DEFAULT_STATE,
        previous: [...state.previous, state.readyImg]
      };
    }
    default:
      return state;
  }
};
