import { ElementsFactories } from "../../../../reactplanner-src/index";

let info = {
  title: "area",
  tag: ["area"],
  description: "Generic Room",
  image: "",
};

import landTexture from "./textures/landTexture.jpg";
import waterTexture from "./textures/waterTexture.jpg";

let textures = {
  parquet: {
    name: "Water",
    uri: waterTexture,
    lengthRepeatScale: 0.01,
    heightRepeatScale: 0.01,
  },
  grass: {
    name: "Land",
    uri: landTexture,
    lengthRepeatScale: 0.01,
    heightRepeatScale: 0.01,
  },
};
// let textures = {};

// Promise.all([
//   import("./textures/parquet.jpg").then((uri) => {
//     textures.parquet = {
//       name: "Parquet",
//       uri: uri.default,
//       lengthRepeatScale: 0.004,
//       heightRepeatScale: 0.004,
//     };
//   }),
//   import("./textures/tile1.jpg").then((uri) => {
//     textures.tile1 = {
//       name: "Tile1",
//       uri: uri.default,
//       lengthRepeatScale: 0.01,
//       heightRepeatScale: 0.01,
//     };
//   }),
//   import("./textures/ceramic-tile.jpg").then((uri) => {
//     textures.ceramic = {
//       name: "Ceramic Tile",
//       uri: uri.default,
//       lengthRepeatScale: 0.02,
//       heightRepeatScale: 0.02,
//     };
//   }),
//   import("./textures/strand-porcelain.jpg").then((uri) => {
//     textures.strand_porcelain = {
//       name: "Strand Porcelain Tile",
//       uri: uri.default,
//       lengthRepeatScale: 0.02,
//       heightRepeatScale: 0.02,
//     };
//   }),
//   import("./textures/grass.jpg").then((uri) => {
//     textures.grass = {
//       name: "Grass",
//       uri: uri.default,
//       lengthRepeatScale: 0.01,
//       heightRepeatScale: 0.01,
//     };
//   }),
// ])
//   .then(() => {
//     // All textures have been loaded
//     console.log("All textures loaded:", textures);
//   })
//   .catch((error) => {
//     console.error("Error loading textures:", error);
//   });

export default ElementsFactories.AreaFactory("area", info, textures);
