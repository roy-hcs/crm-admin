import { AreaChart } from '@/components/charts/AreaCharts';
import { BarChart } from '@/components/charts/BarCharts';
import { LineChart } from '@/components/charts/LineCharts';
import { PieChart } from '@/components/charts/PieCharts';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

const LineChartExample: FC = () => {
  const exampleData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Sales 2023',
        data: [12, 19, 3, 5, 2, 3],
      },
      {
        label: 'Sales 2022',
        data: [8, 15, 7, 9, 12, 10],
      },
    ],
  };

  return (
    <LineChart
      labels={exampleData.labels}
      datasets={exampleData.datasets}
      title="Monthly Sales Comparison"
    />
  );
};

const BarChartExample: FC = () => {
  const exampleData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'My First Dataset',
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(201, 203, 207, 0.2)',
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
          'rgb(201, 203, 207)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <BarChart
      labels={exampleData.labels}
      datasets={exampleData.datasets}
      title="Product Sales"
      height={300}
    />
  );
};

const PieChartExample: FC = () => {
  const exampleData = {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  return (
    <PieChart
      labels={exampleData.labels}
      datasets={exampleData.datasets}
      title="Distribution of Colors"
      height={300}
    />
  );
};

const AreaChartExample: FC = () => {
  const exampleData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Traffic 2023',
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        data: [1200, 1900, 1500, 2500, 2200, 3000],
      },
      {
        label: 'Traffic 2022',
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        data: [800, 900, 700, 1000, 1200, 1500],
      },
      {
        label: 'Traffic 2021',
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
        data: [600, 800, 500, 700, 900, 1100],
      },
    ],
  };

  return (
    <AreaChart
      labels={exampleData.labels}
      datasets={exampleData.datasets}
      title="Website Traffic Comparison"
      stacked={false}
    />
  );
};

export function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="bg-card rounded-lg p-6 shadow">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">{t('dashboard')}</h2>
      </div>

      <div className="mb-6">
        <h2>charts</h2>
        <div className="grid grid-cols-2 gap-6">
          <LineChartExample />
          <BarChartExample />
          <PieChartExample />
          <AreaChartExample />
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Stats Cards */}
        <div className="bg-background border-border rounded-lg border p-4 shadow-sm">
          <h3 className="text-muted-foreground text-lg font-medium">Total Customers</h3>
          <p className="text-3xl font-bold">1,256</p>
          <p className="mt-2 text-sm text-green-500">+12% from last month</p>
        </div>

        <div className="bg-background border-border rounded-lg border p-4 shadow-sm">
          <h3 className="text-muted-foreground text-lg font-medium">Revenue</h3>
          <p className="text-3xl font-bold">$34,256</p>
          <p className="mt-2 text-sm text-green-500">+8% from last month</p>
        </div>

        <div className="bg-background border-border rounded-lg border p-4 shadow-sm">
          <h3 className="text-muted-foreground text-lg font-medium">Active Projects</h3>
          <p className="text-3xl font-bold">23</p>
          <p className="mt-2 text-sm text-red-500">-2 from last month</p>
        </div>
      </div>

      {/* Main content */}
      <div className="bg-background border-border rounded-lg border p-6">
        <h3 className="mb-4 text-xl font-semibold">Welcome to the Dashboard!</h3>
        <p className="text-muted-foreground">
          This is the main dashboard area of your CRM application. Here you'll find key metrics and
          quick access to important features.
        </p>
      </div>
    </div>
  );
}
