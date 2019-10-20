export const makeGlow = e => {
  const time = new Date().getTime();
  const r = genColor(time, 0.002);
  const g = genColor(time, 0.003);
  const b = genColor(time, 0.005);
  const color = `rgb(${r}, ${g}, ${b})`;
  const pixelDiv = document.createElement('div');
  pixelDiv.style.position = 'absolute';
  pixelDiv.style.left = `${e.clientX}px`;
  pixelDiv.style.top = `${e.clientY}px`;
  pixelDiv.style.width = '10px';
  pixelDiv.style.height = '10px';
  pixelDiv.style.borderRadius = '50px';
  pixelDiv.style.backgroundColor = color;
  return pixelDiv;
};

const genColor = (time, factor) => {
  return Math.round(Math.abs(Math.sin(time * factor)) * 255);
};
