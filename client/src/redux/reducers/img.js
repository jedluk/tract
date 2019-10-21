import { ACTIONS } from '../actions/img';
import { socket } from '../../index';

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
    // case ACTIONS.PROCESS: {
    //   socket.emit('process', {
    //     gray: state.grayImg,
    //     color: state.colorImg
    //   });
    //   return {
    //     ...state
    //   };
    // }
    case ACTIONS.SET_READY: {
      return {
        ...state,
        readyImg: action.name
      };
    }
    case ACTIONS.RESET: {
      const previous = [...state.previous, state.readyImg];
      return {
        ...DEFAULT_STATE,
        previous
      };
    }
    default:
      return state;
  }
};
