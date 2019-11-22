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
        <b>Position</b> {worm.position.x},{worm.position.y}
        <br />
        <b>Destination</b> {worm.destination.x},{worm.destination.y}
        <br />
        <b>Direction</b> <span>{renderDirectionEmoji(worm.direction)}</span>
        <br />
        <b>Moving</b> <span>{worm.moving ? "✔" : "❌"}</span>
      </div>
    </React.Fragment>
  );
};

export default Debugger;
