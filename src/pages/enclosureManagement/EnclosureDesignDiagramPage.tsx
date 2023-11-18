import React, { useState, useEffect, useRef } from "react";
import useApiJson from "../../hooks/useApiJson";
import { useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { NavLink, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import Enclosure from "../../models/Enclosure";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useEnclosureContext } from "../../hooks/useEnclosureContext";

// react planner stuff
import { createRoot } from "react-dom/client";
import { SizeMe } from "react-sizeme";
import Immutable, { Map } from "immutable";
import immutableDevtools from "immutable-devtools";
import { createStore } from "redux";
import { Provider } from "react-redux";

import MyCatalog from "../../../reactplannerassets/catalog/mycatalog";
import ToolbarScreenshotButton from "../../../reactplannerassets/ui/toolbar-screenshot-button";

import { composeWithDevTools } from "redux-devtools-extension";

import areapolygon from "area-polygon";

import {
  Models as PlannerModels,
  reducer as PlannerReducer,
  ReactPlannerWrapper,
  Plugins as PlannerPlugins,
} from "../../../reactplanner-src/index";

// end react planner import

import { Dialog } from "primereact/dialog";
import { HiCheck, HiX } from "react-icons/hi";
import { fitToViewer } from "react-svg-pan-zoom";
import { breadcrumbsClasses } from "@mui/material";

// test data
const emptyDiagramJson = {
  unit: "cm",
  layers: {
    "layer-1": {
      id: "layer-1",
      altitude: 0,
      order: 0,
      opacity: 1,
      name: "default",
      visible: true,
      vertices: {},
      lines: {},
      holes: {},
      areas: {},
      items: {},
      selected: { vertices: [], lines: [], holes: [], areas: [], items: [] },
    },
  },
  grids: {
    h1: {
      id: "h1",
      type: "horizontal-streak",
      properties: {
        step: 20,
        colors: ["#808080", "#ddd", "#ddd", "#ddd", "#ddd"],
      },
    },
    v1: {
      id: "v1",
      type: "vertical-streak",
      properties: {
        step: 20,
        colors: ["#808080", "#ddd", "#ddd", "#ddd", "#ddd"],
      },
    },
  },
  selectedLayer: "layer-1",
  groups: {},
  width: 3000,
  height: 2000,
  meta: {},
  guides: { horizontal: {}, vertical: {}, circular: {} },
};

// Step 1: Define an action type
const UPDATE_REACT_PLANNER_STATE = "UPDATE_REACT_PLANNER_STATE";

// Step 2: Create an action creator function
const updateReactPlannerState = (newState) => ({
  type: UPDATE_REACT_PLANNER_STATE,
  newState,
});

// Define state
let AppState = Map({
  "react-planner": new PlannerModels.State(),
});

// const functionToBeCalledRef = useRef<(() => void) | null>(null);

// Define reducer
let reducer = (state, action) => {
  state = state || AppState;
  // Step 3: Modify your reducer to handle the new action type
  // switch (action.type) {
  //   case UPDATE_REACT_PLANNER_STATE:
  //     return state.update("react-planner", (plannerState) =>
  //       // plannerState.merge(action.newState)
  //       PlannerReducer(plannerState, action)
  //     );
  // }

  // console.log("insider reducer");
  // console.log(action);
  // if (action && action.type == "END_DRAWING_ITEM") {
  //   console.log("aaaaaa");
  //   functionToBeCalledRef.current?.();
  // }

  state = state.update("react-planner", (plannerState) =>
    PlannerReducer(plannerState, action)
  );
  return state;
};

let blackList = [
  "UPDATE_MOUSE_COORDS",
  "UPDATE_ZOOM_SCALE",
  "UPDATE_2D_CAMERA",
];

// Init store
// let store = createStore(
//   reducer,
//   null,
//   !isProduction && window.devToolsExtension ?
//     window.devToolsExtension({
//       features: {
//         pause: true,
//         lock: true,
//         persist: true,
//         export: true,
//         import: 'custom',
//         jump: true,
//         skip: true,
//         reorder: true,
//         dispatch: true,
//         test: true
//       },
//       actionsBlacklist: blackList,
//       maxAge: 999999
//     }) :
//     f => f
// );
let store = createStore(
  reducer,
  composeWithDevTools({
    features: {
      pause: true,
      lock: true,
      persist: true,
      export: true,
      import: "custom",
      jump: true,
      skip: true,
      reorder: true,
      dispatch: true,
      test: true,
    },
    actionsBlacklist: blackList,
    maxAge: 999999,
  })
);

let plugins = [
  PlannerPlugins.Keyboard(),
  // PlannerPlugins.Autosave("react-planner_v0"),
  PlannerPlugins.ConsoleDebugger(),
];

let toolbarButtons = [ToolbarScreenshotButton];
// end react planner stuff

function EnclosureDesignDiagramPage() {
  const apiJson = useApiJson();
  const location = useLocation();
  const navigate = useNavigate();
  const toastShadcn = useToast().toast;

  const { state, dispatch } = useEnclosureContext();

  // const { enclosureId } = useParams<{ enclosureId: string }>();

  // const [curEnclosure, setCurEnclosure] = useState<Enclosure | null>(null);
  const curEnclosure = state.curEnclosure;
  const [refreshSeed, setRefreshSeed] = useState<number>(0);

  // useEffect to fetch and set enclosure diagram
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (curEnclosure?.designDiagramJsonUrl) {
          const response = await fetch(
            `http://localhost:3000/${curEnclosure?.designDiagramJsonUrl}`
          );
          if (response.ok) {
            const data = await response.json();
            console.log("fetching diagram");
            console.log(curEnclosure?.designDiagramJsonUrl);
            let dataWithDimensions = {
              ...data,
              width:
                data.width != curEnclosure.width * 100
                  ? curEnclosure.width * 100
                  : data.width,
              height:
                data.height != curEnclosure.length * 100
                  ? curEnclosure.length * 100
                  : data.height,
            };
            loadDiagram(dataWithDimensions);
            clickFitToView();
            updateTotalLandWaterArea();
            calculateTotalPlantationCoverage();
          } else {
            console.error(
              "Failed to fetch enclosure data:",
              response.status,
              response.statusText
            );
          }
        } else {
          // no design diagram, start from scratch
          // loadDiagram(emptyDiagramJson);
          console.log("no design diagram!");
          store.dispatch({
            type: "NEW_PROJECT",
          });
        }
      } catch (error) {
        console.error("Error fetching enclosure data:", error);
      }
    };

    fetchData();
  }, [curEnclosure]);

  if (curEnclosure == null) {
    return (
      <div className="p-10">
        <div className="flex w-full flex-col items-center gap-4 rounded-lg border border-stroke bg-white p-20 text-black shadow-lg">
          <div className="text-title-xl">
            No enclosure is currently selected
          </div>
          <div className="text-lg">
            Click the button below to return to View All Enclosures Page
          </div>
          <Button
            onClick={() => navigate("/enclosure/viewallenclosures")}
            className="w-1/3"
          >
            Return
          </Button>
        </div>
      </div>
    );
  }

  // fetch recommendation
  const [
    enclosureTerrainDistributionRecommendation,
    setEnclosureTerrainDistributionRecommendation,
  ] = useState<any>();
  useEffect(() => {
    const fetchEnclosureTerrainStuffReco = async () => {
      try {
        const responseJson = await apiJson.get(
          `http://localhost:3000/api/enclosure/getEnclosureTerrainDistributionRecommendation/${curEnclosure.enclosureId}`
        );
        // console.log("test");
        // console.log(responseJson);
        setEnclosureTerrainDistributionRecommendation(
          responseJson.enclosureTerrainDistributionReco
        );
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchEnclosureTerrainStuffReco();
  }, [curEnclosure]);

  function loadDiagram(sceneJson: any) {
    // console.log(sceneJson);
    store.dispatch({
      type: "LOAD_PROJECT",
      // sceneJSON: emptyMapJson,
      sceneJSON: sceneJson,
    });
  }

  // start from scratch stuff
  const [resetDiagramDialog, setResetDiagramDialog] = useState<boolean>(false);
  const confirmRemoveAnimal = () => {
    setResetDiagramDialog(true);
  };

  const hideResetDiagramDialog = () => {
    setResetDiagramDialog(false);
  };

  const resetDiagram = async () => {
    // let tempDiagramJson = emptyDiagramJson
    let emptyDiagramJsonWithDimensions = {
      ...emptyDiagramJson,
      width: curEnclosure.width * 100,
      height: curEnclosure.length * 100,
    };
    loadDiagram(emptyDiagramJsonWithDimensions);
    await handleSave();
    setResetDiagramDialog(false);
  };

  const resetDiagramDialogFooter = (
    <React.Fragment>
      <Button onClick={hideResetDiagramDialog}>
        <HiX className="mr-2" />
        No
      </Button>
      <Button variant={"destructive"} onClick={resetDiagram}>
        <HiCheck className="mr-2" />
        Yes
      </Button>
    </React.Fragment>
  );
  // end new project stuff
  function newProject() {
    store.dispatch({
      type: "NEW_PROJECT",
    });
  }

  // calculate area stuff

  // useEffect to fetch area recommendation

  function calculateSelectedAreaSize() {
    console.log("Scene:");
    console.log(
      JSON.parse(JSON.stringify(store.getState()))["react-planner"].scene
    );
    console.log("Scene > selected layer:");
    console.log(
      JSON.parse(JSON.stringify(store.getState()))["react-planner"].scene
        .selectedLayer
    );
    const curSelectedLayerName = JSON.parse(JSON.stringify(store.getState()))[
      "react-planner"
    ].scene.selectedLayer;
    const curSelectedLayer = JSON.parse(JSON.stringify(store.getState()))[
      "react-planner"
    ].scene.layers[curSelectedLayerName];

    const selectedAreaId = Object.keys(curSelectedLayer.areas).find(
      (areaId) => curSelectedLayer.areas[areaId].selected === true
    );

    if (selectedAreaId == undefined) {
      return;
    }

    const selectedArea = curSelectedLayer.areas[selectedAreaId];
    console.log(selectedArea);
    console.log("-------");
    console.log(selectedArea.vertices);
    console.log("===========");
    console.log(curSelectedLayer.vertices);
    var polygon = selectedArea.vertices.map(function (vertexID) {
      var _layer$vertices$get = curSelectedLayer.vertices[vertexID],
        x = _layer$vertices$get.x,
        y = _layer$vertices$get.y;
      return [x, y];
    });

    var areaSize = areapolygon(polygon, false);

    console.log("area size: " + areaSize);

    // console.log("okokokok");
    // console.log(
    //   JSON.parse(JSON.stringify(store.getState()))["react-planner"].scene.layers
    // );
    // console.log("wuwuwuwuwu");
    // console.log(
    //   JSON.parse(JSON.stringify(store.getState()))["react-planner"].scene
    //     .layers[curSelectedAreaName]
    // );
  }

  function calculateAreaAreaByIdInMetresSquare(
    layerName: string,
    areaId: string
  ): number {
    const curScene = JSON.parse(JSON.stringify(store.getState()))[
      "react-planner"
    ].scene;
    const curLayer = curScene.layers[layerName];
    const curArea = curLayer.areas[areaId];

    var polygon = curArea.vertices.map(function (vertexID) {
      var _layer$vertices$get = curLayer.vertices[vertexID],
        x = _layer$vertices$get.x,
        y = _layer$vertices$get.y;
      return [x, y];
    });

    var areaSize = areapolygon(polygon, false);

    // convert from square cm to square metre before returning!
    return areaSize / 10000;
  }

  const [curTotalLandArea, setCurTotalLandArea] = useState<number>(0);
  const [curTotalWaterArea, setCurTotalWaterArea] = useState<number>(0);

  function updateTotalLandWaterArea() {
    let tempTotalLandArea = 0;
    let tempTotalWaterArea = 0;

    const curScene = JSON.parse(JSON.stringify(store.getState()))[
      "react-planner"
    ].scene;

    // loop through all layers (we try to keep to 1 layer still hahahahahah)
    // for each layer, loop through all areas
    ////// for each area, check area.properties.patternColor
    ///////// if patternColor == "#6aa84f"
    //////////// area is "LAND" --> calculate area and add to total land
    ///////// if patternColor == "#2986cc"
    //////////// area is "WATER" --> calculate area and add to total water

    Object.values(curScene.layers).forEach((layer: any) => {
      Object.values(layer.areas).forEach((area: any) => {
        // console.log(
        //   "In loop, area: " +
        //     area.id +
        //     ", patternColor: " +
        //     area.properties.patternColor
        // );
        if (area.properties.patternColor == "#6aa84f") {
          // LAND
          let curAreaArea = calculateAreaAreaByIdInMetresSquare(
            layer.id,
            area.id
          );
          // check for holes
          // nvm, as long as there is a hole, minus the area, because the area will be added later separately anyway
          for (let areaId of area.holes) {
            // if (layer.areas[areaId].properties.patternColor == "#2986cc") {
            //   console.log("HERE, curArea LAND but hole is WATER");
            //   // curArea is LAND but hole is WATER
            //   let areaOfCurHole = calculateAreaAreaByIdInMetresSquare(
            //     layer.id,
            //     areaId
            //   );
            //   console.log("curAreaArea in hole here: " + curAreaArea);
            //   console.log("areaOfCurHole: " + areaOfCurHole);
            //   curAreaArea = curAreaArea - areaOfCurHole;
            // }
            let areaOfCurHole = calculateAreaAreaByIdInMetresSquare(
              layer.id,
              areaId
            );
            curAreaArea = curAreaArea - areaOfCurHole;
          }
          // console.log("curAreaArea outside: " + curAreaArea);
          tempTotalLandArea += curAreaArea;
        } else if (area.properties.patternColor == "#2986cc") {
          // WATER
          let curAreaArea = calculateAreaAreaByIdInMetresSquare(
            layer.id,
            area.id
          );
          for (let areaId of area.holes) {
            let areaOfCurHole = calculateAreaAreaByIdInMetresSquare(
              layer.id,
              areaId
            );
            curAreaArea = curAreaArea - areaOfCurHole;
          }
          tempTotalWaterArea += curAreaArea;
        }

        // now, minus holes of a different type
        // for (let areaId of area.holes) {
        //   if (
        //     area.properties.patternColor == "#6aa84f" &&
        //     layer.areas[areaId].properties.patternColor == "#2986cc"
        //   ) {
        //     console.log("HERE, curArea LAND but hole is WATER");
        //     // curArea is LAND but hole is WATER
        //     let areaOfCurHole = calculateAreaAreaByIdInMetresSquare(
        //       layer.id,
        //       areaId
        //     );
        //     tempTotalLandArea = tempTotalLandArea - areaOfCurHole;
        //     console.log("tempTotalLandArea: " + tempTotalLandArea);
        //     console.log("areaOfCurHole: " + areaOfCurHole);
        //     console.log("math: " + (tempTotalLandArea - areaOfCurHole));
        //   } else if (
        //     area.properties.patternColor == "#2986cc" &&
        //     layer.areas[areaId].properties.patternColor == "#6aa84f"
        //   ) {
        //     console.log("HERE INSTEAD, curArea WATER but hole is LAND");
        //     // curArea is WATER but hole is LAND
        //     let areaOfCurHole = calculateAreaAreaByIdInMetresSquare(
        //       layer.id,
        //       areaId
        //     );
        //     tempTotalWaterArea -= areaOfCurHole;
        //   }
        // }
      });
    });

    // for (let layer of curScene.layers) {
    //   for (let area of layer.areas) {
    //     console.log(
    //       "In loop, area: " +
    //         area.id +
    //         ", patternColor: " +
    //         area.properties.patternColor
    //     );
    //     if (area.properties.patternColor == "#6aa84f") {
    //       // LAND
    //       tempTotalLandArea += calculateAreaAreaByIdInMetresSquare(
    //         layer.id,
    //         area.id
    //       );
    //     } else if (area.properties.patternColor == "#2986cc") {
    //       // LAND
    //       tempTotalWaterArea += calculateAreaAreaByIdInMetresSquare(
    //         layer.id,
    //         area.id
    //       );
    //     }
    //   }
    // }

    setCurTotalLandArea(tempTotalLandArea);
    setCurTotalWaterArea(tempTotalWaterArea);
  }

  function clickFitToView() {
    const fitToViewerButton = document.querySelector(
      'button[name="fit-to-viewer"]'
    ) as HTMLButtonElement;
    if (fitToViewerButton) {
      fitToViewerButton.click();
    }
    // click button to fit to view to canvas for design diagram
  }

  function makeSelectedAreaLand() {
    const curSelectedLayerName = JSON.parse(JSON.stringify(store.getState()))[
      "react-planner"
    ].scene.selectedLayer;
    const curSelectedLayer = JSON.parse(JSON.stringify(store.getState()))[
      "react-planner"
    ].scene.layers[curSelectedLayerName];
    const selectedAreaId = Object.keys(curSelectedLayer.areas).find(
      (areaId) => curSelectedLayer.areas[areaId].selected === true
    );
    if (selectedAreaId == undefined) {
      return;
    }

    const selectedArea = curSelectedLayer.areas[selectedAreaId];
    const tempScene = JSON.parse(JSON.stringify(store.getState()))[
      "react-planner"
    ].scene;

    let tempSelectedArea = { ...selectedArea };
    tempSelectedArea.properties.texture = "Land";
    tempSelectedArea.properties.patternColor = "#6aa84f";

    tempScene.layers[curSelectedLayerName].areas[selectedAreaId] =
      tempSelectedArea;

    store.dispatch({
      type: "LOAD_PROJECT",
      sceneJSON: tempScene,
    });

    clickFitToView();

    updateTotalLandWaterArea();
  }

  function makeSelectedAreaWater() {
    const curSelectedLayerName = JSON.parse(JSON.stringify(store.getState()))[
      "react-planner"
    ].scene.selectedLayer;
    const curSelectedLayer = JSON.parse(JSON.stringify(store.getState()))[
      "react-planner"
    ].scene.layers[curSelectedLayerName];
    const selectedAreaId = Object.keys(curSelectedLayer.areas).find(
      (areaId) => curSelectedLayer.areas[areaId].selected === true
    );
    if (selectedAreaId == undefined) {
      return;
    }

    const selectedArea = curSelectedLayer.areas[selectedAreaId];
    const tempScene = JSON.parse(JSON.stringify(store.getState()))[
      "react-planner"
    ].scene;

    let tempSelectedArea = { ...selectedArea };
    tempSelectedArea.properties.texture = "Water";
    tempSelectedArea.properties.patternColor = "#2986cc";

    tempScene.layers[curSelectedLayerName].areas[selectedAreaId] =
      tempSelectedArea;

    store.dispatch({
      type: "LOAD_PROJECT",
      sceneJSON: tempScene,
    });

    clickFitToView();

    updateTotalLandWaterArea();
  }

  // end calculate area stuff

  // calculate plantation coverage stuff
  const [totalPlantationCoveragePercent, setTotalPlantationCoveragePercent] =
    useState<number>(0);

  // functionToBeCalledRef.current = () => {
  //   console.log("uwoh");
  //   calculateTotalPlantationCoverage();
  // };

  // const storeState = useSelector((state) => state["react-planner"]);
  useEffect(() => {
    // console.log()
    calculateTotalPlantationCoverage();
  }, [curTotalLandArea]);

  interface PlantationCircle {
    radius: number;
    x: number;
    y: number;
  }

  const calculateCircleCoveredArea = (circle: PlantationCircle): number => {
    const { radius } = circle;
    return Math.pow(radius, 2) * Math.PI;
  };

  const calculateTotalCoveredArea = (circles: PlantationCircle[]): number => {
    let totalCoveredArea = 0;

    // loop through all circles (trees)
    // for each circle
    ////

    for (let i = 0; i < circles.length; i++) {
      const circle = circles[i];
      const circleArea = calculateCircleCoveredArea(circle);
      // console.log("circle id: " + i + "circle area: " + circleArea);
      totalCoveredArea += circleArea;
      let isCurCircleCompletelyInAnother = false;
      // check if cur circle is inside another circle completely,
      // if it is, get rid of cur circle and don't process further
      for (let k = 0; k < circles.length; k++) {
        if (k != i) {
          const anotherCircle = circles[k];
          const distanceBetweenCentersHere = Math.sqrt(
            Math.pow(circle.x - anotherCircle.x, 2) +
              Math.pow(circle.y - anotherCircle.y, 2)
          );
          if (
            distanceBetweenCentersHere +
              Math.min(circle.radius, anotherCircle.radius) <=
            Math.max(circle.radius, anotherCircle.radius)
          ) {
            // check if curCircle is completely inside anotherCircle
            // if yes, ignore this and undo the area adding
            if (
              Math.min(Math.min(circle.radius, anotherCircle.radius)) ==
              circle.radius
            ) {
              totalCoveredArea -= circleArea;
              isCurCircleCompletelyInAnother = true;
              break;
            }
          }
        }
      }

      if (!isCurCircleCompletelyInAnother) {
        for (let j = i + 1; j < circles.length; j++) {
          const nextCircle = circles[j];
          const distanceBetweenCenters = Math.sqrt(
            Math.pow(circle.x - nextCircle.x, 2) +
              Math.pow(circle.y - nextCircle.y, 2)
          );

          // Check if circles intersect
          if (distanceBetweenCenters < circle.radius + nextCircle.radius) {
            // Circles intersect, calculate the overlapping area using circular segments
            const overlappingArea = calculateOverlappingArea(
              circle,
              nextCircle,
              distanceBetweenCenters
            );
            // console.log("in heree lmao, overlappingArea: " + overlappingArea);
            totalCoveredArea -= overlappingArea; // Subtract overlapping area to avoid duplication
          }
        }
      }
    }

    // console.log("totalCoveredArea: " + totalCoveredArea);

    return totalCoveredArea;
  };

  const calculateOverlappingArea = (
    circle1: PlantationCircle,
    circle2: PlantationCircle,
    distance: number
  ): number => {
    // const { radius: r1 } = circle1;
    // const { radius: r2 } = circle2;

    // // Ensure valid range for acos
    // const cosArg1 =
    //   (r1 * r1 + distance * distance - r2 * r2) / (2 * r1 * distance);
    // const cosArg2 =
    //   (r2 * r2 + distance * distance - r1 * r1) / (2 * r2 * distance);

    // const theta1 = Math.acos(Math.max(-1, Math.min(1, cosArg1)));
    // const theta2 = Math.acos(Math.max(-1, Math.min(1, cosArg2)));

    // console.log("theta1: " + theta1);
    // console.log("theta2: " + theta2);

    // const area1 = 0.5 * Math.pow(r1, 2) * (theta1 - Math.sin(theta1));
    // const area2 = 0.5 * Math.pow(r2, 2) * (theta2 - Math.sin(theta2));

    // console.log("area1: " + area1);
    // console.log("area2: " + area2);

    // return area1 + area2;

    const { radius: r1 } = circle1;
    const { radius: r2 } = circle2;

    // Check if one circle is completely inside the other
    if (distance + Math.min(r1, r2) <= Math.max(r1, r2)) {
      // One circle is completely inside the other, no overlap
      // return Math.PI * Math.pow(Math.min(r1, r2), 2);
      return 0;
    }

    // Calculate angles and areas of circular segments
    const theta1 = Math.acos(
      (Math.pow(r1, 2) + Math.pow(distance, 2) - Math.pow(r2, 2)) /
        (2 * r1 * distance)
    );
    const theta2 = Math.acos(
      (Math.pow(r2, 2) + Math.pow(distance, 2) - Math.pow(r1, 2)) /
        (2 * r2 * distance)
    );

    const area1 = 0.5 * Math.pow(r1, 2) * (theta1 - Math.sin(theta1));
    const area2 = 0.5 * Math.pow(r2, 2) * (theta2 - Math.sin(theta2));

    return area1 + area2;
  };

  function calculateTotalPlantationCoverage() {
    let tempTotalPlantationAreaSquareM = 0;

    const curScene = JSON.parse(JSON.stringify(store.getState()))[
      "react-planner"
    ].scene;

    let plantationCirclesList: PlantationCircle[] = [];

    Object.values(curScene.layers).forEach((layer: any) => {
      Object.values(layer.items).forEach((item: any) => {
        if (item.type == "big tree" || item.type == "small tree") {
          // AREA OF A CIRCLE in SQUARE CM
          // let areaCurTreeInSquareCm = calculateCircleArea(
          //   item.properties.radius.length
          // );
          // let areaCurTreeInSquareM = areaCurTreeInSquareCm / 10000;

          // tempTotalPlantationAreaSquareM += areaCurTreeInSquareM;
          plantationCirclesList.push({
            radius: item.properties.radius.length,
            x: item.x,
            y: item.y,
          });
        }
      });
    });

    // console.log(plantationCirclesList);

    tempTotalPlantationAreaSquareM =
      calculateTotalCoveredArea(plantationCirclesList) / 10000; // divide by 1000 to convert from square cm to square m
    // console.log(
    //   "heree, tempTotalPlantationAreaSquareM: " + tempTotalPlantationAreaSquareM
    // );
    if (curTotalLandArea != 0) {
      let tempTotalPlantationCoverage =
        (tempTotalPlantationAreaSquareM / curTotalLandArea) * 100;
      setTotalPlantationCoveragePercent(tempTotalPlantationCoverage);
    }
  }

  // end

  async function handleSave() {
    console.log(
      JSON.parse(JSON.stringify(store.getState()))["react-planner"].scene
    );

    updateTotalLandWaterArea();
    calculateTotalPlantationCoverage();

    const updateDesignDiagramObj = {
      designDiagramJson: JSON.stringify(
        JSON.parse(JSON.stringify(store.getState()))["react-planner"].scene
      ),
      landArea: curTotalLandArea,
      waterArea: curTotalWaterArea,
      plantationCoveragePercent: totalPlantationCoveragePercent,
    };

    const updateDesignDiagramApi = async () => {
      try {
        const response = await apiJson.put(
          `http://localhost:3000/api/enclosure/updateDesignDiagram/${curEnclosure?.enclosureId}`,
          updateDesignDiagramObj
        );
        // success
        toastShadcn({
          description: "Successfully updated design diagram!",
        });
      } catch (error: any) {
        // got error
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An error has occurred while updating design diagram: \n" +
            error.message,
        });
      }
    };
    updateDesignDiagramApi();
  }

  const areaValueFormat = (area: number, reco: number) => {
    if (area >= reco) {
      return (
        <React.Fragment>
          <span className="font-bold text-emerald-800">{area.toFixed(2)}</span>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <span className="animate-pulse font-bold text-red-800">
            {area.toFixed(2)}
          </span>
        </React.Fragment>
      );
    }
  };

  const plantationCoverageValueFormat = (
    plantationCoverage: number,
    recoMin: any,
    recoMax: any
  ) => {
    // if (typeof value === "string")

    if (
      recoMin == "No suitable range, please review species allocation." ||
      recoMax == "No suitable range, please review species allocation."
    ) {
      return (
        <React.Fragment>
          <span className="font-bold">{plantationCoverage.toFixed(2)}</span>
        </React.Fragment>
      );
    }

    if (
      plantationCoverage < Number(recoMin) ||
      plantationCoverage > Number(recoMax)
    ) {
      return (
        <React.Fragment>
          <span className="animate-pulse font-bold text-red-800">
            {plantationCoverage > 100
              ? (100).toFixed(2)
              : plantationCoverage.toFixed(2)}
          </span>
        </React.Fragment>
      );
    } else if (plantationCoverage >= recoMin && plantationCoverage <= recoMax) {
      return (
        <React.Fragment>
          <span className="font-bold text-emerald-800">
            {plantationCoverage > 100
              ? (100).toFixed(2)
              : plantationCoverage.toFixed(2)}
          </span>
        </React.Fragment>
      );
    }
  };

  return (
    <div className="overflow-y-scroll  p-10">
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-lg">
        {/* header */}
        <div className="flex flex-col">
          <div className="mb-4 flex justify-between">
            <Button
              variant={"outline"}
              type="button"
              className=""
              onClick={() => {
                newProject();
                navigate(-1);
              }}
            >
              Back
            </Button>
            <span className="self-center text-lg text-graydark">
              Enclosure Design Diagram
            </span>
            <Button disabled className="invisible">
              Back
            </Button>
          </div>
          <Separator />
          <span className="mt-4 self-center text-title-xl font-bold">
            {curEnclosure?.name}
          </span>
        </div>
        <Dialog
          visible={resetDiagramDialog}
          style={{ width: "32rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header="Confirm"
          modal
          footer={resetDiagramDialogFooter}
          onHide={hideResetDiagramDialog}
        >
          <div className="confirmation-content">
            <i
              className="pi pi-exclamation-triangle mr-3"
              style={{ fontSize: "2rem" }}
            />
            <span>
              Are you sure you want to reset the enclosure diagram?
              <br />
              This will remove all elements and designs already added to this
              enclosure's diagram.
            </span>
          </div>
        </Dialog>

        {/* Body */}

        {/* <div>
          <Button onClick={calculateSelectedAreaSize}>Cur Area Size</Button>
        </div> */}

        <div className="flex w-full gap-10">
          <div className="flex flex-col gap-2">
            <div className="min-w-max">
              <Button className="w-full" onClick={handleSave}>
                Save Diagram
              </Button>
            </div>
            <div className="min-w-max">
              <Button
                className="w-full"
                variant={"destructive"}
                onClick={confirmRemoveAnimal}
              >
                Delete (Reset) Diagram
              </Button>
            </div>
          </div>
          <div className="flex w-5/6 flex-col items-start gap-2">
            <div className="flex gap-2 p-0">
              <div>
                <Button className="" onClick={updateTotalLandWaterArea}>
                  Re-calculate Areas
                </Button>
              </div>
              <div>
                <Button onClick={makeSelectedAreaLand} className="bg-[#6aa84f]">
                  Mark Land Area
                </Button>
              </div>
              <div>
                <Button
                  onClick={makeSelectedAreaWater}
                  className="bg-[#2986cc]"
                >
                  Mark Water Area
                </Button>
              </div>
            </div>
            <Table className="w-full">
              <TableHeader className="bg-whiten">
                {/* <TableRow>
                  <TableHead
                    colSpan={3}
                    className="text-center text-lg font-bold"
                  >
                    Area
                  </TableHead>
                </TableRow> */}
                <TableRow>
                  <TableHead className="font-bold">Area</TableHead>
                  <TableHead className="text-center">Current</TableHead>
                  <TableHead className="text-center">Recommended Min</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="hover:bg-transparent">
                  <TableCell className="font-bold">
                    Land (m<sup>2</sup>)
                  </TableCell>
                  <TableCell className="text-center hover:bg-muted/50">
                    {areaValueFormat(
                      curTotalLandArea,
                      Number(
                        enclosureTerrainDistributionRecommendation?.minLandAreaRequired
                      )
                    )}
                  </TableCell>
                  <TableCell className="text-center hover:bg-muted/50">
                    {enclosureTerrainDistributionRecommendation?.minLandAreaRequired >
                    0
                      ? enclosureTerrainDistributionRecommendation?.minLandAreaRequired.toFixed(
                          2
                        )
                      : "Not available"}
                  </TableCell>
                </TableRow>
                <TableRow className="hover:bg-transparent">
                  <TableCell className="font-bold">
                    Water (m<sup>2</sup>)
                  </TableCell>
                  <TableCell className="text-center hover:bg-muted/50">
                    {areaValueFormat(
                      curTotalWaterArea,
                      Number(
                        enclosureTerrainDistributionRecommendation?.minWaterAreaRequired
                      )
                    )}
                  </TableCell>
                  <TableCell className="text-center hover:bg-muted/50">
                    {enclosureTerrainDistributionRecommendation?.minWaterAreaRequired >
                    0
                      ? enclosureTerrainDistributionRecommendation?.minWaterAreaRequired.toFixed(
                          2
                        )
                      : "Not available"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div className="flex w-full flex-col gap-2">
            <div className="flex gap-2">
              <div>
                <Button
                  className="w-full bg-[#008227]"
                  onClick={calculateTotalPlantationCoverage}
                >
                  Re-calculate Plantation Coverage
                </Button>
              </div>
            </div>
            <Table className="w-full">
              <TableHeader className="bg-whiten">
                <TableRow>
                  <TableHead className="font-bold"></TableHead>
                  <TableHead className="text-center">Recommended Min</TableHead>
                  <TableHead className="text-center">Current</TableHead>
                  <TableHead className="text-center">Recommended Max</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-bold">
                    Plantation Coverage (%)
                  </TableCell>
                  <TableCell className="text-center">
                    {enclosureTerrainDistributionRecommendation?.plantationCoveragePercentMin ==
                    Number.MIN_SAFE_INTEGER
                      ? "Not available"
                      : enclosureTerrainDistributionRecommendation?.plantationCoveragePercentMin.toFixed(
                          2
                        )}
                  </TableCell>
                  <TableCell className="text-center">
                    {plantationCoverageValueFormat(
                      totalPlantationCoveragePercent,
                      enclosureTerrainDistributionRecommendation?.plantationCoveragePercentMin,
                      enclosureTerrainDistributionRecommendation?.plantationCoveragePercentMax
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {enclosureTerrainDistributionRecommendation?.plantationCoveragePercentMax ==
                    Number.MAX_SAFE_INTEGER
                      ? "Not available"
                      : enclosureTerrainDistributionRecommendation?.plantationCoveragePercentMax.toFixed(
                          2
                        )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        <div>
          <Provider store={store}>
            <SizeMe>
              {({ size }) => (
                <ReactPlannerWrapper
                  store={store}
                  catalog={MyCatalog}
                  width={size.width || 700}
                  height={size.height || 600}
                  plugins={plugins}
                  toolbarButtons={toolbarButtons}
                  stateExtractor={(state) => state.get("react-planner")}
                />
              )}
            </SizeMe>
          </Provider>
        </div>
        <div>
          {curEnclosure && (
            <Table className="w-full">
              <TableHeader className="bg-whiten">
                <TableRow>
                  <TableHead className="text-center"></TableHead>
                  <TableHead className="text-center">Short Grass</TableHead>
                  <TableHead className="text-center">Long Grass</TableHead>
                  <TableHead className="text-center">Soil</TableHead>
                  <TableHead className="text-center">Rock</TableHead>
                  <TableHead className="text-center">Sand</TableHead>
                  <TableHead className="text-center">Snow</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-bold">Percentage (%)</TableCell>
                  <TableCell className="text-center">
                    {curEnclosure.shortGrassPercent
                      ? curEnclosure.shortGrassPercent.toFixed(2)
                      : "NA"}
                  </TableCell>
                  <TableCell className="text-center">
                    {curEnclosure.longGrassPercent
                      ? curEnclosure.longGrassPercent.toFixed(2)
                      : "NA"}
                  </TableCell>
                  <TableCell className="text-center">
                    {curEnclosure.soilPercent
                      ? curEnclosure.soilPercent.toFixed(2)
                      : "NA"}
                  </TableCell>
                  <TableCell className="text-center">
                    {curEnclosure.rockPercent
                      ? curEnclosure.rockPercent.toFixed(2)
                      : "NA"}
                  </TableCell>
                  <TableCell className="text-center">
                    {curEnclosure.sandPercent
                      ? curEnclosure.sandPercent.toFixed(2)
                      : "NA"}
                  </TableCell>
                  <TableCell className="text-center">
                    {curEnclosure.snowPercent
                      ? curEnclosure.snowPercent.toFixed(2)
                      : "NA"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-bold">
                    Area (m<sup>2</sup>)
                  </TableCell>
                  <TableCell className="text-center">
                    {curEnclosure.shortGrassPercent
                      ? (
                          (curEnclosure.shortGrassPercent / 100) *
                          curTotalLandArea
                        ).toFixed(2)
                      : "NA"}
                  </TableCell>
                  <TableCell className="text-center">
                    {curEnclosure.longGrassPercent
                      ? (
                          (curEnclosure.longGrassPercent / 100) *
                          curTotalLandArea
                        ).toFixed(2)
                      : "NA"}
                  </TableCell>
                  <TableCell className="text-center">
                    {curEnclosure.soilPercent
                      ? (
                          (curEnclosure.soilPercent / 100) *
                          curTotalLandArea
                        ).toFixed(2)
                      : "NA"}
                  </TableCell>
                  <TableCell className="text-center">
                    {curEnclosure.rockPercent
                      ? (
                          (curEnclosure.rockPercent / 100) *
                          curTotalLandArea
                        ).toFixed(2)
                      : "NA"}
                  </TableCell>
                  <TableCell className="text-center">
                    {curEnclosure.sandPercent
                      ? (
                          (curEnclosure.sandPercent / 100) *
                          curTotalLandArea
                        ).toFixed(2)
                      : "NA"}
                  </TableCell>
                  <TableCell className="text-center">
                    {curEnclosure.snowPercent
                      ? (
                          (curEnclosure.snowPercent / 100) *
                          curTotalLandArea
                        ).toFixed(2)
                      : "NA"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}

export default EnclosureDesignDiagramPage;
