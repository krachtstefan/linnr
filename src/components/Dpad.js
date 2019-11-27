import React, { useEffect, useState } from "react";

import { moveEvent } from "../redux/controls";
import { useDispatch } from "react-redux";

const Dpad = () => {
  const dispatch = useDispatch();
  let [direction, setDirection] = useState("");

  useEffect(() => {
    if (direction !== "") {
      const timer = setTimeout(() => {
        setDirection("");
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [direction]);

  return (
    <div className="dpad-wrapper">
      <div className={`dpad ${direction ? `active-${direction}` : ""}`}>
        <div
          className={`n`}
          onClick={() => {
            setDirection("n");
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
          className={`w`}
          onClick={() => {
            setDirection("w");
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
          className={`e`}
          onClick={() => {
            setDirection("e");
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
          className={`s`}
          onClick={() => {
            setDirection("s");
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
    </div>
  );
};

export default Dpad;
