import { combineReducers } from 'redux';
import imgReducer from './reducers/img';

const rootReducer = combineReducers({
  img: imgReducer
});

export default rootReducer;