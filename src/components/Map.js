import { Sprite, Stage } from "@inlet/react-pixi";

import Food from "./Food";
import React from "react";
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
    foodAnimations
  } = useSelector(state => ({
    width: state.stage.board[0].length * state.stage.tileSize,
    height: state.stage.board.length * state.stage.tileSize,
    tileSize: state.stage.tileSize,
    spritesheet: state.stage.assets.spritesheet,
    canvasBg: state.stage.assets.canvasBg,
    objects: state.stage.objects,
    foodAnimations: state.stage.foodAnimations
  }));
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
          {objects.food &&
            objects.food.map(foodItem => {
              const x = foodItem.positions[0].x;
              const y = foodItem.positions[0].y;
              return (
                <Food
                  key={`food_${x}_${y}`}
                  x={x * tileSize}
                  y={y * tileSize}
                  spritesheet={spritesheet}
                  animation={foodAnimations[foodItem.item.src]}
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
