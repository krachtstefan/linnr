import React, { useEffect, useState } from "react";
import { collisionCheck, initiateNextMove } from "../../redux/worm";
import { useDispatch, useSelector } from "react-redux";

import Bone from "./Bone";
import PropTypes from "prop-types";

let Worm = ({ preloadedAnimations }) => {
  // console.log("🐛");
  let dispatch = useDispatch();
  const {
    positionStage,
    destinationStage,
    destination,
    direction,
    animations,
    dead,
    spritesheet
  } = useSelector(state => {
    let { worm, stage } = state;
    return {
      positionStage: worm.position.map(pos => ({
        x: stage.tileSize * pos.x,
        y: stage.tileSize * pos.y
      })),
      destinationStage: worm.destination.map(pos => ({
        x: stage.tileSize * pos.x,
        y: stage.tileSize * pos.y
      })),
      destination: worm.destination,
      direction: worm.direction,
      animations: worm.animations,
      dead: worm.dead,
      spritesheet: stage.assets.spritesheet
    };
  });

  let [nextPositions, setNextPositions] = useState({});

  let arrived = boneIndex => {
    setNextPositions(old => ({ ...old, [boneIndex]: destination[boneIndex] }));
  };

  useEffect(() => {
    /**
     * as soon as all bones have submitted their next position,
     * dispatch it to redux to persist it and update the bones
     * position
     */
    if (Object.keys(nextPositions).length === positionStage.length) {
      setNextPositions({});
      dispatch(
        initiateNextMove(
          Object.keys(nextPositions)
            .sort()
            .map(key => nextPositions[key])
        )
      );
    }
  }, [nextPositions, positionStage.length, dispatch]);

  return (
    <React.Fragment>
      {direction.length > 0
        ? positionStage.map((position, i) => (
            <Bone
              key={`bone-${i}`}
              x={position.x}
              y={position.y}
              index={i}
              boneCount={positionStage.length}
              destX={destinationStage[i].x}
              destY={destinationStage[i].y}
              direction={direction[i]}
              spritesheet={spritesheet}
              animations={animations}
              dead={dead}
              arrived={arrived}
              checkCollision={() => dispatch(collisionCheck())}
              preloadedAnimations={preloadedAnimations[i]}
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
