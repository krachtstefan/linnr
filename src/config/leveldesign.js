import spritesheetJSON from "public/images/spritesheet.json"; // requires NODE_PATH=.to work

const randomizerMinMax = (min, max) =>
  Math.round(Math.random() * (max - min) + min);

const halfTileOffset = () => {
  const ZeroToHalf = randomizerMinMax(0, 5) / 10;
  return Math.random() < 0.5 ? -ZeroToHalf : ZeroToHalf;
};

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
      obstacle: true,
      atmo: true
    }
  }
];

const objects = {
  availableAnimations: Object.keys(spritesheetJSON.animations)
    .filter(key => key.startsWith("SPRITES") === true)
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
        { src: "SPRITES.1x1-FOOD/Beere/001A/SPAWN/F" },
        { src: "SPRITES.1x1-FOOD/Beere/001B/SPAWN/F" },
        { src: "SPRITES.1x1-FOOD/Beere/002A/SPAWN/F" },
        { src: "SPRITES.1x1-FOOD/Beere/002B/SPAWN/F" }
      ]
    },
    {
      type: "atmo",
      randomizer: () => randomizerMinMax(10, 20),
      pattern: [[true]],
      items: [
        {
          src: "SPRITES.1x1-ATMO/Gras/1x1/001A/0_1.png",
          offset: {
            x: halfTileOffset(),
            y: halfTileOffset()
          }
        },
        {
          src: "SPRITES.1x1-ATMO/Gras/1x1/001B/0_1.png",
          offset: {
            x: halfTileOffset(),
            y: halfTileOffset()
          }
        },
        {
          src: "SPRITES.1x1-ATMO/Gras/1x1/002A/0_1.png",
          offset: {
            x: halfTileOffset(),
            y: halfTileOffset()
          }
        },
        {
          src: "SPRITES.1x1-ATMO/Gras/1x1/002B/0_1.png",
          offset: {
            x: halfTileOffset(),
            y: halfTileOffset()
          }
        },
        {
          src: "SPRITES.1x1-ATMO/Gras/1x1/003A/0_1.png",
          offset: {
            x: halfTileOffset(),
            y: halfTileOffset()
          }
        },
        {
          src: "SPRITES.1x1-ATMO/Gras/1x1/003B/0_1.png",
          offset: {
            x: halfTileOffset(),
            y: halfTileOffset()
          }
        }
      ]
    },
    /**
     * 1 X 1
     */
    {
      type: "obstacle",
      randomizer: () => randomizerMinMax(10, 15),
      pattern: [[true]],
      items: [
        { src: "SPRITES.1x1-OBS/Findling/1x1/006A/X_1.png" },
        { src: "SPRITES.1x1-OBS/Findling/1x1/006B/X_1.png" },
        { src: "SPRITES.1x1-OBS/Findling/1x1/007A/X_1.png" },
        { src: "SPRITES.1x1-OBS/Findling/1x1/007B/X_1.png" }
      ]
    },
    /**
     * 2 X 2
     * unused:
     * SPRITES.2x2-OBS/Findling/2x2/001B/0X:X0_1.png
     * SPRITES.2x2-OBS/Findling/2x2/002B/XX:0X_1.png
     * SPRITES.2x2-OBS/Findling/2x2/003A/X0:XX_1.png
     * SPRITES.2x2-OBS/Findling/2x2/003B/0X:XX_1.png
     */
    {
      type: "obstacle",
      randomizer: () => randomizerMinMax(0, 1),
      pattern: [
        [true, false],
        [false, true]
      ],
      items: [{ src: "SPRITES.2x2-OBS/Findling/2x2/001A/X0:0X_1.png" }]
    },
    {
      type: "obstacle",
      randomizer: () => randomizerMinMax(0, 1),
      pattern: [
        [true, true],
        [false, true]
      ],
      items: [{ src: "SPRITES.2x2-OBS/Findling/2x2/002A/XX:0X_1.png" }]
    },
    /**
     * 1 X 2
     */
    {
      type: "obstacle",
      randomizer: () => randomizerMinMax(0, 1),
      pattern: [[true, true]],
      items: [
        { src: "SPRITES.1x2-OBS/Findling/1x2/004A/XX_1.png" },
        { src: "SPRITES.1x2-OBS/Findling/1x2/004B/XX_1.png" },
        { src: "SPRITES.1x2-OBS/Findling/1x2/005A/XX_1.png" },
        { src: "SPRITES.1x2-OBS/Findling/1x2/005B/XX_1.png" }
      ]
    },
    /**
     * 2 X 1
     */
    {
      type: "obstacle",
      randomizer: () => randomizerMinMax(2, 5),
      pattern: [[true]],
      items: [
        { src: "SPRITES.2x1-OBS/Weide/2x1/01B/C:1_1.png", offset: { y: -1 } },
        { src: "SPRITES.2x1-OBS/Weide/2x1/02A/C:1_1.png", offset: { y: -1 } },
        { src: "SPRITES.2x1-OBS/Weide/2x1/02B/C:1_1.png", offset: { y: -1 } },
        { src: "SPRITES.2x1-OBS/Weide/2x1/03A/C:1_1.png", offset: { y: -1 } },
        { src: "SPRITES.2x1-OBS/Weide/2x1/03B/C:1_1.png", offset: { y: -1 } },
        { src: "SPRITES.2x1-OBS/Weide/2x1/04A/C:1_1.png", offset: { y: -1 } },
        { src: "SPRITES.2x1-OBS/Weide/2x1/04B/C:1_1.png", offset: { y: -1 } },
        { src: "SPRITES.2x1-OBS/Weide/2x1/05A/C:1_1.png", offset: { y: -1 } },
        { src: "SPRITES.2x1-OBS/Weide/2x1/05B/C:1_1.png", offset: { y: -1 } }
      ]
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
