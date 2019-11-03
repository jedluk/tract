const roundHundred = value => Math.round(value / 100) * 100;

export function scaleToClustersRange(min, max, x) {
  return roundHundred(((max - min) * (x - 1)) / 9 + min);
}
