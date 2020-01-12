import React, { useEffect, useState } from "react";
import { collisionCheck, initiateNextMove } from "../../redux/worm";
import { useDispatch, useSelector } from "react-redux";

import PropTypes from "prop-types";
import Texture from "./Texture";

let Worm = ({ preloadedAnimations }) => {
  // console.log("🐛");
  let dispatch = useDispatch();

  const {
    positionStage,
    direction,
    animationSequence,
    dead,
    destination
  } = useSelector(state => {
    let { worm, stage } = state;
    return {
      positionStage: worm.position.map(pos => ({
        x: stage.tileSize * pos.x,
        y: stage.tileSize * pos.y
      })),
      destination: worm.destination,
      direction: worm.direction,
      animationSequence: worm.animationSequence,
      dead: worm.dead
    };
  });

  return (
    <React.Fragment>
      {direction.length > 0
        ? positionStage.map((position, i) => (
            <Texture
              key={`${position.x}-${position.y}`}
              x={position.x}
              y={position.y}
              direction={direction[i]}
              preloadedAnimations={preloadedAnimations[i]}
              dead={dead}
              animationSequence={animationSequence}
              sequenceFinished={() => {
                dispatch(
                  animationSequence === 0
                    ? collisionCheck()
                    : initiateNextMove(destination)
                );
              }}
              index={i}
              elementCount={positionStage.length}
            />
          ))
        : null}
    </React.Fragment>
  );
};

Worm.propTypes = {
  preloadedAnimations: PropTypes.array.isRequired
};

export default Worm;
