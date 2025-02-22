import { Button, Spin, Alert } from "antd";
import React, { useState, useEffect } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useGetTermsAndConditionQuery } from "../redux/features/getTermsAndConditionApi";

const SettingsTermsAndConditions = () => {
  const navigate = useNavigate();

  // Mock data for Terms and Conditions
  const mockData = {
    content: "These are the terms and conditions of our service. By using this service, you agree to the following terms..."
  };

  const [content, setContent] = useState<string | null>(null);
  // const [isLoading, setIsLoading] = useState<boolean>(true);
  // const [isError, setIsError] = useState<boolean>(false);
  const {data, isLoading, isError} = useGetTermsAndConditionQuery({})

  // Simulate loading and error states
  useEffect(() => {
    setTimeout(() => {
      // Simulate data fetching
      try {
        setContent(data?.termsAndConditions?.content || "");;
        // setIsLoading(false);
      } catch (error) {
        console.log(error)
      }
    }, 1000);
  }, []);

  const handleBackSettings = () => {
    navigate("/settings/personalInformation");
  };

  const handleEdit = () => {
    console.log("Edit button clicked");
    navigate(`/settings/termsAndCondition/edittermsAndConditions`);
  };

  if (isLoading) {
    return <Spin tip="Loading..." className="flex justify-center mt-10" />;
  }

  if (isError) {
    return (
      <Alert
        message="Error"
        description="Failed to load content."
        type="error"
        showIcon
      />
    );
  }

  // Check if data or content is missing
  const noData = !content || content.trim() === "";

  return (
    <div className="w-[79vw]">
      <div>
        <div
          onClick={handleBackSettings}
          className="border-none text-[#193664] flex items-center gap-2 cursor-pointer"
        >
          <IoIosArrowBack />
          Terms & Conditions
        </div>
      </div>
      <div className="pl-10 text-justify py-12">
        {noData ? (
          <p>No data found</p>
        ) : (
          <p>{content}</p>
        )}
      </div>
      <div className="flex justify-end">
        <Button
          onClick={handleEdit}
          style={{
            backgroundColor: "#193664",
            color: "#fff",
            height: "56px",
          }}
          htmlType="submit"
          className="w-[300px] h-[56px] py-4 mt-2 text-white hover:border-none border-none rounded-lg"
        >
          Edit
        </Button>
      </div>
    </div>
  );
};

export default SettingsTermsAndConditions;
