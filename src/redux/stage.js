import { isEqual, sample, sampleSize, shuffle } from "lodash";

import { config } from "../config";

const DEFAULT_STAGE_STATE = {
  assets: {
    spritesheet: null,
    canvasBg: null
  },
  tileSize: config.tileSize,
  // prettier-ignore
  board: [
    ["x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x"],
    ["x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x"],
    ["x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x"],
    ["x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x"],
    ["x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x"],
    ["x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x"],
    ["x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x"],
    ["x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x"],
    ["x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x"],
    ["x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x"],
    ["x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x"],
    ["x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x"],
    ["x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x"]
  ],
  objects: {}
};

// takes two arrays of positions and returns true, when they overlap
let matrixOverlap = (posArr1, posArr2) =>
  posArr1.some(pos1 => posArr2.some(pos2 => isEqual(pos2, pos1)));

/**
 * takes a board matrix, searches for a placeholders (arr)
 * and returns all possible positions for a shape
 */
let findInBoard = ({ board, arr, pattern }) => {
  let [patternWith, patternHeight] = [pattern[0].length, pattern.length];
  let [boardWidth, boardHeight] = [board[0].length, board.length];
  let result = board.reduce((prev, line, y) => {
    return [
      ...prev,
      ...line
        .map((cell, i) => (arr.includes(cell) ? i : null)) // all lines with the pattern
        .filter(x => x !== null)
        .filter(x => {
          return (
            x <= boardWidth - patternWith && y <= boardHeight - patternHeight
          );
        }) // remove coordinates that would make it leave the board
        .map(x => {
          // x and y are the upper left position
          let result = [];
          pattern.forEach((row, yIndex) => {
            row.forEach((cell, xIndex) => {
              if (cell === true) {
                result.push({
                  x: x + xIndex,
                  y: y + yIndex
                });
              }
            });
          });
          return result;
        })
    ];
  }, []);

  // remove double (shuffle to make very big items not always spawn on the upper left)
  return shuffle(result).reduce(
    (acc, coordinates) =>
      acc.some(coord => matrixOverlap(coord, coordinates))
        ? acc
        : [...acc, coordinates],
    []
  );
};

export const STAGE_ACTION_TYPES = {
  SET_ASSET: "SET_ASSET",
  PLACE_OBJECT: "PLACE_OBJECT"
};

export const setAsset = asset => {
  return dispatch => {
    dispatch({
      type: STAGE_ACTION_TYPES.SET_ASSET,
      payload: asset
    });
  };
};

export const placeItems = (type, keepExisting = false) => {
  return (dispatch, state) => {
    let { worm, stage } = state();
    let itemAliases = config.leveldesign.templates
      .filter(spec => spec.spawns[type] === true)
      .map(x => x.label);

    let newItems = [];

    config.leveldesign.objects.types
      .filter(spec => spec.type === type)
      .forEach(objType => {
        let { items: itemVariations, randomizer, pattern } = objType;

        // possibleItemPositions
        let possibleItemPositions = findInBoard({
          board: stage.board,
          arr: itemAliases,
          pattern
        });

        // don't use worm tiles
        possibleItemPositions = possibleItemPositions.filter(
          posArray =>
            !matrixOverlap(posArray, [...worm.position, worm.destination[0]])
        );

        // avoid conflicts with items of any type
        config.leveldesign.objects.types.forEach(objectConf => {
          if (stage.objects[objectConf.type]) {
            stage.objects[objectConf.type].forEach(objOnStage => {
              possibleItemPositions = possibleItemPositions.filter(
                posArray => !matrixOverlap(posArray, objOnStage.positions)
              );
            });
          }
        });

        // avoid conflicts with objects from the previous loop
        newItems.forEach(objOnStage => {
          possibleItemPositions = possibleItemPositions.filter(
            posArray => !matrixOverlap(posArray, objOnStage.positions)
          );
        });

        let oldItemsWithoutTheConsumed =
          keepExisting === true && stage.objects[type]
            ? stage.objects[type].filter(
                oldItems => !matrixOverlap(oldItems.positions, worm.destination)
              )
            : [];

        let newItemsCount = randomizer() - oldItemsWithoutTheConsumed.length;
        newItems = [
          ...newItems,
          ...oldItemsWithoutTheConsumed,
          ...sampleSize(
            possibleItemPositions.map(coordinates => ({
              positions: coordinates,
              item: sample(itemVariations)
            })),
            newItemsCount > 0 ? newItemsCount : 0
          )
        ];
      });

    dispatch({
      type: STAGE_ACTION_TYPES.PLACE_OBJECT,
      payload: {
        stateRef: type,
        objects: newItems
      }
    });
  };
};

export const stageReducer = (state = DEFAULT_STAGE_STATE, action) => {
  switch (action.type) {
    case STAGE_ACTION_TYPES.PLACE_OBJECT:
      return {
        ...state,
        objects: {
          ...state.objects,
          [action.payload.stateRef]: action.payload.objects
        }
      };
    case STAGE_ACTION_TYPES.SET_ASSET:
      return {
        ...state,
        assets: {
          ...state.assets,
          ...action.payload
        }
      };
    default:
      return state;
  }
};
