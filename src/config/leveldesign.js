import spritesheetJSON from "public/images/spritesheet.json"; // requires NODE_PATH=.to work

const randomizerMinMax = (min, max) =>
  Math.round(Math.random() * (max - min) + min);

const defaultAnimationProps = {
  offset: {
    x: 0,
    y: 0
  },
  space: {
    width: 1,
    height: 1
  }
};

const templates = [
  {
    label: "x",
    spawns: {
      food: true,
      obstacle: true
    }
  }
];

const objects = {
  availableAnimations: Object.keys(spritesheetJSON.animations)
    .filter(key => key.startsWith("OBJECTS") === true)
    .reduce((accObj, currAnimationName) => {
      return {
        ...accObj,
        [currAnimationName]: {
          name: currAnimationName,
          ...defaultAnimationProps
        }
      };
    }, {}),
  types: [
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
      randomizer: () => randomizerMinMax(10, 15),
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
};

const worm = {
  animations: Object.keys(spritesheetJSON.animations)
    .filter(key => key.startsWith("WORM-") === true)
    .reduce((accObj, currAnimationName) => {
      return {
        ...accObj,
        [currAnimationName]: {
          name: currAnimationName,
          ...defaultAnimationProps
        }
      };
    }, {})
};

export default { templates, objects, worm };
