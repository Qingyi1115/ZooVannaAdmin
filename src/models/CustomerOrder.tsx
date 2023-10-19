import { OrderStatus } from "../enums/OrderStatus";
import { PaymentStatus } from "../enums/PaymentStatus";

interface CustomerOrder {
  customerOrderId: number;
  bookingReference: string;
  totalAmount: number;
  orderStatus: OrderStatus;
  entryDate: Date;
  customerFirstName: string;
  customerLastName: string;
  customerContactNo: string;
  customerEmail: string;
  paymentStatus: PaymentStatus;
  createdAt: Date;
}

export default CustomerOrder;
