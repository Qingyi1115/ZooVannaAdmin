
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { HiChevronRight } from "react-icons/hi";
import { NavLink } from "react-router-dom";
import Enclosure from "../../../models/Enclosure";

interface EnclosureCardProps {
  curEnclosure: Enclosure;
}

function EnclosureCard() {
  //   const { curEnclosure } = props;
  return (
    <NavLink to={`/enclosure/viewenclosuredetails/`}>
      <Card className="w-full transition-all hover:bg-muted/50">
        <CardContent className="h-full px-4 pb-4 pt-3">
          <div className="mb-2 text-sm font-bold text-slate-700">Enclosure</div>
          <div className="flex items-center gap-4">
            <img
              alt={""}
              // src={"http://localhost:3000/"}
              src="../../../../src/assets/enclosureIconPlaceholder.jpg"
              className="aspect-square w-20 rounded-full border border-white object-cover shadow-4"
            />
            <div>
              {/* <div className="text-lg font-bold">{curSpecies.commonName}</div>
              <div>{curSpecies.scientificName}</div> */}
              Enclosure Name
            </div>
            <div className="ml-auto flex items-center">
              View details <HiChevronRight className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </NavLink>
  );
}

export default EnclosureCard;
