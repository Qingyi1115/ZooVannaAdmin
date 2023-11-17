import React, { useEffect, useState } from "react";
import useApiJson from "../../hooks/useApiJson";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
import { useLocation, useNavigate } from "react-router-dom";

import { useEnclosureContext } from "../../hooks/useEnclosureContext";

// react planner stuff
import { Map } from "immutable";
import { Provider } from "react-redux";
import { SizeMe } from "react-sizeme";
import { createStore } from "redux";

import MyCatalog from "../../../reactplannerassets/catalog/mycatalog";
import ToolbarScreenshotButton from "../../../reactplannerassets/ui/toolbar-screenshot-button";

import { composeWithDevTools } from "redux-devtools-extension";

import areapolygon from "area-polygon";

import {
  Models as PlannerModels,
  Plugins as PlannerPlugins,
  reducer as PlannerReducer,
  ReactPlannerWrapper,
} from "../../../reactplanner-src/index";

// end react planner import

import { Dialog } from "primereact/dialog";
import { HiCheck, HiX } from "react-icons/hi";
import { useAuthContext } from "../../hooks/useAuthContext";

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
  // PlannerPlugins.ConsoleDebugger(),
];

let toolbarButtons = [ToolbarScreenshotButton];
// end react planner stuff

function EnclosureDesignDiagramPage() {
  const apiJson = useApiJson();
  const location = useLocation();
  const navigate = useNavigate();
  const toastShadcn = useToast().toast;
  const employee = useAuthContext().state.user?.employeeData;
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
            updateTotalLandWaterArea();
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
        console.log(
          "In loop, area: " +
            area.id +
            ", patternColor: " +
            area.properties.patternColor
        );
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
          console.log("curAreaArea outside: " + curAreaArea);
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

  // calculate area stuff

  async function handleSave() {
    console.log(
      JSON.parse(JSON.stringify(store.getState()))["react-planner"].scene
    );

    const updateDesignDiagramObj = {
      designDiagramJson: JSON.stringify(
        JSON.parse(JSON.stringify(store.getState()))["react-planner"].scene
      ),
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

        {/* Body */}
        {(employee.superAdmin ||
          employee.planningStaff?.plannerType == "CURATOR") && (
          <div className="flex gap-6">
            <div>
              <Button onClick={handleSave}>Save Diagram</Button>
            </div>
            <div>
              <Button variant={"destructive"} onClick={confirmRemoveAnimal}>
                Delete (Reset) Diagram
              </Button>
            </div>
          </div>
        )}
        <div>
          <Button onClick={calculateSelectedAreaSize}>Cur Area Size</Button>
        </div>

        <div>
          <Provider store={store}>
            <SizeMe>
              {({ size }) => (
                <ReactPlannerWrapper
                  store={store}
                  catalog={MyCatalog}
                  width={size.width || 600}
                  height={size.height || 600}
                  plugins={plugins}
                  toolbarButtons={toolbarButtons}
                  stateExtractor={(state) => state.get("react-planner")}
                />
              )}
            </SizeMe>
          </Provider>
        </div>
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
    </div>
  );
}

export default EnclosureDesignDiagramPage;
