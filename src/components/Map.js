import { Sprite, Stage } from "@inlet/react-pixi";

import React from "react";
import { ReactReduxContext } from "react-redux";
import { Texture } from "pixi.js";
import config from "../config";
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
    board,
    spritesheet,
    canvasBg,
    deathscreen,
    dead,
    spriteSpecs
  } = useSelector(state => ({
    width: state.stage.board[0].length * state.stage.tileSize,
    height: state.stage.board.length * state.stage.tileSize,
    board: state.stage.board,
    tileSize: state.stage.tileSize,
    spritesheet: state.stage.assets.spritesheet,
    canvasBg: state.stage.assets.canvasBg,
    deathscreen: state.stage.assets.deathscreen,
    dead: state.worm.dead,
    spriteSpecs: state.stage.spriteSpecs
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
          <Sprite image={canvasBg.url} width={width} height={height} />
          {children}
          {board.map((line, lineNumber) => {
            return line.map((tile, rowNumber) => {
              let texture = spritesheet.textures[spriteSpecs[tile].image];
              texture = texture ? texture : Texture.EMPTY;
              return (
                <Sprite
                  key={`${lineNumber}_${rowNumber}`}
                  width={tileSize}
                  height={tileSize}
                  x={rowNumber * tileSize}
                  y={lineNumber * tileSize}
                  texture={texture}
                />
              );
            });
          })}
          {dead === true ? (
            <Sprite
              image={deathscreen.url}
              x={(width - deathscreen.texture.orig.width) / 2}
              y={(height - deathscreen.texture.orig.height) / 2}
            />
          ) : null}
        </Stage>
      )}
    >
      {props.children}
    </ContextBridge>
  );
};

export default Gamestage;
