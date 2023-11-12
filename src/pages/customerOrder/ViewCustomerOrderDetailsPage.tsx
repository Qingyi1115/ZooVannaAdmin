import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ViewCustomerOrderDetails from "../../components/CustomerOrderManagement/ViewCustomerOrderDetails";
import ViewOrderItemDetails from "../../components/CustomerOrderManagement/ViewOrderItemDetails";
import useApiJson from "../../hooks/useApiJson";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { OrderStatus } from "../../enums/OrderStatus";
import { PaymentStatus } from "../../enums/PaymentStatus";
import CustomerOrder from "../../models/CustomerOrder";

function ViewEmployeeDetailsPage() {
  const apiJson = useApiJson();

  let emptyCustomerOrder: CustomerOrder = {
    customerOrderId: -1,
    bookingReference: "",
    totalAmount: 0,
    orderStatus: OrderStatus.COMPLETED,
    entryDate: new Date(),
    customerFirstName: "",
    customerLastName: "",
    customerContactNo: "",
    customerEmail: "",
    paymentStatus: PaymentStatus.COMPLETED,
    createdAt: new Date(),
    orderItems: [],
  };

  const { customerOrderId } = useParams<{ customerOrderId: string }>();
  const [curCustomerOrder, setCurCustomerOrder] =
    useState<CustomerOrder>(emptyCustomerOrder);
  const navigate = useNavigate();
  const [refreshSeed, setRefreshSeed] = useState<number>(0);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const responseJson = await apiJson.post(
          `http://localhost:3000/api/customerOrder/getOrderById/${customerOrderId}`,
          { includes: ["orderItems"] }
        );
        console.log(responseJson);
        setCurCustomerOrder(responseJson as CustomerOrder);
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchOrder();
  }, [refreshSeed]);

  return (
    <div className="p-10">
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-10 text-black shadow-default">
        {curCustomerOrder && curCustomerOrder.customerOrderId != -1 && (
          <div className="flex flex-col">
            <div className="flex flex-col">
              <div className="mb-4 flex justify-between">
                <Button
                  variant={"outline"}
                  type="button"
                  onClick={() => navigate(-1)}
                  className=""
                >
                  Back
                </Button>
                <span className="self-center text-lg text-graydark">
                  Customer Order Details
                </span>
                <Button disabled className="invisible">
                  Back
                </Button>
              </div>
              <Separator />
              {/* <span className="mt-4 self-center text-title-xl font-bold">
                {curCustomerOrder.bookingReference}
              </span> */}
            </div>
            <Accordion type="multiple">
              <AccordionItem value="item-1">
                <AccordionTrigger>Order Information</AccordionTrigger>
                <AccordionContent>
                  <ViewCustomerOrderDetails
                    curCustomerOrder={curCustomerOrder}
                  />
                </AccordionContent>
              </AccordionItem>
              {/*<AccordionItem value="item-2">
                    <AccordionTrigger>Species Educational Content</AccordionTrigger>
                    <AccordionContent>
                      <SpeciesEduContentDetails curSpecies={curSpecies} />
                    </AccordionContent>
                    </AccordionItem>*/}
            </Accordion>
            <div className="mt-3">
              <h2 className="flex flex-1 items-center justify-between rounded-lg px-2 py-4 font-bold">
                Entry Details
              </h2>
              <ViewOrderItemDetails curCustomerOrder={curCustomerOrder} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewEmployeeDetailsPage;
