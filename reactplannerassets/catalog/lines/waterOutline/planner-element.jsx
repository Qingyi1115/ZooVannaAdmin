import { ElementsFactories } from "../../../../reactplanner-src/index";

// import wallImage from "./wall.png";
import waterOutlineImage from "./waterOutline.jpg";
import bricksTexture from "./textures/bricks.jpg";
import bricksNormal from "./textures/bricks-normal.jpg";
import paintedTexture from "./textures/painted.jpg";
import paintedNormal from "./textures/painted-normal.jpg";

const info = {
  title: "waterOutline",
  tag: ["waterOutline"],
  description: "Outline to mark out water areas",
  image: waterOutlineImage,
  visibility: {
    catalog: true,
    layerElementsVisible: true,
  },
};

const textures = {
  bricks: {
    name: "Bricks",
    uri: bricksTexture,
    lengthRepeatScale: 0.01,
    heightRepeatScale: 0.01,
    normal: {
      uri: bricksNormal,
      lengthRepeatScale: 0.01,
      heightRepeatScale: 0.01,
      normalScaleX: 0.8,
      normalScaleY: 0.8,
    },
  },
  painted: {
    name: "Painted",
    uri: paintedTexture,
    lengthRepeatScale: 0.01,
    heightRepeatScale: 0.01,
    normal: {
      uri: paintedNormal,
      lengthRepeatScale: 0.01,
      heightRepeatScale: 0.01,
      normalScaleX: 0.4,
      normalScaleY: 0.4,
    },
  },
};

export default ElementsFactories.WallFactory("waterOutline", info, textures);
