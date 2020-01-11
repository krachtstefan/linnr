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

  let [nextSequence, setNextSequence] = useState({});

  useEffect(() => {
    /**
     * as soon as all textures have called their next sequence callback
     * move to the next trigger the next sequence
     */
    if (Object.keys(nextSequence).length === positionStage.length) {
      console.log("next sequence comitted by all textures", nextSequence);
      setNextSequence({});
      dispatch(
        animationSequence === 1
          ? collisionCheck()
          : initiateNextMove(destination)
      );
    }
  }, [
    nextSequence,
    destination,
    animationSequence,
    positionStage.length,
    dispatch
  ]);

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
              sequenceFinished={() => console.log("sequence finished", i)}
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
