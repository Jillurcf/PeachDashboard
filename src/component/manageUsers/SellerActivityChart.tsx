import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type Props = {};

const mockData = [
  { month: "January", Users: 40, Subscribers: 20 },
  { month: "February", Users: 30, Subscribers: 25 },
  { month: "March", Users: 50, Subscribers: 35 },
  { month: "April", Users: 70, Subscribers: 50 },
  { month: "May", Users: 60, Subscribers: 45 },
  { month: "June", Users: 80, Subscribers: 60 },
  { month: "July", Users: 90, Subscribers: 70 },
  { month: "August", Users: 100, Subscribers: 85 },
  { month: "September", Users: 110, Subscribers: 95 },
  { month: "October", Users: 120, Subscribers: 100 },
  { month: "November", Users: 130, Subscribers: 110 },
  { month: "December", Users: 140, Subscribers: 120 },
];

const SellerActivityChart = (props: Props) => {
  const [opacity, setOpacity] = React.useState({
    Users: 1,
    Subscribers: 1,
  });

  const handleMouseEnter = (o) => {
    const { dataKey } = o;
    setOpacity((op) => ({ ...op, [dataKey]: 0.5 }));
  };

  const handleMouseLeave = (o) => {
    const { dataKey } = o;
    setOpacity((op) => ({ ...op, [dataKey]: 1 }));
  };

  return (
    <div style={{ width: "100%" }}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={mockData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
          <Line
            type="monotone"
            dataKey="Users"
            strokeOpacity={opacity.Users}
            stroke="#82ca9d"
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="Subscribers"
            strokeOpacity={opacity.Subscribers}
            stroke="#8884d8"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SellerActivityChart;
