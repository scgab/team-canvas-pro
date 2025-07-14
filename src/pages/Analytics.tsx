import { Layout } from "@/components/Layout";
import { GanttChart } from "@/components/GanttChart";

const Analytics = () => {
  return (
    <Layout>
      <div className="p-6">
        <GanttChart />
      </div>
    </Layout>
  );
};

export default Analytics;