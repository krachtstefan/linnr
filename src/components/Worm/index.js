import { Container, withFilters } from "@inlet/react-pixi";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AdjustmentFilter } from "@pixi/filter-adjustment";
import Bone from "./Bone";
import { GlitchFilter } from "@pixi/filter-glitch";
import { PixelateFilter } from "@pixi/filter-pixelate";
import PropTypes from "prop-types";
import { initiateNextMove } from "../../redux/worm";
import { useTick } from "@inlet/react-pixi";

const AnimatedFilter = ({ children, ...props }) => {
  let maxValue = 2;
  let valueVelosity = 0.1;

  let minAlpha = 0;
  let alphaVelosity = 0.055555556;

  let [value, setValue] = useState(1);
  let [alpha, setAlpha] = useState(1);

  useTick(delta => {
    if (value < maxValue) {
      let newValue = value + delta * valueVelosity;
      setValue(newValue > maxValue ? maxValue : newValue);
    }
    if (alpha > minAlpha) {
      let newAlpha = alpha - delta * alphaVelosity;
      setAlpha(newAlpha < minAlpha ? minAlpha : newAlpha);
    }
  });

  return (
    <Filter
      {...props}
      offset={2}
      sampleSize={500}
      slices={500}
      direction={45}
      average={true}
      alpha={alpha}
    >
      {children}
    </Filter>
  );
};
const Filter = withFilters(Container, GlitchFilter);

const ConditionalWrapper = ({ condition, wrapper, children }) =>
  condition === true ? wrapper(children) : children;

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
      <ConditionalWrapper
        condition={dead === true}
        wrapper={children => {
          return <AnimatedFilter>{children}</AnimatedFilter>;
        }}
      >
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
      </ConditionalWrapper>
    </React.Fragment>
  );
};

Worm.propTypes = {
  preloadedAnimations: PropTypes.array.isRequired
};

export default Worm;
