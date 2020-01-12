import React, { useEffect, useReducer, useState } from "react";

import AnimatedSpritesheet from "./../pixi/AnimatedSprite.js";
import { FILENAME_SEGMENTS } from "../../redux/worm";
import PropTypes from "prop-types";
import config from "../../config";

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
      // if skip after is an Integer (f.e. 3), it will jump to the
      // next animation when the frame number 3 (index 2) is reached
      skipAfter: null,
      removeAtFinish: false,
      ...props
    };
  };

  let animationsArr = [];

  // head
  if (bodypart === "HD") {
    if (animationSequence === 0) {
      // entry
      animationsArr.push(
        returnValidAnimationSpec(
          `WORM-${bodypart}/${FILENAME_SEGMENTS[direction.from]}/Entry`
        )
      );
    } else {
      // move
      animationsArr.push(
        returnValidAnimationSpec(
          `WORM-${bodypart}/${FILENAME_SEGMENTS[direction.from]}/2${
            FILENAME_SEGMENTS[direction.to]
          }`
        )
      );
    }
    // second head
  } else if (bodypart === "HD2") {
    if (animationSequence === 0) {
      // going out
      animationsArr.push(
        returnValidAnimationSpec(
          `WORM-HD/${FILENAME_SEGMENTS[direction.from]}/2${
            FILENAME_SEGMENTS[direction.to]
          }`,
          { startIndex: 4 }
        )
      );
    } else {
      // move
      animationsArr.push(
        returnValidAnimationSpec(
          `WORM-BY/${FILENAME_SEGMENTS[direction.from]}/2${
            FILENAME_SEGMENTS[direction.to]
          }`,
          { startIndex: 8 }
        )
      );
    }

    // very last part ot the worm
  } else if (bodypart === "TL2") {
    animationsArr.push(
      returnValidAnimationSpec(
        `WORM-TL/${FILENAME_SEGMENTS[direction.from]}/2${
          FILENAME_SEGMENTS[direction.to]
        }`,
        { startIndex: animationSequence === 0 ? 12 : 20, removeAtFinish: true }
      )
    );
    // } else if (bodypart === "TL") {
    //   // move
    //   let animation = `WORM-TL/${FILENAME_SEGMENTS[direction.from]}/2${
    //     FILENAME_SEGMENTS[direction.to]
    //   }`;

    //   // if its a corner
    //   if (direction.from !== direction.to) {
    //     // animationsArr.push(returnValidAnimationSpec(animation, { skipAfter: 2 }));
    //     animationsArr.push(returnValidAnimationSpec(animation));

    //     // animationsArr.push(
    //     //   returnValidAnimationSpec(animation, { startIndex: 2 })
    //     // );
    //   } else {
    //     animationsArr.push(returnValidAnimationSpec(animation));
    //   }
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
    frameCount: 1
  });

  useEffect(() => {
    if (state.frameCount === config.wormSequences[animationSequence]) {
      // increment, to make sure this will not trigger multiple times while waiting
      // for the other textures to be finished to finally trigger the reset
      dispatch({ type: "FRAME_INC" });
      sequenceFinished(index);
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
    if (dead === true) {
      state.selectedAnimation.animation.stop();
    }
  }, [dead, state.selectedAnimation]);

  // on every new animation frame
  useEffect(() => {
    let currentAnimationIndex = state.animationSpecs.findIndex(
      animation => animation.name === state.selectedAnimation.name
    );

    let hasNextAnimation =
      state.animationSpecs.length > 1 &&
      currentAnimationIndex !== state.animationSpecs.length - 1;

    // last frame
    if (
      state.selectedAnimation &&
      state.selectedAnimation.animation.currentFrame + 1 ===
        state.selectedAnimation.animation.totalFrames
    ) {
      // if there is another animation in the stack
      if (hasNextAnimation === true && !state.swapAnimationOnNextFrame) {
        console.log("🎉 swapAnimationOnNextFrame 1");
        // when we reach the last position, set a flag for next swap
        dispatch({
          type: "UPDATE",
          payload: {
            swapAnimationOnNextFrame: true
          }
        });
      } else {
        console.log("🎉 removeAtFinish");
        if (state.selectedAnimation.removeAtFinish === true) {
          dispatch({
            type: "UPDATE",
            payload: {
              active: false
            }
          });
        }
      }
      // skip after is reached
    } else if (
      state.selectedAnimation.skipAfter &&
      state.selectedAnimation.skipAfter + 1 ===
        state.selectedAnimation.animation.currentFrame + 1 &&
      hasNextAnimation &&
      !state.swapAnimationOnNextFrame
    ) {
      console.log("🎉 swapAnimationOnNextFrame 2");
      // if there is another animation in the stack, and we reach the last frame
      dispatch({
        type: "UPDATE",
        payload: {
          swapAnimationOnNextFrame: true
        }
      });
    } else if (state.swapAnimationOnNextFrame === true) {
      let selectedAnimation = state.animationSpecs[currentAnimationIndex + 1];
      selectedAnimation.animation.gotoAndPlay(0);
      // may also add a dispatch here
      console.log("🎉 add fix here");
      dispatch({
        type: "UPDATE",
        payload: {
          selectedAnimation,
          swapAnimationOnNextFrame: false
        }
      });
    }
  }, [
    state.selectedAnimation,
    state.selectedAnimation.animation.currentFrame,
    preloadedAnimations,
    direction,
    state.animationSpecs,
    state.swapAnimationOnNextFrame
  ]);

  return state.selectedAnimation && state.active === true ? (
    <AnimatedSpritesheet
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
