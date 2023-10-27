import BarChart from "../../components/SalesManagement/BarChart";
import AllCustomerOrdersDatatable from "../../components/CustomerOrderManagement/AllCustomerOrdersDatatable";
import { useState } from "react";
import { Calendar, CalendarChangeEvent } from "primereact/calendar";
import RevenueChartFinal from "../../components/SalesManagement/RevenueChartFinal";

function SalesChartPage() {
  const [startDate, setStartDate] = useState<Date>(
    new Date(new Date().setMonth(new Date().getMonth() - 3))
  );
  const [endDate, setEndDate] = useState<Date>(
    new Date(new Date().setMonth(new Date().getMonth() + 3))
  );

  const handleEndDateChange = (e: CalendarChangeEvent) => {
    if (e.value !== null) {
      // Get the current date
      const selectedDate = new Date(e.value as Date);

      // Set the date to the last day of the month
      selectedDate.setMonth(selectedDate.getMonth() + 1, 0);

      // Update the state with the last day of the month
      setEndDate(selectedDate);
    }
  };
  return (
    <div className="p-10">
      <div className="flex w-full flex-col gap-6 rounded-lg border border-stroke bg-white p-10 text-black shadow-default">
        <div className="mb-4 flex justify-between">
          <span className="self-center text-title-xl font-bold">
            Sales Graph
          </span>
        </div>
        <div className="mb-6 flex flex-col justify-start gap-6 lg:flex-row lg:gap-12">
          {/* Start Date */}
          <div className="card justify-content-centre flex flex-col">
            <div>Start Month</div>
            <Calendar
              style={{ flexGrow: 1 }}
              value={startDate}
              onChange={(e: CalendarChangeEvent) => {
                if (e.value !== null) {
                  const selectedStartDate = new Date(e.value as Date);
                  setStartDate(selectedStartDate);
                }
              }}
              view="month"
              dateFormat="mm/yy"
            />
          </div>
          {/* End Date */}
          <div className="card justify-content-center flex flex-col">
            <div>End Month</div>
            <Calendar
              style={{ flexGrow: 1 }}
              value={endDate}
              onChange={handleEndDateChange}
              view="month"
              dateFormat="mm/yy"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-6 py-6">
        <div className="w-1/2" id="barChartContainer">
          <div className="h-full rounded-lg border border-stroke bg-white p-10 text-black shadow-default">
            <BarChart startDate={startDate} endDate={endDate} />
          </div>
        </div>
        <div className="w-1/2" id="revenueChartContainer">
          <div className="h-full rounded-lg border border-stroke bg-white p-10 text-black shadow-default">
            <RevenueChartFinal startDate={startDate} endDate={endDate} />
          </div>
        </div>
      </div>
    </div>

  );
}

export default SalesChartPage;
