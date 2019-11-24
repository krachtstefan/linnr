import React from "react";
import { moveEvent } from "../redux/controls";
import { useDispatch } from "react-redux";

const Dpad = () => {
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
