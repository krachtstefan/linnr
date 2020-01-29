import PropTypes from "prop-types";
import React from "react";

const Minimap = ({ width, height, matrix }) => {
  const padding = 2; // padding around stage
  const verticalItemCount = height + 2 * padding;
  const horizontalItemCount = width + 2 * padding;
  return (
    <div className="minimap">
      {[...new Array(horizontalItemCount)].map((_, x) => {
        return (
          <div key={`row_${x}`} className="pixel-row">
            {[...new Array(verticalItemCount)].map((_, y) => {
              const isWorm = matrix.findIndex(
                coordinates =>
                  coordinates.x + padding === x && coordinates.y + padding === y
              );

              const isTail = isWorm === matrix.length - 1;
              const isHead = isWorm === 0;

              return (
                <div
                  key={`pixel_${x}_${y}`}
                  className={`pixel ${isWorm === -1 ? "" : "worm"} ${
                    isHead ? "head" : ""
                  } ${isTail ? "tail" : ""} ${
                    y === 0 ||
                    y === verticalItemCount - 1 ||
                    x === 0 ||
                    x === horizontalItemCount - 1
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
