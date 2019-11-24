import React from "react";
import { WORM_DIRECTIONS } from "../redux/worm";
import { useSelector } from "react-redux";

const Debugger = () => {
  let { worm } = useSelector(state => state);

  const renderDirectionEmoji = direction => {
    switch (direction) {
      case WORM_DIRECTIONS.N:
        return "↑";
      case WORM_DIRECTIONS.E:
        return "→";
      case WORM_DIRECTIONS.S:
        return "↓";
      default:
      case WORM_DIRECTIONS.W:
        return "←";
    }
  };

  return (
    <React.Fragment>
      <div className="debug">
        <strong>Debugger</strong>
        <br />
        <b>Position</b> {worm.position[0].x},{worm.position[0].y}
        <br />
        <b>Destination</b> {worm.destination[0].x},{worm.destination[0].y}
        <br />
        <b>Direction</b> <span>{renderDirectionEmoji(worm.direction[0])}</span>
        <br />
        <b>Moving</b> <span>{worm.moving ? "✔" : "❌"}</span>
      </div>
    </React.Fragment>
  );
};

export default Debugger;
