import React, { useState } from "react";

import { WORM_DIRECTIONS } from "../redux/worm";
import { useSelector } from "react-redux";

const Debugger = () => {
  let { worm } = useSelector(state => state);
  let [open, setOpen] = useState(false);

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
    <div className="debug-wrapper">
      <a
        className="toggle-debugger"
        role="button"
        onClick={() => setOpen(current => !current)}
      >
        {open === true ? "close" : "open debugger"}
      </a>
      <div className={`debug ${open === false ? "hide" : ""}`.trim()}>
        <h1>
          <span role="img" aria-labelledby="Crab">
            🦀
          </span>{" "}
          Debugger{" "}
          <span role="img" aria-labelledby="Space Invader">
            👾
          </span>
        </h1>
        <div className="row">
          <div>Position </div>
          <div>
            {worm.position[0].x},{worm.position[0].y}{" "}
            <span role="img" aria-labelledby="Position">
              📍
            </span>
          </div>
        </div>

        <div className="row">
          <div>Destination</div>
          <div>
            {worm.destination[0].x},{worm.destination[0].y}{" "}
            <span role="img" aria-labelledby="Finish">
              🏁
            </span>
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
    </div>
  );
};

export default Debugger;
