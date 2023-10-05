interface Promotion {
  promotionId: number;
  title: string;
  description: string;
  publishDate: Date;
  startDate: Date;
  endDate: Date;
  percentage: number;
  minimumSpending: number;
  promotionCode: string;
  maxRedeemNum: number;
  currentRedeemNum: number;
  imageUrl: string;

  //   customerOrder?: CustomerOrder[];
}

export default Promotion;
