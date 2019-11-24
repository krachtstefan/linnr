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
        <h1>🦀 Debugger 👾</h1>
        <div className="row">
          <div>Position </div>
          <div>
            {worm.position[0].x},{worm.position[0].y} 📍
          </div>
        </div>

        <div className="row">
          <div>Destination</div>
          <div>
            {worm.destination[0].x},{worm.destination[0].y} 🏁
          </div>
        </div>
        <div className="row">
          <div>Direction</div>
          <div>{renderDirectionEmoji(worm.direction[0])}</div>
        </div>
        <div className="row">
          <div>Moving</div>
          <div>{worm.moving ? "✔" : "❌"}</div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Debugger;
