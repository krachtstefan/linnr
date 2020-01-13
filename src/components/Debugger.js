import React, { useState } from "react";

import { WORM_DIRECTIONS } from "../redux/worm";
import { useSelector } from "react-redux";

const Debugger = () => {
  let { worm } = useSelector(state => state);
  let [open, setOpen] = useState(true);

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
      <div
        className="toggle-debugger"
        role="button"
        onClick={() => setOpen(current => !current)}
      >
        {open === true ? "\ue150 close debugger" : `🔍 open debugger`}
      </div>
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
          <div>position </div>
          <div>
            {worm.position[0].x},{worm.position[0].y}{" "}
            <span role="img" aria-labelledby="Position">
              📍
            </span>
          </div>
        </div>
        <div className="row">
          <div>destination</div>
          <div>
            {worm.destination[0].x},{worm.destination[0].y}{" "}
            <span role="img" aria-labelledby="Finish">
              🏁
            </span>
          </div>
        </div>
        <div className="row">
          <div>animation sequence</div>
          <div>{worm.animationSequence}</div>
        </div>
        <div className="row">
          <div>direction</div>
          <div>
            {renderDirectionEmoji(worm.nextDirection)}
            {worm.nextDirectionQueue
              ? ` (${renderDirectionEmoji(worm.nextDirectionQueue)})`
              : null}
          </div>
        </div>
        <div className="row">
          <div>age</div>
          <div>{worm.age}</div>
        </div>
        <div className="row">
          <div>status</div>
          <div>{worm.dead ? "☠️" : "❤️"}</div>
        </div>
      </div>
    </div>
  );
};

export default Debugger;
