interface OrderItem {
  orderItemId: number;
  verificationCode: string;
  isRedeemed: number;
  timeRedeemed?: Date | null;

  listingId: number;
}

export default OrderItem;
