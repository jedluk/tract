import { ACTION_SET_READY_IMAGE } from '../actions/img';

export default (state = {}, action) => {
  switch(action.type){
    case ACTION_SET_READY_IMAGE:
      return {
        readyImg: action.image
      }
    default: 
      return state;
  }
}