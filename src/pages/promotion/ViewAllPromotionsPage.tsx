import AllPromotionDatatable from "../../components/Promotion/AllPromotionDatatable";

function ViewAllPromotionsPage() {
    return (
      <div className="p-10">
        <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-10 text-black shadow-default">
          <AllPromotionDatatable />
        </div>
      </div>
    );
  }
  
  export default ViewAllPromotionsPage;