import React, { memo, useContext } from "react";
import PropTypes from "prop-types";
import { MdSettings, MdUndo, MdDirectionsRun } from "react-icons/md";
import { FaFile, FaMousePointer, FaPlus } from "react-icons/fa";
import ReactPlannerContext from "../../react-planner-context";
import ToolbarButton from "./toolbar-button";
import ToolbarSaveButton from "./toolbar-save-button";
import ToolbarLoadButton from "./toolbar-load-button";
import If from "../../utils/react-if";
import {
  MODE_IDLE,
  MODE_3D_VIEW,
  MODE_3D_FIRST_PERSON,
  MODE_VIEWING_CATALOG,
  MODE_CONFIGURING_PROJECT,
} from "../../constants";
import * as SharedStyle from "../../shared-style";

const iconTextStyle = {
  fontSize: "19px",
  textDecoration: "none",
  fontWeight: "bold",
  margin: "0px",
  userSelect: "none",
};

const Icon2D = ({ style }) => <p style={{ ...iconTextStyle, ...style }}>2D</p>;
const Icon3D = ({ style }) => <p style={{ ...iconTextStyle, ...style }}>3D</p>;

const ASIDE_STYLE = {
  backgroundColor: SharedStyle.PRIMARY_COLOR.main,
  padding: "10px",
};

const sortButtonsCb = (a, b) => {
  if (a.index === undefined || a.index === null) {
    a.index = Number.MAX_SAFE_INTEGER;
  }

  if (b.index === undefined || b.index === null) {
    b.index = Number.MAX_SAFE_INTEGER;
  }

  return a.index - b.index;
};

const mapButtonsCb = (el, ind) => {
  return (
    <If key={ind} condition={el.condition} style={{ position: "relative" }}>
      {el.dom}
    </If>
  );
};

const Toolbar = ({
  state,
  width,
  height,
  toolbarButtons,
  allowProjectFileSupport,
}) => {
  const { projectActions, viewer3DActions, translator } =
    useContext(ReactPlannerContext);

  let mode = state.get("mode");
  let alterate = state.get("alterate");
  let alterateColor = alterate ? SharedStyle.MATERIAL_COLORS[500].orange : "";

  let sorter = [
    // {
    //   index: 0, condition: allowProjectFileSupport, dom: <ToolbarButton
    //     active={false}
    //     tooltip={translator.t('New project')}
    //     onClick={event => confirm(translator.t('Would you want to start a new Project?')) ? projectActions.newProject() : null}>
    //     <FaFile />
    //   </ToolbarButton>
    // },
    // {
    //   index: 1,
    //   condition: allowProjectFileSupport,
    //   dom: <ToolbarSaveButton state={state} />,
    // },
    // {
    //   index: 2,
    //   condition: allowProjectFileSupport,
    //   dom: <ToolbarLoadButton state={state} />,
    // },
    {
      index: 3,
      condition: true,
      dom: (
        <ToolbarButton
          active={[MODE_VIEWING_CATALOG].includes(mode)}
          tooltip={translator.t("Open catalog")}
          onClick={(event) => projectActions.openCatalog()}
        >
          <FaPlus />
        </ToolbarButton>
      ),
    },
    // {
    //   index: 4, condition: true, dom: <ToolbarButton
    //     active={[MODE_3D_VIEW].includes(mode)}
    //     tooltip={translator.t('3D View')}
    //     onClick={event => viewer3DActions.selectTool3DView()}>
    //     <Icon3D />
    //   </ToolbarButton>
    // },
    {
      index: 5,
      condition: true,
      dom: (
        <ToolbarButton
          active={[MODE_IDLE].includes(mode)}
          tooltip={translator.t("2D View")}
          onClick={(event) => projectActions.setMode(MODE_IDLE)}
        >
          {[MODE_3D_FIRST_PERSON, MODE_3D_VIEW].includes(mode) ? (
            <Icon2D style={{ color: alterateColor }} />
          ) : (
            <FaMousePointer style={{ color: alterateColor }} />
          )}
        </ToolbarButton>
      ),
    },
    // {
    //   index: 6,
    //   condition: true,
    //   dom: (
    //     <ToolbarButton
    //       active={[MODE_3D_FIRST_PERSON].includes(mode)}
    //       tooltip={translator.t("3D First Person")}
    //       onClick={(event) => viewer3DActions.selectTool3DFirstPerson()}
    //     >
    //       <MdDirectionsRun />
    //     </ToolbarButton>
    //   ),
    // },
    {
      index: 7,
      condition: true,
      dom: (
        <ToolbarButton
          active={false}
          tooltip={translator.t("Undo (CTRL-Z)")}
          onClick={(event) => projectActions.undo()}
        >
          <MdUndo />
        </ToolbarButton>
      ),
    },
    {
      index: 8,
      condition: true,
      dom: (
        <ToolbarButton
          active={[MODE_CONFIGURING_PROJECT].includes(mode)}
          tooltip={translator.t("Configure project")}
          onClick={(event) => projectActions.openProjectConfigurator()}
        >
          <MdSettings />
        </ToolbarButton>
      ),
    },
  ];

  sorter = sorter.concat(
    toolbarButtons.map((Component, key) => {
      return Component.prototype //if is a react component
        ? {
            condition: true,
            dom: React.createElement(Component, { mode, state, key }),
          }
        : {
            //else is a sortable toolbar button
            index: Component.index,
            condition: Component.condition,
            dom: React.createElement(Component.dom, { mode, state, key }),
          };
    })
  );

  return (
    <aside
      style={{ ...ASIDE_STYLE, maxWidth: width, maxHeight: height }}
      className="toolbar"
    >
      {sorter.sort(sortButtonsCb).map(mapButtonsCb)}
    </aside>
  );
};

Toolbar.propTypes = {
  state: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  allowProjectFileSupport: PropTypes.bool.isRequired,
  toolbarButtons: PropTypes.array,
};

export default memo(Toolbar, (prevProps, nextProps) => {
  return (
    prevProps.state.mode === nextProps.state.mode &&
    prevProps.height === nextProps.height &&
    prevProps.width === nextProps.width &&
    prevProps.state.alterate === nextProps.state.alterate
  );
});
