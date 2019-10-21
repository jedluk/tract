import React from 'react';

const genColor = (time, factor) => {
  return Math.round(Math.abs(Math.sin(time * factor)) * 255);
};

const Glow = ({ points = {} }) => {
  return Object.entries(points).map(([time, { clientX, clientY }]) => {
    const r = genColor(time, 0.002);
    const g = genColor(time, 0.003);
    const b = genColor(time, 0.005);
    return (
      <div
        key={time}
        style={{
          backgroundColor: `rgb(${r}, ${g}, ${b})`,
          position: 'absolute',
          left: `${clientX}px`,
          top: `${clientY}px`,
          borderRadius: '50%',
          width: 10,
          height: 10
        }}
      />
    );
  });
};

export default Glow;
