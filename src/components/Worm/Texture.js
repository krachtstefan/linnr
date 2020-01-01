import React, { useEffect, useReducer } from "react";

import AnimatedSpritesheet from "./../pixi/AnimatedSprite.js";
import { FILENAME_SEGMENTS } from "../../redux/worm";
import PropTypes from "prop-types";

const getWormAnimationSpecs = ({ bodypart, direction, animations }) => {
  const returnValidAnimationSpec = (animationName, props) => {
    let validAnimationName =
      Object.keys(animations).includes(animationName) === true
        ? animationName
        : "WORM-Fallback";
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
    // entry
    animationsArr.push(
      returnValidAnimationSpec(
        `WORM-${bodypart}/${FILENAME_SEGMENTS[direction.from]}/Entry`
      )
    );
    // move
    animationsArr.push(
      returnValidAnimationSpec(
        `WORM-${bodypart}/${FILENAME_SEGMENTS[direction.from]}/2${
          FILENAME_SEGMENTS[direction.to]
        }`
      )
    );
    // second head
  } else if (bodypart === "HD2") {
    // going out
    animationsArr.push(
      returnValidAnimationSpec(
        `WORM-HD/${FILENAME_SEGMENTS[direction.from]}/2${
          FILENAME_SEGMENTS[direction.to]
        }`,
        { startIndex: 4 }
      )
    );
    // move
    animationsArr.push(
      returnValidAnimationSpec(
        `WORM-BY/${FILENAME_SEGMENTS[direction.from]}/2${
          FILENAME_SEGMENTS[direction.to]
        }`
      )
    );
    // very last part ot the worm
  } else if (bodypart === "TL2") {
    animationsArr.push(
      returnValidAnimationSpec(
        `WORM-TL/${FILENAME_SEGMENTS[direction.from]}/2${
          FILENAME_SEGMENTS[direction.to]
        }`,
        { startIndex: 12, removeAtFinish: true }
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
  return animationsArr;
};

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE":
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
};

let Texture = ({ x, y, direction, preloadedAnimations, dead, bodypart }) => {
  const [state, dispatch] = useReducer(reducer, {
    x,
    y,
    active: true,
    animationSpecs: getWormAnimationSpecs({
      bodypart,
      direction,
      animations: preloadedAnimations
    }),
    selectedAnimation: getWormAnimationSpecs({
      bodypart,
      direction,
      animations: preloadedAnimations
    })[0]
  });

  useEffect(() => {
    let animationSpecs = getWormAnimationSpecs({
      bodypart,
      direction,
      animations: preloadedAnimations
    });
    let selectedAnimation = animationSpecs[0];
    selectedAnimation.animation.gotoAndPlay(selectedAnimation.startIndex);
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
  }, [preloadedAnimations, x, y, bodypart, direction]);

  useEffect(() => {
    if (dead === true) {
      state.selectedAnimation.animation.stop();
    }
  }, [dead, state.selectedAnimation]);

  useEffect(() => {
    if (
      state.selectedAnimation &&
      state.selectedAnimation.animation.currentFrame + 1 ===
        state.selectedAnimation.animation.totalFrames
    ) {
      let currentAnimationIndex = state.animationSpecs.findIndex(
        animation => animation.name === state.selectedAnimation.name
      );
      // if there is another animation in the stack, and we reach the last frame
      if (
        currentAnimationIndex !== state.animationSpecs.length - 1 &&
        !state.swapAnimationOnNextFrame
      ) {
        /**
         * when we reach the last position, set a flag for next swap
         */
        dispatch({
          type: "UPDATE",
          payload: {
            swapAnimationOnNextFrame: true
          }
        });
      } else if (state.swapAnimationOnNextFrame === true) {
        let selectedAnimation = state.animationSpecs[currentAnimationIndex + 1];
        selectedAnimation.animation.gotoAndPlay(0);
        dispatch({
          type: "UPDATE",
          payload: {
            selectedAnimation,
            swapAnimationOnNextFrame: false
          }
        });
      } else {
        if (state.selectedAnimation.removeAtFinish === true) {
          dispatch({
            type: "UPDATE",
            payload: {
              active: false
            }
          });
        }
      }
    }
  }, [
    state.selectedAnimation,
    state.selectedAnimation.animation.currentFrame,
    preloadedAnimations,
    direction,
    state.animationSpecs,
    state.swapAnimationOnNextFrame,
    bodypart
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
  bodypart: PropTypes.string.isRequired,
  dead: PropTypes.bool.isRequired
};

export default Texture;
