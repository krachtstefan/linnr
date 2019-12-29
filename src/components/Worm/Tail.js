import AnimatedSpritesheet from "./../pixi/AnimatedSprite.js";
import PropTypes from "prop-types";
import React from "react";

let Tail = ({ x, y, animation }) => {
  return animation ? (
    <AnimatedSpritesheet x={x} y={y} animation={animation} />
  ) : null;
};

Tail.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  direction: PropTypes.shape({
    from: PropTypes.number.isRequired,
    to: PropTypes.number.isRequired
  }),
  dead: PropTypes.bool.isRequired
};

export default Tail;
