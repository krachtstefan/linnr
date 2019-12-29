import { FILENAME_SEGMENTS, initiateNextMove } from "../redux/worm";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import AnimatedSpritesheet from "./pixi/AnimatedSprite.js";
import PropTypes from "prop-types";
import config from "../config";
import { useTick } from "@inlet/react-pixi";

let getNextPos = (position = 0, destPosition = 0, velocity = 0) => {
  let nextPos = position + velocity;
  let arrived =
    velocity > 0 ? nextPos >= destPosition : nextPos <= destPosition;
  return [arrived, nextPos];
};

let getWormAnimationName = ({ bodypart, from, to }) =>
  `WORM-${bodypart}/${FILENAME_SEGMENTS[from]}/2${FILENAME_SEGMENTS[to]}`;

let Head = ({ x, y, animation }) => {
  return animation ? (
    <AnimatedSpritesheet x={x} y={y} animation={animation} />
  ) : null;
};

let Body = ({ x, y, animation }) => {
  return animation ? (
    <AnimatedSpritesheet x={x} y={y} animation={animation} />
  ) : null;
};

let Tail = ({ x, y, animation }) => {
  return animation ? (
    <AnimatedSpritesheet x={x} y={y} animation={animation} />
  ) : null;
};

let Bone = ({
  index,
  boneCount,
  x,
  y,
  destX,
  destY,
  destination,
  direction,
  preloadedAnimations,
  dead,
  arrived = () => {}
}) => {
  // console.log("🦴");
  let [virtualX, setVirtualX] = useState(x);
  let [virtualY, setVirtualY] = useState(y);

  useTick(delta => {
    let xArrived = undefined;
    let yArrived = undefined;
    let nextX = null;
    let nextY = null;
    let tickVelosity = delta * config.velocity;

    if (destX !== virtualX) {
      [xArrived, nextX] = getNextPos(
        virtualX,
        destX,
        virtualX < destX ? tickVelosity : -1 * tickVelosity
      );
      setVirtualX(xArrived ? destX : nextX);
    }
    if (destY !== virtualY) {
      [yArrived, nextY] = getNextPos(
        virtualY,
        destY,
        virtualY < destY ? tickVelosity : -1 * tickVelosity
      );
      setVirtualY(yArrived ? destY : nextY);
    }

    if (xArrived === true || yArrived === true) {
      arrived(index, destination);
    }
  });

  let animationName = getWormAnimationName({
    bodypart: index === 0 ? "HD" : index === boneCount - 1 ? "TL" : "BY",
    from: direction.from,
    to: direction.to
  });

  let animation =
    Object.keys(preloadedAnimations).includes(animationName) === true
      ? preloadedAnimations[animationName]
      : preloadedAnimations["WORM-Fallback"];

  if (dead === true) {
    animation.stop();
  }

  let BoneType = index === 0 ? Head : index === boneCount - 1 ? Tail : Body;
  return <BoneType x={x} y={y} animation={animation} />;
};

Bone.propTypes = {
  index: PropTypes.number.isRequired,
  boneCount: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  destX: PropTypes.number.isRequired,
  destY: PropTypes.number.isRequired,
  destination: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }),
  direction: PropTypes.shape({
    from: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired
  }),
  animations: PropTypes.object.isRequired,
  preloadedAnimations: PropTypes.object.isRequired,
  dead: PropTypes.bool.isRequired,
  spritesheet: PropTypes.object.isRequired,
  arrived: PropTypes.func.isRequired
};

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
                {...position}
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
