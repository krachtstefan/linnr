import React, { useEffect, useState } from "react";

import { setNextDirection } from "../redux/controls";
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
              setNextDirection({
                N: true,
                S: false,
                W: false,
                E: false
              })
            );
          }}
        />
        <div
          className={`w`}
          onClick={() => {
            setDirection("w");
            dispatch(
              setNextDirection({
                N: false,
                S: false,
                W: true,
                E: false
              })
            );
          }}
        />
        <div
          className={`e`}
          onClick={() => {
            setDirection("e");
            dispatch(
              setNextDirection({
                N: false,
                S: false,
                W: false,
                E: true
              })
            );
          }}
        />
        <div
          className={`s`}
          onClick={() => {
            setDirection("s");
            dispatch(
              setNextDirection({
                N: false,
                S: true,
                W: false,
                E: false
              })
            );
          }}
        />
      </div>
    </div>
  );
};

export default Dpad;
