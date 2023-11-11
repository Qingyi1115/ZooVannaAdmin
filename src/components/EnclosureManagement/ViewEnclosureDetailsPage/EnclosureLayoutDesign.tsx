import React, { useState, useEffect } from "react";
import Enclosure from "../../../models/Enclosure";
import EnclosureAnimalDatatable from "./EnclosureAnimalDatatable";

import { Button } from "@/components/ui/button";
import Animal from "../../../models/Animal";

import useApiJson from "../../../hooks/useApiJson";
import { NavLink, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface EnclosureLayoutDesignProps {
  curEnclosure: Enclosure;
}
function EnclosureLayoutDesign(props: EnclosureLayoutDesignProps) {
  const { curEnclosure } = props;

  const apiJson = useApiJson();
  const navigate = useNavigate();

  return (
    <div>
      <Button
        onClick={() =>
          navigate("/enclosure/viewenclosuredetails/enclosuredesigndiagram")
        }
      >
        View Design Diagram
      </Button>
      EnclosureLayoutDesign
    </div>
  );
}

export default EnclosureLayoutDesign;
