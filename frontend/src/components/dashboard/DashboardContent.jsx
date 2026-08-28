import DashboardHeader from "./DashboardHeader";
import DashboardCards from "./DashboardCards";
import DashboardStats from "./DashboardStats";
import DashboardCharts from "./DashboardCharts";
import DashboardFooter from "./DashboardFooter";

export default function DashboardContent() {
  return (
    <div className="space-y-6">
      <DashboardHeader />
      <DashboardCards />
      <DashboardStats />
      <DashboardCharts />
      <DashboardFooter />
    </div>
  );
}
