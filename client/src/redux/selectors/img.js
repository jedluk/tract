import { createSelector } from 'reselect';

const imgBranch = state => state.img;

export const grayImgSelector = createSelector(
  imgBranch,
  img => img.grayImg
);

export const colorImgSelector = createSelector(
  imgBranch,
  img => img.colorImg
);

export const readyImgSelector = createSelector(
  imgBranch,
  img => img.readyImg
);
