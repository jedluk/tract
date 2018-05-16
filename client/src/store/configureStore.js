import { createStore, combineReducers } from 'redux';
import imgReducer from '../reducers/img';

export default () => {
  const store = createStore(
    combineReducers({
      img: imgReducer
    })
  );

  return store;
};