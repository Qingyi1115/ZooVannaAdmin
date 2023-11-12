import { Outlet } from "react-router-dom";
import EnclosureContextProvider from "../../context/EnclosureContext";

function EnclosureContextLayout() {
  return (
    <EnclosureContextProvider>
      <Outlet />
    </EnclosureContextProvider>
  );
}

export default EnclosureContextLayout;
