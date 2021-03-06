import { FILENAME_SEGMENTS, WORM_DIRECTIONS } from "../../redux/worm";
import React, { useEffect, useReducer } from "react";

import AnimatedSprite from "./../pixi/AnimatedSprite.js";
import PropTypes from "prop-types";
import { config } from "../../config";

const getWormAnimationSpecs = ({
  bodypart,
  direction,
  animations,
  animationSequence
}) => {
  const returnValidAnimationSpec = (animationName, props) => {
    let validAnimationName =
      Object.keys(animations).includes(animationName) === true
        ? animationName
        : "WORM-Fallback";

    if (Object.keys(animations).includes(animationName) === false) {
      console.warn("sprite not found", animationName);
    }
    return {
      name: validAnimationName,
      animation: animations[validAnimationName],
      startIndex: 0,
      removeAtFinish: false,
      ...props
    };
  };

  let animationsArr = [];

  // head
  if (bodypart === "HD") {
    animationsArr.push(
      returnValidAnimationSpec(
        `WORM-${bodypart}/${FILENAME_SEGMENTS[direction.from]}/${
          animationSequence === 0
            ? "Entry" // entry
            : `2${FILENAME_SEGMENTS[direction.to]}` // move
        }`
      )
    );
    // second head
  } else if (bodypart === "HD2") {
    animationsArr.push(
      animationSequence === 0
        ? // head is going out
          returnValidAnimationSpec(
            `WORM-HD/${FILENAME_SEGMENTS[direction.from]}/2${
              FILENAME_SEGMENTS[direction.to]
            }`,
            { startIndex: 4 }
          )
        : // body part
          returnValidAnimationSpec(
            `WORM-BY/${FILENAME_SEGMENTS[direction.from]}/2${
              FILENAME_SEGMENTS[direction.to]
            }`,
            { startIndex: 8 }
          )
    );

    // very last part ot the worm
  } else if (bodypart === "TL2") {
    // non corner
    if (direction.from === direction.to) {
      // vertical up
      if ([WORM_DIRECTIONS.N].includes(direction.from)) {
        animationsArr.push(
          returnValidAnimationSpec(
            `WORM-TL/${FILENAME_SEGMENTS[direction.from]}/2${
              FILENAME_SEGMENTS[direction.to]
            }`,
            { startIndex: animationSequence === 0 ? 14 : 22 }
          )
        );
        // vertical down
      } else if ([WORM_DIRECTIONS.S].includes(direction.from)) {
        animationsArr.push(
          returnValidAnimationSpec(
            `WORM-TL/${FILENAME_SEGMENTS[direction.from]}/2${
              FILENAME_SEGMENTS[direction.to]
            }`,
            { startIndex: animationSequence === 0 ? 6 : 14 }
          )
        );
        // horizontal
      } else {
        animationsArr.push(
          returnValidAnimationSpec(
            `WORM-TL/${FILENAME_SEGMENTS[direction.from]}/2${
              FILENAME_SEGMENTS[direction.to]
            }`,
            { startIndex: animationSequence === 0 ? 12 : 20 } // should not change
          )
        );
      }
      // corner
    } else {
      animationsArr.push(
        returnValidAnimationSpec(
          `WORM-TL/${FILENAME_SEGMENTS[direction.from]}/2${
            FILENAME_SEGMENTS[direction.to]
          }`,
          { startIndex: animationSequence === 0 ? 12 : 20 }
        )
      );
    }
    // second last part of the worm
  } else if (bodypart === "TL") {
    // non corner
    if (direction.from === direction.to) {
      // vertical up
      if ([WORM_DIRECTIONS.N].includes(direction.from)) {
        animationsArr.push(
          returnValidAnimationSpec(
            `WORM-${bodypart}/${FILENAME_SEGMENTS[direction.from]}/2${
              FILENAME_SEGMENTS[direction.to]
            }`,
            { startIndex: animationSequence === 0 ? 2 : 10 }
          )
        );
        // vertical down
      } else if ([WORM_DIRECTIONS.S].includes(direction.from)) {
        animationsArr.push(
          animationSequence === 0
            ? returnValidAnimationSpec(
                `WORM-BY/${FILENAME_SEGMENTS[direction.from]}/2${
                  FILENAME_SEGMENTS[direction.to]
                }`
              )
            : returnValidAnimationSpec(
                `WORM-${bodypart}/${FILENAME_SEGMENTS[direction.from]}/2${
                  FILENAME_SEGMENTS[direction.to]
                }`,
                { startIndex: 2 }
              )
        );
        // horizontal
      } else {
        animationsArr.push(
          returnValidAnimationSpec(
            `WORM-${bodypart}/${FILENAME_SEGMENTS[direction.from]}/2${
              FILENAME_SEGMENTS[direction.to]
            }`,
            { startIndex: animationSequence === 0 ? 0 : 8 }
          )
        );
      }
      // corner
    } else {
      animationsArr.push(
        returnValidAnimationSpec(
          `WORM-${bodypart}/${FILENAME_SEGMENTS[direction.from]}/2${
            FILENAME_SEGMENTS[direction.to]
          }`,
          { startIndex: animationSequence === 0 ? 0 : 8 }
        )
      );
    }
  } else {
    // move
    if (animationSequence === 0) {
      animationsArr.push(
        returnValidAnimationSpec(
          `WORM-${bodypart}/${FILENAME_SEGMENTS[direction.from]}/2${
            FILENAME_SEGMENTS[direction.to]
          }`
        )
      );
    } else {
      let animationSpec = returnValidAnimationSpec(
        `WORM-${bodypart}/${FILENAME_SEGMENTS[direction.from]}/2${
          FILENAME_SEGMENTS[direction.to]
        }`
      );

      animationsArr.push(
        returnValidAnimationSpec(
          `WORM-${bodypart}/${FILENAME_SEGMENTS[direction.from]}/2${
            FILENAME_SEGMENTS[direction.to]
          }`,
          { startIndex: animationSpec.animation.totalFrames > 8 ? 8 : 0 }
        )
      );
    }
  }
  return animationsArr;
};

