
import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import useApiJson from "../../hooks/useApiJson";

import { HiPlus } from "react-icons/hi";
import AllEnclosuresDatatable from "../../components/EnclosureManagement/ViewAllEnclosurePage/AllEnclosuresDatatable";
import { useAuthContext } from "../../hooks/useAuthContext";

function ViewAllEnclosuresPage() {
  const apiJson = useApiJson();
  const navigate = useNavigate();
  const toastShadcn = useToast().toast;
  const employee = useAuthContext().state.user?.employeeData;

  return (
    <div className="p-10">
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-10 text-black shadow-default">
        {/* Header */}
        <div className="flex flex-col">
          <div className="mb-4 flex justify-between">
            {(employee.superAdmin ||
              employee.planningStaff?.plannerType == "CURATOR") ? (
              <Button
                onClick={() => navigate("/enclosure/createnewenclosure/")}
                type="button"
              >
                <HiPlus className="mr-auto" />
                Add Enclosure
              </Button>) : (
              <Button disabled className="invisible">
                Back
              </Button>)}
            <span className="self-center text-title-xl font-bold">
              All Enclosures
            </span>
            <Button disabled className="invisible">
              Back
            </Button>

          </div>
          <Separator />
        </div>

        {/*  */}
        <AllEnclosuresDatatable />
      </div>
    </div>
  );
}

export default ViewAllEnclosuresPage;
