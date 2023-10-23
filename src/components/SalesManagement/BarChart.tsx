import React from 'react';
import { Bar } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';

interface BarChartProps {
  data: any;
  groupBy: string[];
}

const BarChart: React.FC<BarChartProps> = ({ data, groupBy }) => {
  const chartData = generateChartData(data, groupBy);

  return (
    <div>
      <h2>Bar Chart</h2>
      <div style={{ height: '400px' }}>
        <Bar data={chartData.data} options={chartData.options} />
      </div>
    </div>
  );
};

function generateChartData(
  data: any,
  groupBy: string[]
): { data: ChartData; options: ChartOptions } {
  if (groupBy.length === 0) {
    // If groupBy has no selected options, return the number of OrderItem in orderItems
    return {
      data: {
        labels: ["Total"],
        datasets: [
          {
            label: "Total",
            data: [data.length],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    };
  }

  const labels: string[] = [];
  const datasets: ChartDataset[] = [];

  // Check the index of "month" and "listingId" in the groupBy array
  const monthIndex = groupBy.indexOf("month");
  const listingIdIndex = groupBy.indexOf("listingId");

  if (monthIndex !== -1) {
    const months = Object.keys(data);
    if (listingIdIndex !== -1) {
      // If both "month" and "listingId" are in groupBy
      if (listingIdIndex < monthIndex) {
        // Grouping by [listingId, month] - listingId first
        for (const listingId of Object.keys(data)) {
          const listingData = data[listingId];
          const monthData = listingData || {}; // Ensure the month data exists
          const monthValues = months.map((month) => monthData[month] || 0);
          datasets.push({
            label: `Listing ID ${listingId}`,
            data: monthValues,
          });
        }
      } else {
        // Grouping by [month, listingId] - month first
        labels.push(...months.map((month) => `Month ${month}`));

        for (const month of months) {
          const listingData = data[month];
          const listingIds = Object.keys(listingData || {}); // Ensure the listing data exists
          datasets.push({
            label: `Month ${month}`,
            data: listingIds.map((listingId) => listingData[listingId]),
          });
        }
      }
    } else {
      // Grouping by "month" only
      labels.push(...months.map((month) => `Month ${month}`));

      for (const month of months) {
        const value = data[month];
        datasets.push({
          label: `Month ${month}`,
          data: value || 0,
        });
      }
    }
  } else if (listingIdIndex !== -1) {
    // Grouping by "listingId" only
    const listingIds = Object.keys(data);
    labels.push(...listingIds.map((listingId) => `Listing ID ${listingId}`));

    datasets.push({
      label: "Data",
      data: listingIds.map((listingId) => data[listingId]),
    });
  }

  const chartData: { data: ChartData; options: ChartOptions } = {
    data: {
      labels,
      datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  };

  return chartData;
}
