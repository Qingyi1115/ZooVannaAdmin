import { Catalog } from "../../reactplanner-src/index";
let catalog = new Catalog();

import * as Areas from "./areas/area/planner-element";
for (let x in Areas) catalog.registerElement(Areas[x]);

// import Wall from "./lines/wall/planner-element.jsx";
// catalog.registerElement(Wall);
// import WaterOutline from "./lines/waterOutline/planner-element.jsx";
// catalog.registerElement(WaterOutline);

// import Door from "./holes/door/planner-element.jsx";
// import Gate from "./holes/gate/planner-element.jsx";
// import DoorDouble from "./holes/door-double/planner-element.jsx";
// import PanicDoor from "./holes/panic-door/planner-element.jsx";
// import PanicDoorDouble from "./holes/panic-door-double/planner-element.jsx";
// import SlidingDoor from "./holes/sliding-door/planner-element.jsx";
// import Window from "./holes/window/planner-element.jsx";
// import SashWindow from "./holes/sash-window/planner-element.jsx";
// import VenetianBlindWindow from "./holes/venetian-blind-window/planner-element.jsx";
// import WindowCurtain from "./holes/window-curtain/planner-element.jsx";
// import Image from "./items/image/planner-element.jsx";

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
import EnclosureBarrier from "./lines/enclosureBarrier/planner-element.jsx";
catalog.registerElement(EnclosureBarrier);

// for (let x in Lines) catalog.registerElement(Lines[x]);
// for (let x in Holes) catalog.registerElement(Holes[x]);
// for (let x in Items) catalog.registerElement(Items[x]);
// catalog.registerElement(Door);
// catalog.registerElement(Gate);
// catalog.registerElement(DoorDouble);
// catalog.registerElement(PanicDoor);
// catalog.registerElement(PanicDoorDouble);
// catalog.registerElement(SlidingDoor);
// catalog.registerElement(Window);
// catalog.registerElement(SashWindow);
// catalog.registerElement(VenetianBlindWindow);
// catalog.registerElement(WindowCurtain);
// catalog.registerElement(Image);

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
