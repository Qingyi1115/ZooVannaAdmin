import AllAnimalsDatatable from "../../components/AnimalManagement/ViewAllAnimalsPage/AllAnimalsDatatable";

function ViewAllAnimalsPage() {
  return (
    <div className="p-10">
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-10 text-black shadow-default">
        <AllAnimalsDatatable />
      </div>
    </div>
  );
}

export default ViewAllAnimalsPage;
