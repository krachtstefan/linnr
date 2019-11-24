import { useDispatch, useSelector } from "react-redux";

import React from "react";
import { WORM_DIRECTIONS } from "../redux/worm";
import { moveEvent } from "../redux/controls";

const Dpad = () => {
  const { moving, direction } = useSelector(state => state["worm"]);
  const dispatch = useDispatch();
  return (
    <div className="dpad">
      <div
        className={`up`}
        onClick={() => {
          dispatch(
            moveEvent({
              n: true,
              s: false,
              w: false,
              e: false
            })
          );
        }}
      />
      <div
        className={`left`}
        onClick={() => {
          dispatch(
            moveEvent({
              n: false,
              s: false,
              w: true,
              e: false
            })
          );
        }}
      />
      <div
        className={`right`}
        onClick={() => {
          dispatch(
            moveEvent({
              n: false,
              s: false,
              w: false,
              e: true
            })
          );
        }}
      />
      <div
        className={`down`}
        onClick={() => {
          dispatch(
            moveEvent({
              n: false,
              s: true,
              w: false,
              e: false
            })
          );
        }}
      />
    </div>
  );
};

export default Dpad;
