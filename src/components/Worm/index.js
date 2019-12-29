import { FILENAME_SEGMENTS, initiateNextMove } from "../../redux/worm";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Bone from "./Bone";
import PropTypes from "prop-types";

export const getWormAnimationName = ({ bodypart, direction }) =>
  `WORM-${bodypart}/${FILENAME_SEGMENTS[direction.from]}/2${
    FILENAME_SEGMENTS[direction.to]
  }`;

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

  let arrived = (boneIndex, position) => {
    setNextPositions(old => ({ ...old, [boneIndex]: position }));
  };

  useEffect(() => {
    /**
     * as soon as all bones have submitted their next position,
     * dispatch it to redux to persist it and and update the bones
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
        ? positionStage.map((position, i) => {
            return (
              <Bone
                key={`bone-${i}`}
                x={position.x}
                y={position.y}
                index={i}
                boneCount={positionStage.length}
                destX={destinationStage[i].x}
                destY={destinationStage[i].y}
                destination={destination[i]}
                direction={direction[i]}
                spritesheet={spritesheet}
                animations={animations}
                dead={dead}
                arrived={arrived}
                preloadedAnimations={preloadedAnimations[i]}
              />
            );
          })
        : null}
    </React.Fragment>
  );
};

Worm.propTypes = {
  preloadedAnimations: PropTypes.array.isRequired
};

export default Worm;
