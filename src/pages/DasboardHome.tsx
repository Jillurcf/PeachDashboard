import React, { useState } from "react";
import RevenueChart from "../component/dashHome/RevenuuesChart";
import Status from "../component/dashHome/Status";
import SelectBox from "../component/share/SelectBox";
import SellerActivityChart from "../component/manageUsers/SellerActivityChart";
import { useChartDatasQuery } from "../redux/features/getDashChartData";

type Props = {};
const selectOptions = [
  { value: "1", label: "Last week" },
  { value: "2", label: "Last Month" },
  { value: "3", label: "Last Year" },
];
const DasboardHome = (props: Props) => {
  const [selectedValue, setSelectedValue] = useState();
  const {data: chartData} = useChartDatasQuery();
console.log("23",chartData?.data?.created_community)
  const handleSelectChange = (value: string) => {
    setSelectedValue(value);
    console.log("Selected", value);
  };
  return (
    <>
      <Status />
      <div className="flex gap-4">
        <div className=" h-[350px] w-full mt-8 justify-center bg-white rounded-2xl">
          <div className="flex justify-between w-full px-6">
            <div className="text-lg font-bold py-4">Overview</div>
            {/* <div>
              <SelectBox
                placeholder="Last week"
                options={selectOptions}
                onChange={handleSelectChange}
                style={{ width: 150 }}
              />
            </div> */}
          </div>
          <SellerActivityChart />
        </div>
        {/* <div className=" h-[350px] w-1/2 mt-8 justify-center bg-white rounded-2xl">
          <div className="flex justify-between w-full px-6">
            <div className="text-lg font-bold">Clubs</div>
            <div>
              <SelectBox
                placeholder="Last week"
                options={selectOptions}
                onChange={handleSelectChange}
                style={{ width: 150 }}
              />
            </div>
          </div>
          
        </div> */}
      </div>
    </>
  );
};

export default DasboardHome;
