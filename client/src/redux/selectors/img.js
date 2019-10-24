import { createSelector } from "reselect";

const imgBranch = state => state.img;

export const grayImgSelector = createSelector(
  imgBranch,
  img => img.grayImg
);

export const colorImgSelector = createSelector(
  imgBranch,
  img => img.colorImg
);

export const requestedImageAvailableSelector = createSelector(
  imgBranch,
  img => img.resultImage.available
);

export const requestedImageSelector = createSelector(
  imgBranch,
  img => img.resultImage.src
);

export const previousImagesSelector = createSelector(
  imgBranch,
  img => img.previous
);
