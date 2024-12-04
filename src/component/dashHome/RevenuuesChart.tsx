import React, { useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Title from "../share/Title";
import SelectBox from "../share/SelectBox";

// Define the type for each data point
interface DataPoint {
  name: string;
  amt: number;
}

const data: DataPoint[] = [
  { name: "Jan", amt: 7000 },
  { name: "Feb", amt: 5000 },
  { name: "Mar", amt: 9000 },
  { name: "Apr", amt: 9500 },
  { name: "May", amt: 8010 },
  { name: "Jun", amt: 10000 },
  { name: "Jul", amt: 9000 },
  { name: "Aug", amt: 8500 },
  { name: "Sep", amt: 9000 },
  { name: "Oct", amt: 12000 },
  { name: "Nov", amt: 13000 },
  { name: "Dec", amt: 14000 },
];

const RevenueChart: React.FC = () => {
  const [selectedValue, setSelectedValue] = useState<string | undefined>();
  const formatYAxis = (tickItem) => {
    // Display the Y-axis values in the format of 0k, 2k, 4k, etc.
    return `${tickItem / 1000}k`;
  };

const handleSelectChange = (value: string) => {
  setSelectedValue(value);
  console.log('Selected', value);

}
const selectOptions =[
  { value: '1', label: 'revenue' },
  { value: '2', label: 'Month' },
  { value: '3', label: 'Year' },
]
  return (
    <div className="bg-[#FFFFFF] rounded-2xl mt-2 p-2 text-gray-300 pr-14">
      <div className="flex justify-between">
        <Title className="mb-5">Statics Analytics</Title>
        <SelectBox
        options={selectOptions}
        placeholder="Revenue"
        onChange={handleSelectChange}
        style={{width: 100}}
      />
      </div>
      <Title className="mb-5">Revenue</Title>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} syncId="anyId">
          <defs>
            <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00D6FF" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#00D6FF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis axisLine={false} dataKey="name" />
          <YAxis
          axisLine={false}
          
           tickFormatter={formatYAxis} 
           ticks={[0, 2000, 4000, 6000, 8000, 10000, 12000, 14000]} // Custom tick values including 12k
          //  domain={[0, Math.max(...dashEarnChart.map(item => item.totalEarnings || 0))]} // Set the domain to match the custom ticks
           interval={0} // Ensure that all tick values are shown
          />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="amt"
            stroke="url(#colorAmt)"
            fill="url(#colorAmt)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
