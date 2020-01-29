import React, { useEffect, useState } from "react";
import { Sprite, Stage } from "@inlet/react-pixi";

import Food from "./Food";
import PlusOne from "./PlusOne";
import { ReactReduxContext } from "react-redux";
import { Texture } from "pixi.js";
import { config } from "../config";
import { useSelector } from "react-redux";

// ContextBridge is required to make redux connect work in the child components of
// stage. See https://github.com/inlet/react-pixi/issues/77
const ContextBridge = ({ render, Context, children }) => (
  <Context.Consumer>
    {value =>
      render(<Context.Provider value={value}>{children}</Context.Provider>)
    }
  </Context.Consumer>
);

let Gamestage = props => {
  let {
    width,
    height,
    tileSize,
    spritesheet,
    canvasBg,
    objects,
    worm
  } = useSelector(state => ({
    width: state.stage.board[0].length * state.stage.tileSize,
    height: state.stage.board.length * state.stage.tileSize,
    tileSize: state.stage.tileSize,
    spritesheet: state.stage.assets.spritesheet,
    canvasBg: state.stage.assets.canvasBg,
    objects: state.stage.objects,
    worm: state.worm
  }));

  let [plusOneState, setPlusOneState] = useState({
    x: -100,
    y: -100,
    highscore: 0
  });

  useEffect(() => {
    const { x, y } = worm.destination[0];
    if (worm.highscore > 0 && plusOneState.highscore !== worm.highscore) {
      setPlusOneState({
        x: x * config.tileSize,
        y: y * config.tileSize,
        highscore: worm.highscore
      });
    }
  }, [
    worm.highscore,
    worm.destination,
    plusOneState.x,
    plusOneState.y,
    plusOneState.highscore
  ]);

  return (
    <ContextBridge
      Context={ReactReduxContext}
      render={children => (
        <Stage
          options={{ transparent: true }}
          width={width}
          height={height}
          className={props.className}
        >
          {objects.atmo &&
            objects.atmo.map(atmo => {
              let texture = spritesheet.textures[atmo.item.src];
              texture = texture ? texture : Texture.EMPTY;
              let { x: xOffset, y: yOffset } = atmo.item.offset
                ? atmo.item.offset
                : {};
              const x = atmo.positions[0].x + (xOffset ? xOffset : 0);
              const y = atmo.positions[0].y + (yOffset ? yOffset : 0);
              return (
                <Sprite
                  key={`atmo_${atmo.positions[0].x}_${atmo.positions[0].y}`}
                  x={x * tileSize}
                  y={y * tileSize}
                  width={texture.width * config.spriteSizeScaling}
                  height={texture.height * config.spriteSizeScaling}
                  texture={texture}
                />
              );
            })}
          {children}
          <PlusOne
            x={plusOneState.x}
            y={plusOneState.y}
            spritesheet={spritesheet}
          />
          {objects.food &&
            objects.food.map(foodItem => {
              const x = foodItem.positions[0].x;
              const y = foodItem.positions[0].y;
              const animation =
                config.leveldesign.objects.availableAnimations[
                  foodItem.item.src
                ];
              return (
                <Food
                  key={`food_${x}_${y}`}
                  x={x * tileSize}
                  y={y * tileSize}
                  spritesheet={spritesheet}
                  animation={animation}
                />
              );
            })}

          {/* TODO: create obstacle component, make multi tile component and animation possible */}
          {objects.obstacle &&
            objects.obstacle.map(obstacle => {
              let texture = spritesheet.textures[obstacle.item.src];
              texture = texture ? texture : Texture.EMPTY;
              let { x: xOffset, y: yOffset } = obstacle.item.offset
                ? obstacle.item.offset
                : {};
              const x = obstacle.positions[0].x + (xOffset ? xOffset : 0);
              const y = obstacle.positions[0].y + (yOffset ? yOffset : 0);
              return (
                <Sprite
                  key={`obstacle_${obstacle.positions[0].x}_${obstacle.positions[0].y}`}
                  x={x * tileSize}
                  y={y * tileSize}
                  width={texture.width * config.spriteSizeScaling}
                  height={texture.height * config.spriteSizeScaling}
                  texture={texture}
                />
              );
            })}
          <Sprite image={canvasBg.url} width={width} height={height} />
        </Stage>
      )}
    >
      {props.children}
    </ContextBridge>
  );
};

export default Gamestage;
