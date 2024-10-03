import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { useMemberStoreN } from "../../global/indexedDB/store";
import { useSubscriptionStore } from "../members/components/subscription/store";

const Dashboard = () => {
  const { members, fetchMembers } = useMemberStoreN();
  const { fetchSubscriptions } = useSubscriptionStore();
  const [running, setRunning] = useState(0);
  const [expired, setExpired] = useState(0);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  useEffect(() => {
    const checkExpires = async () => {
      const updatedMembers = await Promise.all(
        members?.map(async (i) => {
          const res = await fetchSubscriptions(i?.id?.toString());
          const rev = res?.sort((a, b) => {
            return (
              new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
            );
          });
          i.membership = rev[0]?.state || "pending";
          return i;
        }) || []
      );
      return updatedMembers;
    };

    const handleFiltering = async () => {
      const updatedMembers = await checkExpires();
      const mem = updatedMembers?.reverse()?.filter((i) => !i?.isDeleted);

      setRunning(mem?.filter((i) => i.membership === "active").length);
      setExpired(mem?.filter((i) => i.membership !== "active").length);
    };

    handleFiltering();
  }, [members]);

  const activeMembers = members?.filter((i) => !i.isDeleted)?.length;
  const deactivatedMembers = members?.filter((i) => i.isDeleted)?.length;

  // Data for BarChart
  const barData = [
    { name: "Running", value: running },
    { name: "Expired", value: expired }
  ];

  // Data for PieChart
  const pieData = [
    { name: "Active", value: activeMembers },
    { name: "Deactivated", value: deactivatedMembers }
  ];

  const COLORS = ["#0088FE", "#FF8042"]; // Blue and Orange

  return (
    <div className="w-full h-full p-6 bg-gray-900">
      {/* Cards Section */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {/* card */}
        <div className="card p-6 bg-gray-800 shadow-lg rounded-lg transform hover:scale-105 transition-transform">
          <div className="text-center font-bold text-gray-200 text-xl mb-4">
            Members
          </div>
          <span className="text-center block font-bold text-3xl text-white">
            {members?.length}
          </span>
        </div>

        {/* card */}
        <div className="card p-6 bg-gray-800 shadow-lg rounded-lg transform hover:scale-105 transition-transform">
          <div className="text-center font-bold text-gray-200 text-xl mb-4">
            Running Membership
          </div>
          <span className="text-center block font-bold text-3xl text-green-400">
            {running}
          </span>
        </div>

        {/* card */}
        <div className="card p-6 bg-gray-800 shadow-lg rounded-lg transform hover:scale-105 transition-transform">
          <div className="text-center font-bold text-gray-200 text-xl mb-4">
            Expired Membership
          </div>
          <span className="text-center block font-bold text-3xl text-red-400">
            {expired}
          </span>
        </div>

        {/* card */}
        <div className="card p-6 bg-gray-800 shadow-lg rounded-lg transform hover:scale-105 transition-transform">
          <div className="text-center font-bold text-gray-200 text-xl mb-4">
            Active Members
          </div>
          <span className="text-center block font-bold text-3xl text-blue-400">
            {activeMembers}
          </span>
        </div>

        {/* card */}
        <div className="card p-6 bg-gray-800 shadow-lg rounded-lg transform hover:scale-105 transition-transform">
          <div className="text-center font-bold text-gray-200 text-xl mb-4">
            Deactivated Members
          </div>
          <span className="text-center block font-bold text-3xl text-gray-400">
            {deactivatedMembers}
          </span>
        </div>
      </div>

      {/* Graph Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Bar Chart for Running and Expired Memberships */}
        <div className="p-6 bg-gray-800 shadow-lg rounded-lg">
          <h3 className="text-xl font-bold text-gray-200 text-center mb-4">
            Membership Status
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip
                wrapperStyle={{ backgroundColor: "#333", borderRadius: "5px" }}
              />
              <Legend wrapperStyle={{ color: "#ccc" }} />
              <Bar dataKey="value">
                {barData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.name === "Running" ? "#82ca9d" : "#FF8041"} // Green for Running, Red for Expired
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart for Active vs Deactivated Members */}
        <div className="p-6 bg-gray-800 shadow-lg rounded-lg">
          <h3 className="text-xl font-bold text-gray-200 text-center mb-4">
            Member Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
              >
                {pieData?.map((entry, index) => (
                  <React.Fragment key={`cell-${index}`}>
                    <Cell fill={COLORS[index % COLORS.length]} />
                    <div className="text-center hidden">{entry.name}</div>
                  </React.Fragment>
                ))}
              </Pie>
              <Tooltip
                wrapperStyle={{ backgroundColor: "#333", borderRadius: "5px" }}
              />
              <Legend wrapperStyle={{ color: "#ccc" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
