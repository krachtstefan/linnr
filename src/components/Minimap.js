import PropTypes from "prop-types";
import React from "react";

const Minimap = ({ width, height, matrix }) => {
  const padding = 1; // padding around stage
  return (
    <div className="minimap">
      {[...new Array(width + 2 * padding)].map((_, x) => {
        return (
          <div key={`row_${x}`} className="pixel-row">
            {[...new Array(height + 2 * padding)].map((_, y) => {
              const isWorm = matrix.findIndex(
                coordinates =>
                  coordinates.x + padding === x && coordinates.y + padding === y
              );

              const isTail = isWorm === matrix.length - 1;
              const isHead = isWorm === 0;

              return (
                <div
                  key={`pixel_${x}_${y}`}
                  className={`pixel ${isWorm === -1 ? "x" : "o"} ${
                    isHead ? "head" : ""
                  } ${isTail ? "tail" : ""} ${
                    y === 0 ||
                    y === height + padding ||
                    x === 0 ||
                    x === width + padding
                      ? "border"
                      : ""
                  }`.trim()}
                ></div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

Minimap.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  matrix: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    })
  ).isRequired
};

export default Minimap;
