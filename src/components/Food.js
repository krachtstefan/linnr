import AnimatedSprite from "./pixi/AnimatedSprite";
import PropTypes from "prop-types";
import React from "react";

const Food = ({ x, y, animation }) => {
  animation.loop = false;
  return <AnimatedSprite x={x} y={y} animation={animation} />;
};

Food.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  animation: PropTypes.object.isRequired
};

export default Food;
