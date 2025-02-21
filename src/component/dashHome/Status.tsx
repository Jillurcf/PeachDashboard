import React, { useState } from "react";
import SelectBox from "../share/SelectBox";
import { FaArrowTrendUp } from "react-icons/fa6";
import './Style_dashboard.css';
import { useGetDashboardQuery } from "../../redux/features/getDashboardApi";

interface CardDataItem {
  id: number;
  value: string | number;
  title: string;
  description?: string;
}

const Status: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [selectedValue, setSelectedValue] = useState<string | undefined>();
  const { data, isLoading, isError, error } = useGetDashboardQuery({});
console.log("18", data?.data)
  // Convert the API data into an array format for mapping
  const cardDataa: CardDataItem[] =  [
        { id: 1, value: data?.data?.totalUsers, title: "Total Users", description: "Total registered users" },
        { id: 2, value: data?.data?.totalMatch, title: "Total Match", description: "Total Matches" },
        { id: 3, value: data?.data?.totalReport, title: "Total Reports", description: "Total Reports" },
      
      ]
    // : [];
    // console.log("28",cardDataa);
  const handleCardClick = (cardIndex: number) => {
    setSelectedCard(cardIndex);
  };

  const handleSelectChange = (value: string) => {
    setSelectedValue(value);
    console.log("Selected:", value);
  };

  const selectOptions = [
    { value: '1', label: 'Week' },
    { value: '2', label: 'Month' },
    { value: '3', label: 'Year' },
  ];
console.log("44", cardDataa);
  return (
    <div className="bg-[#FFFFFF] p-6 rounded-xl">
      <div className="flex justify-between w-full">
        <div>
          <h1 className="text-xl py-4 font-bold text-[#5D5D5D]">Overview</h1>
          {/* <p className="text-[#5D5D5D]">Activities summary at a glance</p> */}
        </div>
        {/* <div className="pr-8">
          <SelectBox
            options={selectOptions}
            placeholder="Week"
            onChange={handleSelectChange}
            style={{ width: 100 }}
          />
        </div> */}
      </div>
      <div className="grid grid-cols-3 w-[calc(100% -300px)] mt-[12px]">
        {cardDataa.map((card, index) => (
          <div
            key={card.id}
            className={`2xl:w-[480px] xl:w-[200px] lg:w-[150px] w-[450px] h-[210px] px-[20px] py-[32px] flex justify-between items-center rounded-2xl cursor-pointer ${
              selectedCard === index ? 'bg-[#02B5AA] text-[#E8EBF0]' : 'border border-[#E7E7E7]'
            }`}
            onClick={() => handleCardClick(index)}
          >
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-secondary py-4 text-[34px] font-bold">{card.value}</h1>
                {/* <FaArrowTrendUp color={selectedCard === index ? "white" : "#28A745"} size={20} /> */}
              </div>
              <h1 className="text-[16px] font-bold">{card.title}</h1>
              {/* <p>{card.description}</p> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Status;
