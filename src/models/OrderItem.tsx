
interface OrderItem {
  orderItemId: number;
  verificationCode: string;
  isRedeemed: boolean;
  timeRedeemed?: Date | null;

  listingId: number;
}

export default OrderItem;
