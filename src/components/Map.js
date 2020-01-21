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
    food,
    obstacles,
    foodAnimations
  } = useSelector(state => ({
    width: state.stage.board[0].length * state.stage.tileSize,
    height: state.stage.board.length * state.stage.tileSize,
    tileSize: state.stage.tileSize,
    spritesheet: state.stage.assets.spritesheet,
    canvasBg: state.stage.assets.canvasBg,
    food: state.stage.food,
    obstacles: state.stage.obstacles,
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
          {food.map(foodItem => {
            return (
              <Food
                key={`food_${foodItem.x}_${foodItem.y}`}
                x={foodItem.x * tileSize}
                y={foodItem.y * tileSize}
                spritesheet={spritesheet}
                animation={foodAnimations[foodItem.item.src]}
              />
            );
          })}

          {/* TODO: create obstacle component, make multi tile component and animation possible */}
          {obstacles.map(obstacle => {
            let texture = spritesheet.textures[obstacle.item.src];
            texture = texture ? texture : Texture.EMPTY;
            return (
              <Sprite
                key={`obstacle_${obstacle.x}_${obstacle.y}`}
                width={tileSize}
                height={tileSize}
                x={obstacle.x * tileSize}
                y={obstacle.y * tileSize}
                texture={texture}
              />
            );
          })}

          {children}
          <Sprite image={canvasBg.url} width={width} height={height} />
        </Stage>
      )}
    >
      {props.children}
    </ContextBridge>
  );
};

export default Gamestage;
