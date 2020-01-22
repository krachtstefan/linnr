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
  obstacles: [],
  food: [],
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
        stateRef: "food",
        type: "food",
        randomizer: () => randomizerMinMax(3, 10),
        pattern: [true],
        items: [
          { src: "OBJECTS.HITBOX-FOOD/Himbeere/001/SPAWN" },
          { src: "OBJECTS.HITBOX-FOOD/Brombeere/001/SPAWN" }
        ]
      },
      {
        stateRef: "obstacles",
        type: "obstacle",
        randomizer: () => randomizerMinMax(10, 20),
        pattern: [true],
        items: [{ src: "OBJECTS.HITBOX-OBS/Findling/001_1.png" }]
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

let findInBoard = ({ board, arr, pattern }) =>
  board.reduce((prev, line, y) => {
    return [
      ...prev,
      ...line
        .map((cell, i) => (arr.includes(cell) ? i : null))
        .filter(Number)
        .map(x => {
          return [
            // todo: this array is statc for now, create it with pattern analysing
            {
              x,
              y
            }
          ];
        })
    ];
  }, []);

// takes two arrays of positions and returns true, when they overlap
let matrixOverlap = (posArr1, posArr2) =>
  posArr1.some(pos1 => posArr2.some(pos2 => isEqual(pos2, pos1)));

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
      stateRef,
      pattern
    } = stage.levelDesign.objectTypes.find(spec => spec.type === type);

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
      stage[objectConf.stateRef].forEach(objOnStage => {
        possibleItemPositions = possibleItemPositions.filter(
          posArray => !matrixOverlap(posArray, objOnStage.positions)
        );
      });
    });

    let oldItemsWithoutTheConsumed =
      keepExisting === true
        ? stage[stateRef].filter(
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
        stateRef,
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
        [action.payload.stateRef]: action.payload.objects
      };
    case STAGE_ACTION_TYPES.PLACE_OBSTACLES:
      return {
        ...state,
        obstacles: action.payload
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
