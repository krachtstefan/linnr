import PropTypes from "prop-types";
import React from "react";

const Minimap = ({ width, height, matrix }) => (
  <div className="minimap">
    {[...new Array(width)].map((_, x) => {
      return (
        <div key={`row_${x}`} className="pixel-row">
          {[...new Array(height)].map((_, y) => {
            const isWorm = matrix.findIndex(
              coordinates => coordinates.x === x && coordinates.y === y
            );

            const isTail = isWorm === matrix.length - 1;
            const isHead = isWorm === 0;
            return (
              <div
                key={`pixel_${x}_${y}`}
                className={`pixel ${isWorm === -1 ? "x" : "o"} ${
                  isHead ? "head" : ""
                } ${isTail ? "tail" : ""}`}
              ></div>
            );
          })}
        </div>
      );
    })}
  </div>
);

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
