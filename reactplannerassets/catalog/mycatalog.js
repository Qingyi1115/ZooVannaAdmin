import { Catalog } from "../../reactplanner-src/index";
let catalog = new Catalog();

import Wall from "./lines/wall/planner-element.jsx";
catalog.registerElement(Wall);
import WaterOutline from "./lines/waterOutline/planner-element.jsx";
catalog.registerElement(WaterOutline);

import Gate from "./holes/gate/planner-element";
catalog.registerElement(Gate);
import DoorDouble from "./holes/door-double/planner-element";
catalog.registerElement(DoorDouble);

// Import Items!
import SmallTree from "./items/smallTree/planner-element";
catalog.registerElement(SmallTree);
import BigTree from "./items/bigTree/planner-element";
catalog.registerElement(BigTree);
import WoodenLog from "./items/woodenLog/planner-element";
catalog.registerElement(WoodenLog);
import SmallBoulder from "./items/smallBoulder/planner-element";
catalog.registerElement(SmallBoulder);
import BigBoulder from "./items/bigBoulder/planner-element";
catalog.registerElement(BigBoulder);
// import Cube from "./items/cube/planner-element";
// catalog.registerElement(Cube);
//

// import * as Lines from "./lines/wall/planner-element.jsx";
// for (let x in Lines) catalog.registerElement(Lines[x]);

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
