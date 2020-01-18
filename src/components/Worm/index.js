import React, { useEffect, useState } from "react";
import {
  WORM_DIRECTIONS,
  collisionCheck,
  initiateNextMove
} from "../../redux/worm";
import { useDispatch, useSelector } from "react-redux";

import AnimatedSpritesheet from "./../pixi/AnimatedSprite.js";
import CONFIG from "../../config";
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

  let [deadAnimation] = useState(preloadedAnimations[0]["WORM-FX/Knall"]);
  let [deadAnimationOffsetX, setDeadAnimationOffsetX] = useState(0);
  let [deadAnimationOffsetY, setDeadAnimationOffsetY] = useState(0);
  deadAnimation.loop = false;
  useEffect(() => {
    if (dead === true) {
      deadAnimation.animationSpeed = 0.3;
      deadAnimation.gotoAndPlay(0);

      switch (direction[0].to) {
        case WORM_DIRECTIONS.N:
          // setDeadAnimationOffsetX();
          setDeadAnimationOffsetY(CONFIG.tileSize / 2);
          break;
        case WORM_DIRECTIONS.S:
          setDeadAnimationOffsetY(-CONFIG.tileSize / 2);
          break;
        case WORM_DIRECTIONS.E:
          setDeadAnimationOffsetX(-CONFIG.tileSize / 2);
          break;
        case WORM_DIRECTIONS.W:
          setDeadAnimationOffsetX(CONFIG.tileSize / 2);
          break;
        default:
          console.warn("unexpected direction");
          break;
      }
    }
  }, [dead, deadAnimation, direction]);

  return (
    <React.Fragment>
      {direction.length > 0
        ? positionStage.map((position, i) => (
            <Texture
              key={`${position.x}-${position.y}_${direction[i].from}_${direction[i].to}`}
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
      {dead === true ? (
        <AnimatedSpritesheet
          x={positionStage[0].x + deadAnimationOffsetX}
          y={positionStage[0].y + deadAnimationOffsetY}
          animation={deadAnimation}
        />
      ) : null}
    </React.Fragment>
  );
};

Worm.propTypes = {
  preloadedAnimations: PropTypes.array.isRequired
};

export default Worm;
