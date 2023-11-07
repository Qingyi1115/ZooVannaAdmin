import React, { useState, useEffect } from "react";
import useApiJson from "../../hooks/useApiJson";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { NavLink, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import Enclosure from "../../models/Enclosure";

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

import {
  Models as PlannerModels,
  reducer as PlannerReducer,
  ReactPlannerWrapper,
  Plugins as PlannerPlugins,
} from "../../../reactplanner-src/index";

// test data
const testMapJson = {
  unit: "cm",
  layers: {
    TNV491szj: {
      id: "TNV491szj",
      altitude: 0,
      order: 0,
      opacity: 1,
      name: "layer TNV491szj",
      visible: false,
      vertices: {
        K9VOA6vq3CU: {
          id: "K9VOA6vq3CU",
          type: "",
          prototype: "vertices",
          name: "Vertex",
          misc: {},
          selected: false,
          properties: {},
          visible: true,
          x: 168.72729520981437,
          y: 1606.8444650233664,
          lines: ["v4GJEzWw5xk", "GXXmu_EO_As"],
          areas: [],
        },
        GQXl7jD5Ku4: {
          id: "GQXl7jD5Ku4",
          type: "",
          prototype: "vertices",
          name: "Vertex",
          misc: {},
          selected: false,
          properties: {},
          visible: true,
          x: 197.48599352701066,
          y: 1796.1725622782421,
          lines: ["v4GJEzWw5xk", "saMZMlZHp"],
          areas: [],
        },
        "RRQ0Nq-dlz7": {
          id: "RRQ0Nq-dlz7",
          type: "",
          prototype: "vertices",
          name: "Vertex",
          misc: {},
          selected: false,
          properties: {},
          visible: true,
          x: 480.2798603127744,
          y: 1630.8100469543633,
          lines: ["GXXmu_EO_As", "saMZMlZHp"],
          areas: [],
        },
      },
      lines: {
        v4GJEzWw5xk: {
          id: "v4GJEzWw5xk",
          type: "wall",
          prototype: "lines",
          name: "Wall",
          misc: {},
          selected: false,
          properties: {
            height: { length: 300 },
            thickness: { length: 20 },
            textureA: "bricks",
            textureB: "bricks",
          },
          visible: true,
          vertices: ["K9VOA6vq3CU", "GQXl7jD5Ku4"],
          holes: [],
        },
        GXXmu_EO_As: {
          id: "GXXmu_EO_As",
          type: "wall",
          prototype: "lines",
          name: "Wall",
          misc: {},
          selected: false,
          properties: {
            height: { length: 300 },
            thickness: { length: 20 },
            textureA: "bricks",
            textureB: "bricks",
          },
          visible: true,
          vertices: ["K9VOA6vq3CU", "RRQ0Nq-dlz7"],
          holes: [],
        },
        saMZMlZHp: {
          id: "saMZMlZHp",
          type: "wall",
          prototype: "lines",
          name: "Wall",
          misc: {},
          selected: false,
          properties: {
            height: { length: 300 },
            thickness: { length: 20 },
            textureA: "bricks",
            textureB: "bricks",
          },
          visible: true,
          vertices: ["GQXl7jD5Ku4", "RRQ0Nq-dlz7"],
          holes: [],
        },
      },
      holes: {},
      areas: {
        uxXtMIQ2A6: {
          id: "uxXtMIQ2A6",
          type: "area",
          prototype: "areas",
          name: "Area",
          misc: {},
          selected: false,
          properties: {
            patternColor: "#F5F4F4",
            thickness: { length: 0 },
            texture: "none",
          },
          visible: true,
          vertices: ["K9VOA6vq3CU", "RRQ0Nq-dlz7", "GQXl7jD5Ku4"],
          holes: [],
        },
      },
      items: {},
      selected: { vertices: [], lines: [], holes: [], areas: [], items: [] },
    },
    "7yPP7OfAr": {
      id: "7yPP7OfAr",
      altitude: 0,
      order: 0,
      opacity: 1,
      name: "layer 7yPP7OfAr",
      visible: true,
      vertices: {
        bqkDCpIhD0b: {
          id: "bqkDCpIhD0b",
          type: "",
          prototype: "vertices",
          name: "Vertex",
          misc: {},
          selected: false,
          properties: {},
          visible: true,
          x: 221,
          y: 1521,
          lines: ["NX15VAy_yZ_", "DFLhwK4GgkA"],
          areas: [],
        },
        YVBe2HU0J6G: {
          id: "YVBe2HU0J6G",
          type: "",
          prototype: "vertices",
          name: "Vertex",
          misc: {},
          selected: false,
          properties: {},
          visible: true,
          x: 320,
          y: 1784,
          lines: ["NX15VAy_yZ_", "mwqN_0trE5"],
          areas: [],
        },
        hXA_V2UpC4I: {
          id: "hXA_V2UpC4I",
          type: "",
          prototype: "vertices",
          name: "Vertex",
          misc: {},
          selected: false,
          properties: {},
          visible: true,
          x: 416,
          y: 1544,
          lines: ["DFLhwK4GgkA", "mwqN_0trE5"],
          areas: [],
        },
      },
      lines: {
        NX15VAy_yZ_: {
          id: "NX15VAy_yZ_",
          type: "wall",
          prototype: "lines",
          name: "Wall",
          misc: {},
          selected: false,
          properties: {
            height: { length: 300 },
            thickness: { length: 20 },
            textureA: "bricks",
            textureB: "bricks",
          },
          visible: true,
          vertices: ["bqkDCpIhD0b", "YVBe2HU0J6G"],
          holes: [],
        },
        DFLhwK4GgkA: {
          id: "DFLhwK4GgkA",
          type: "wall",
          prototype: "lines",
          name: "Wall",
          misc: {},
          selected: false,
          properties: {
            height: { length: 300 },
            thickness: { length: 20 },
            textureA: "bricks",
            textureB: "bricks",
          },
          visible: true,
          vertices: ["bqkDCpIhD0b", "hXA_V2UpC4I"],
          holes: [],
        },
        mwqN_0trE5: {
          id: "mwqN_0trE5",
          type: "wall",
          prototype: "lines",
          name: "Wall",
          misc: {},
          selected: false,
          properties: {
            height: { length: 300 },
            thickness: { length: 20 },
            textureA: "bricks",
            textureB: "bricks",
          },
          visible: true,
          vertices: ["YVBe2HU0J6G", "hXA_V2UpC4I"],
          holes: [],
        },
      },
      holes: {},
      areas: {
        NmGGRLQyox: {
          id: "NmGGRLQyox",
          type: "area",
          prototype: "areas",
          name: "Area",
          misc: {},
          selected: false,
          properties: {
            patternColor: "#F5F4F4",
            thickness: { length: 0 },
            texture: "none",
          },
          visible: true,
          vertices: ["bqkDCpIhD0b", "hXA_V2UpC4I", "YVBe2HU0J6G"],
          holes: [],
        },
      },
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
  selectedLayer: "TNV491szj",
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
let store = createStore(reducer, composeWithDevTools());

let plugins = [
  PlannerPlugins.Keyboard(),
  PlannerPlugins.Autosave("react-planner_v0"),
  PlannerPlugins.ConsoleDebugger(),
];

let toolbarButtons = [ToolbarScreenshotButton];
// end react planner stuff

function EnclosureDesignDiagramPage() {
  const apiJson = useApiJson();
  const location = useLocation();
  const navigate = useNavigate();

  const { state, dispatch } = useEnclosureContext();

  // const { enclosureId } = useParams<{ enclosureId: string }>();

  // const [curEnclosure, setCurEnclosure] = useState<Enclosure | null>(null);
  const curEnclosure = state.curEnclosure;
  const [refreshSeed, setRefreshSeed] = useState<number>(0);

  // useEffect to fetch enclosure

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

  function handleLoad() {
    store.dispatch({
      type: "LOAD_PROJECT",
      sceneJSON: testMapJson,
    });
  }

  async function handleSave() {
    console.log(
      JSON.parse(JSON.stringify(store.getState()))["react-planner"].scene
    );
  }

  return (
    <div className="p-10">
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-20 text-black shadow-lg">
        {/* header */}
        <div className="flex flex-col">
          <div className="mb-4 flex justify-between">
            <Button
              variant={"outline"}
              type="button"
              className=""
              onClick={() => navigate(-1)}
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
        {/* <Button>View Design Diagram</Button> */}
        <div>
          <Button onClick={handleSave}>Test Handle Save</Button>
        </div>
        <div>
          <Button onClick={handleLoad}>Test Handle Load</Button>
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
    </div>
  );
}

export default EnclosureDesignDiagramPage;
