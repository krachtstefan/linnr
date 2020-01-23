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
    x: 0,
    y: 0,
    highscore: 0
  });

  useEffect(() => {
    const { x, y } = worm.destination[0];
    if (worm.food > 0 && plusOneState.highscore !== worm.food) {
      setPlusOneState({
        x: x * config.tileSize,
        y: y * config.tileSize,
        highscore: worm.food
      });
    }
  }, [
    worm.food,
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
          options={{ backgroundColor: config.background }}
          width={width}
          height={height}
          className={props.className}
        >
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
              const x = obstacle.positions[0].x;
              const y = obstacle.positions[0].y;
              return (
                <Sprite
                  key={`obstacle_${x}_${y}`}
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
