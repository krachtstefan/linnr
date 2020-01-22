import { isEqual, sample, sampleSize } from "lodash";

import { config } from "../config";
import spritesheetJSON from "public/images/spritesheet.json"; // requires NODE_PATH=.to work

export const randomizerMinMax = (min, max) =>
  Math.round(Math.random() * (max - min) + min);

const DEFAULT_STAGE_STATE = {
  assets: {
    spritesheet: null,
    canvasBg: null
  },
  tileSize: config.tileSize,
  // prettier-ignore
  board: [
    ["w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w"],
    ["w", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "w"],
    ["w", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "w"],
    ["w", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "w"],
    ["w", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "w"],
    ["w", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "w"],
    ["w", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "w"],
    ["w", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "w"],
    ["w", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "w"],
    ["w", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "w"],
    ["w", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "w"],
    ["w", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "w"],
    ["w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w"]
  ],
  objects: {},
  foodAnimations: Object.keys(spritesheetJSON.animations)
    .filter(key => key.startsWith("OBJECTS.HITBOX-FOOD/") === true)
    .reduce((accObj, currAnimationName) => {
      return {
        ...accObj,
        [currAnimationName]: {
          name: currAnimationName,
          ...config.defaultAnimationProps
        }
      };
    }, {}),

  // remove this node from redux and add the components to render inside
  levelDesign: {
    templates: [
      {
        label: "x",
        spawns: {
          food: true,
          obstacle: true
        }
      }
    ],
    objectTypes: [
      {
        type: "food",
        randomizer: () => randomizerMinMax(3, 10),
        pattern: [[true]],
        items: [
          { src: "OBJECTS.HITBOX-FOOD/Himbeere/001/SPAWN" },
          { src: "OBJECTS.HITBOX-FOOD/Brombeere/001/SPAWN" }
        ]
      },
      {
        type: "obstacle",
        randomizer: () => randomizerMinMax(10, 20),
        pattern: [[true]],
        items: [{ src: "OBJECTS.HITBOX-OBS/Findling/001_1.png" }]
      },
      {
        type: "obstacle",
        randomizer: () => randomizerMinMax(1, 3),
        pattern: [
          [true, false],
          [false, true]
        ],
        items: [{ src: "OBJECTS.2x2-OBS/Findling/2X2/003_1.png" }]
      }
    ]
  },
  // todo: remove this!
  spriteAliases: [
    {
      label: "w",
      image: null,
      collisionType: "wall"
    }
  ]
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
        .filter(Number)
        .filter(
          x => x < boardWidth - patternWith && y < boardHeight - patternHeight
        ) // remove coordinates that would make it leave the board
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

  return result.reduce(
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
    let itemAliases = stage.levelDesign.templates
      .filter(spec => spec.spawns[type] === true)
      .map(x => x.label);

    let {
      items: itemVariations,
      randomizer,
      pattern
    } = stage.levelDesign.objectTypes.find(spec => spec.type === type);

    // array

    // possibleItemPositions
    let possibleItemPositions = findInBoard({
      board: stage.board,
      arr: itemAliases,
      pattern
    });

    // don't use worm tiles
    possibleItemPositions = possibleItemPositions.filter(
      posArray => !matrixOverlap(posArray, worm.position)
    );

    // avoid conflicts with items of any type
    stage.levelDesign.objectTypes.forEach(objectConf => {
      if (stage.objects[objectConf.type]) {
        stage.objects[objectConf.type].forEach(objOnStage => {
          possibleItemPositions = possibleItemPositions.filter(
            posArray => !matrixOverlap(posArray, objOnStage.positions)
          );
        });
      }
    });

    let oldItemsWithoutTheConsumed =
      keepExisting === true && stage.objects[type]
        ? stage.objects[type].filter(
            oldItems => !matrixOverlap(oldItems.positions, worm.destination)
          )
        : [];

    let newItemsCount = randomizer() - oldItemsWithoutTheConsumed.length;

    let newItems = sampleSize(
      possibleItemPositions.map(coordinates => ({
        positions: coordinates,
        item: sample(itemVariations)
      })),
      newItemsCount > 0 ? newItemsCount : 0
    );
    dispatch({
      type: STAGE_ACTION_TYPES.PLACE_OBJECT,
      payload: {
        stateRef: type,
        objects: [...oldItemsWithoutTheConsumed, ...newItems]
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
