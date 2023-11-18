import React, { useEffect, useState } from "react";
import Enclosure from "../../../models/Enclosure";

import beautifyText from "../../../hooks/beautifyText";

import { Button } from "@/components/ui/button";

import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import useApiJson from "../../../hooks/useApiJson";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { Separator } from "@/components/ui/separator";

import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import {
  InputNumber,
  InputNumberValueChangeEvent,
} from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { BarrierType } from "../../../enums/Enumurated";

import { composeWithDevTools } from "redux-devtools-extension";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import { SizeMe } from "react-sizeme";
import Immutable, { Map } from "immutable";
import immutableDevtools from "immutable-devtools";
import {
  Models as PlannerModels,
  reducer as PlannerReducer,
  ReactPlannerWrapper,
  Plugins as PlannerPlugins,
} from "../../../../reactplanner-src/index";
import ToolbarScreenshotButton from "../../../../reactplannerassets/ui/toolbar-screenshot-button";
import MyCatalog from "../../../../reactplannerassets/catalog/mycatalog";

import { FaRegHandPointer } from "react-icons/fa";

interface CreateEnclosureBarriersFormProps {
  curEnclosure: Enclosure;
}

function CreateEnclosureBarriersForm(props: CreateEnclosureBarriersFormProps) {
  const { curEnclosure } = props;

  const apiJson = useApiJson();
  const navigate = useNavigate();
  const toastShadcn = useToast().toast;

  const [selectedWallId, setSelectedWallId] = useState<any>();

  ////////
  ////////
  let AppState = Map({
    "react-planner": new PlannerModels.State(),
  });

  let reducer = (state, action) => {
    state = state || AppState;

    console.log("insider reducer");
    console.log(action);

    if (action.type == "SELECT_LINE") {
      //   setSelectedWall({ layerID: action.layerID, lineID: action.lineID });
      setSelectedWallId(action.lineID);
    }

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

  ///////
  ///////

  useEffect(() => {
    const updatedBarrierList = curEnclosureBarrierList.map((barrier) => {
      if (barrier.wallName === selectedWallId) {
        return {
          ...barrier,
          selected: true,
        };
      } else {
        return {
          ...barrier,
          selected: false,
        };
      }
      return barrier;
    });
    setCurEnclosureBarrierList(updatedBarrierList);
  }, [selectedWallId]);

  const barrierTypeOptions = Object.keys(BarrierType).map((barrierTypeKey) => ({
    value: BarrierType[barrierTypeKey as keyof typeof BarrierType].toString(),
    label: beautifyText(
      BarrierType[barrierTypeKey as keyof typeof BarrierType].toString()
    ),
  }));

  const [curEnclosureDesignDiagramScene, setCurEnclosureDesignDiagramScene] =
    useState<any>(null);
  const [enclosureWallList, setEnclosureWallList] = useState<any>([]);

  interface DummyEnclosureBarrier {
    wallName: string;
    barrierType: BarrierType;
    remarks: string;
    selected: boolean;
  }
  const [curEnclosureBarrierList, setCurEnclosureBarrierList] = useState<
    DummyEnclosureBarrier[]
  >(
    enclosureWallList?.map((wall: any) => ({
      wallName: wall.id,
      barrierType: null,
      remarks: "",
      selected: false,
    }))
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (curEnclosure?.designDiagramJsonUrl) {
          const response = await fetch(
            `http://localhost:3000/${curEnclosure?.designDiagramJsonUrl}`
          );
          if (response.ok) {
            const data = await response.json();
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
            setCurEnclosureDesignDiagramScene(dataWithDimensions);
            getBarriersList(dataWithDimensions);

            loadDiagram(dataWithDimensions);
          } else {
            console.error(
              "Failed to fetch enclosure data:",
              response.status,
              response.statusText
            );
          }
        }
      } catch (error) {
        console.error("Error fetching enclosure data:", error);
      }
    };

    fetchData();
  }, [curEnclosure]);

  useEffect(() => {
    if (curEnclosureDesignDiagramScene != null) {
      loadDiagram(curEnclosureDesignDiagramScene);
      clickFitToView();
      removeToolbar();
      //   removeSidebar();
    }
  }, [curEnclosureDesignDiagramScene, store]);

  function loadDiagram(sceneJson: any) {
    store.dispatch({
      type: "LOAD_PROJECT",
      sceneJSON: sceneJson,
    });
  }

  function selectItemInDiagram(selectedLineID: any) {
    let curLayerId = "";
    Object.values(curEnclosureDesignDiagramScene.layers).forEach(
      (layer: any) => {
        Object.values(layer.lines).forEach((line: any) => {
          if (line.id == selectedLineID) {
            curLayerId = layer.id;
          }
        });
      }
    );

    store.dispatch({
      type: "SELECT_LINE",
      layerID: curLayerId,
      lineID: selectedLineID,
    });
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

  function removeToolbar() {
    const toolbar = document.querySelector(".toolbar") as HTMLElement | null;
    if (toolbar) {
      //   toolbar.style.display = "none";
      toolbar.remove();
    }
  }

  function removeSidebar() {
    const sidebar = document.querySelector(".sidebar") as HTMLElement | null;
    if (sidebar) {
      //   sidebar.style.display = "none";
      sidebar.remove();
    }
  }

  function getBarriersList(scene: any) {
    // if (curEnclosureDesignDiagramScene == null) {
    //   return;
    // }
    let tempWallList: any = [];

    console.log(scene);
    Object.values(scene.layers).forEach((layer: any) => {
      Object.values(layer.lines).forEach((line: any) => {
        if (line.type == "wall") {
          tempWallList.push(line);
        }
      });
    });

    console.log("tempWallList!");
    console.log(tempWallList);
    setEnclosureWallList(tempWallList);
  }

  useEffect(() => {
    // Update curEnclosureBarrierList when enclosureWallList changes
    setCurEnclosureBarrierList(
      enclosureWallList?.map((wall: any) => ({
        wallName: wall.id,
        barrierType: null,
        remarks: "",
        selected: false,
      }))
    );
  }, [enclosureWallList]);

  if (curEnclosure?.designDiagramJsonUrl == null) {
    return (
      <div>
        <div className="text-title-xl">
          The current enclosure has no design diagram, thus no barrier data
        </div>
        <div className="text-lg">
          Please create a design diagram for the current enclosure first
        </div>
        <Button
          onClick={() =>
            navigate(
              `/enclosure/viewenclosuredetails/${curEnclosure.enclosureId}/safety`,
              { replace: true }
            )
          }
          className="w-1/3"
        >
          Return
        </Button>
      </div>
    );
  }

  function handleBarrierTypeChangeForWall(
    idx: number,
    barrierType: BarrierType | null
  ) {
    if (barrierType == null) {
      return;
    }
    const tempCurEnclosureBarrierList = [...curEnclosureBarrierList];
    tempCurEnclosureBarrierList[idx] = {
      ...tempCurEnclosureBarrierList[idx],
      barrierType,
    };
    setCurEnclosureBarrierList(tempCurEnclosureBarrierList);
  }

  function handleRemarkChangeForWall(idx: number, remarks: string | null) {
    if (remarks == null) {
      return;
    }
    const tempCurEnclosureBarrierList = [...curEnclosureBarrierList];
    tempCurEnclosureBarrierList[idx] = {
      ...tempCurEnclosureBarrierList[idx],
      remarks,
    };
    setCurEnclosureBarrierList(tempCurEnclosureBarrierList);
  }

  async function handleSubmit() {
    for (let barrier of curEnclosureBarrierList) {
      if (
        barrier.barrierType == null ||
        barrier.wallName == "" ||
        barrier.remarks == ""
      ) {
        toastShadcn({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Some fields are not filled in!",
        });
        return;
      }
    }

    for (let barrier of curEnclosureBarrierList) {
      const newEnclosureBarrier = {
        enclosureId: curEnclosure.enclosureId,
        wallName: barrier.wallName,
        barrierType: barrier.barrierType,
        remarks: barrier.remarks,
      };
      console.log(newEnclosureBarrier);

      const createEnclosureBarrierApi = async () => {
        try {
          const response = await apiJson.post(
            "http://localhost:3000/api/animal/createNewEnclosureBarrier",
            newEnclosureBarrier
          );
          // success
          toastShadcn({
            description: `Successfully created enclosure barriers!`,
          });
          const redirectUrl = `/enclosure/viewenclosuredetails/${curEnclosure.enclosureId}/safety`;
          navigate(redirectUrl);
        } catch (error: any) {
          // got error
          toastShadcn({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description:
              "An error has occurred while creating new enclosure barriers: \n" +
              error.message,
          });
        }
      };
      await createEnclosureBarrierApi();
    }
  }

  return (
    <div>
      {/* header */}
      <div className="flex flex-col">
        <div className="mb-4 flex justify-between">
          <Button
            variant={"outline"}
            type="button"
            className=""
            onClick={() => {
              navigate(-1);
            }}
          >
            Back
          </Button>
          <span className="self-center text-lg text-graydark">
            Create Enclosure Barriers
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

      {/* body */}
      {/* <Button onClick={() => loadDiagram(curEnclosureDesignDiagramScene)}>
        Load Diagram
      </Button> */}
      {/* <div>{selectedWallId}</div> */}
      <div className="mt-6">
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
      <div className="mt-6 flex flex-col gap-4">
        {curEnclosureBarrierList &&
          curEnclosureBarrierList.map((barrier, idx) => (
            <div
              key={barrier.wallName}
              className={`${
                barrier.selected
                  ? "border-4 border-zoovanna-green"
                  : "border-1 border-strokedark/20"
              } flex gap-12 rounded-md border p-4`}
            >
              <div className="w-1/6">
                ID: <br />
                {barrier.wallName}
                {/* <br />
                {barrier.selected.toString()} */}
              </div>
              <div className="w-2/6">
                <div>Select Barrier Type</div>
                <Dropdown
                  value={barrier.barrierType}
                  onChange={(e: DropdownChangeEvent) =>
                    handleBarrierTypeChangeForWall(idx, e.value)
                  }
                  options={barrierTypeOptions}
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select Barrier Type"
                  className="w-full"
                />
              </div>
              <div className="w-1/3">
                <div className="font-medium">Remarks:</div>
                <InputText
                  id="value"
                  name="value"
                  value={barrier.remarks}
                  className="w-full"
                  onChange={(e) => {
                    handleRemarkChangeForWall(idx, e.target.value);
                  }}
                />
              </div>
              <div className="flex items-center">
                <FaRegHandPointer
                  onClick={() => {
                    setSelectedWallId(barrier.wallName);
                    selectItemInDiagram(barrier.wallName);
                  }}
                  className="h-12 w-12 rounded-sm p-2 transition-all duration-150 hover:cursor-pointer hover:bg-zoovanna-green/40"
                />
              </div>
            </div>
          ))}
      </div>
      <div className="mt-6 flex justify-center">
        <Button
          disabled={apiJson.loading}
          className="h-12 w-2/3 rounded-full text-lg"
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}

export default CreateEnclosureBarriersForm;