const indexToBodypart = (index, length) => {
  return index === 0
    ? "HD"
    : index === 1
    ? "HD2"
    : index === length - 1
    ? "TL2"
    : index === length - 2
    ? "TL"
    : "BY";
};

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE":
      return {
        ...state,
        ...action.payload
      };
    case "FRAME_INC":
      return {
        ...state,
        frameCount: state.frameCount + 1
      };
    case "FRAME_RESET":
      return {
        ...state,
        frameCount: 1
      };
    default:
      return state;
  }
};

let Texture = ({
  x,
  y,
  direction,
  preloadedAnimations,
  dead,
  animationSequence,
  index,
  elementCount,
  sequenceFinished = () => {}
}) => {
  const [state, dispatch] = useReducer(reducer, {
    x,
    y,
    active: true,
    animationSpecs: getWormAnimationSpecs({
      bodypart: indexToBodypart(index, elementCount),
      direction,
      animations: preloadedAnimations,
      animationSequence
    }),
    selectedAnimation: getWormAnimationSpecs({
      bodypart: indexToBodypart(index, elementCount),
      direction,
      animations: preloadedAnimations,
      animationSequence
    })[0],
    frameCount: 0
  });

  useEffect(() => {
    if (state.frameCount === config.wormSequences[animationSequence]) {
      // increment, to make sure this will not trigger multiple times while waiting
      // for animationSequence to update (which will trigger a FRAME_RESET)
      if (index === 0) {
        dispatch({ type: "FRAME_INC" });
        sequenceFinished(index);
      }
    }
  }, [index, animationSequence, sequenceFinished, state.frameCount]);

  useEffect(() => {
    dispatch({ type: "FRAME_RESET" });
  }, [animationSequence]);

  // when sequence and/or direction changes
  useEffect(() => {
    let animationSpecs = getWormAnimationSpecs({
      bodypart: indexToBodypart(index, elementCount),
      direction,
      animations: preloadedAnimations,
      animationSequence
    });
    let selectedAnimation = animationSpecs[0];
    selectedAnimation.animation.gotoAndPlay(selectedAnimation.startIndex);
    selectedAnimation.animation.onFrameChange = () =>
      dispatch({ type: "FRAME_INC" });
    dispatch({
      type: "UPDATE",
      payload: {
        active: true,
        x,
        y,
        animationSpecs,
        selectedAnimation
      }
    });
    // cleanup
    return () =>
      (selectedAnimation.animation.onFrameChange = dispatch({
        type: "FRAME_INC"
      }));
  }, [
    animationSequence,
    preloadedAnimations,
    x,
    y,
    index,
    elementCount,
    direction
  ]);

  // stop animation when dead
  useEffect(() => {
    if (dead === true && animationSequence === 0) {
      state.selectedAnimation.animation.stop();
    }
  }, [dead, state.selectedAnimation, animationSequence]);

  // on every new animation frame
  useEffect(() => {
    // last frame
    if (
      state.selectedAnimation &&
      state.selectedAnimation.animation.currentFrame + 1 ===
        state.selectedAnimation.animation.totalFrames
    ) {
      if (state.selectedAnimation.removeAtFinish === true) {
        dispatch({
          type: "UPDATE",
          payload: {
            active: false
          }
        });
      }
    }
  }, [state.selectedAnimation, index]);

  return state.selectedAnimation && state.active === true ? (
    <AnimatedSprite
      x={state.x}
      y={state.y}
      animation={state.selectedAnimation.animation}
    />
  ) : null;
};

Texture.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  direction: PropTypes.shape({
    from: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired
  }),
  preloadedAnimations: PropTypes.object.isRequired,
  dead: PropTypes.bool.isRequired,
  animationSequence: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  elementCount: PropTypes.number.isRequired,
  sequenceFinished: PropTypes.func.isRequired
};

export default Texture;
