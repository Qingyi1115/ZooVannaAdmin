import { Catalog } from "../../reactplanner-src/index";
let catalog = new Catalog();

// Import Items!
import WoodenLog from "./items/woodenLog/planner-element";
catalog.registerElement(WoodenLog);
import Cube from "./items/cube/planner-element";
catalog.registerElement(Cube);
//

// import * as Lines from "./lines/wall/planner-element.jsx";
// for (let x in Lines) catalog.registerElement(Lines[x]);

import Wall from "./lines/wall/planner-element.jsx";
catalog.registerElement(Wall);
import WaterOutline from "./lines/waterOutline/planner-element.jsx";
catalog.registerElement(WaterOutline);

import * as Areas from "./areas/area/planner-element";
for (let x in Areas) catalog.registerElement(Areas[x]);

// for (let x in Lines) catalog.registerElement(Lines[x]);
// for (let x in Holes) catalog.registerElement(Holes[x]);
// for (let x in Items) catalog.registerElement(Items[x]);

// catalog.registerCategory("windows", "Windows", [
//   Holes.window,
//   Holes.sashWindow,
//   Holes.venetianBlindWindow,
//   Holes.windowCurtain,
// ]);
// catalog.registerCategory("doors", "Doors", [
//   Holes.door,
//   Holes.doorDouble,
//   Holes.panicDoor,
//   Holes.panicDoorDouble,
//   Holes.slidingDoor,
// ]);

export default catalog;
