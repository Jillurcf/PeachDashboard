import { Button } from "antd";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import JoditEditor from "jodit-react";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import React from "react";
import { useGetTermsAndConditionQuery } from "../redux/features/getTermsAndConditionApi";
import { usePostTermsAndConditionMutation } from "../redux/features/postTermsAndCondition";

const EditTermsAndCondition: React.FC = () => {
  const navigate = useNavigate();
  const editor = useRef(null);
  const [content, setContent] = useState<string>("");
  const { data, isLoading, isError } = useGetTermsAndConditionQuery({});
  // console.log("TermsAndCondition", data?.termsAndConditions?.content)
  const [postTermsAndCondition] = usePostTermsAndConditionMutation();

  useEffect(() => {
    // Load initial data (simulating fetching data)
    setContent(data?.termsAndConditions?.content || "");
  }, []);

  const handleUpdate = async () => {
    try {
      // Simulate cleaning and updating content
      const div = document.createElement("div");
      div.innerHTML = content;
      const cleanedContent = div.textContent || div.innerHTML || "";

      // Simulate successful update
      console.log("Updated Content:", cleanedContent);
      try {
        const formData = new FormData()
        formData.append("content", cleanedContent)
      const res = await postTermsAndCondition(formData)
      console.log("termsandConditionRes", res)
      } catch (error) {
        console.log(error);
      }
      Swal.fire({
        position: "top-center",
        icon: "success",
        title: "Terms and Conditions updated successfully!",
        showConfirmButton: false,
        timer: 1500,
      });

      navigate("/settings/termsAndCondition");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Try Again...",
        text: "An error occurred while updating the terms and conditions.",
        footer: '<a href="#">Why do I have this issue?</a>',
      });
    }
  };

  const handleBackTermsAndCondition = () => {
    navigate("/settings/termsAndCondition");
  };

  return (
    <div className="relative ml-[24px] bg-white p-6 rounded-lg shadow-lg">
      <div
        onClick={handleBackTermsAndCondition}
        className="mt-[8px] cursor-pointer flex items-center pb-3 gap-2"
      >
        <MdOutlineKeyboardArrowLeft size={34} />
        <h1 className="text-[24px] font-semibold">Edit Terms & Condition</h1>
      </div>
      <div className="text-justify relative">
        <JoditEditor
          ref={editor}
          value={content}
          onChange={(newContent) => setContent(newContent)}
        />
        <Button
          onClick={handleUpdate}
          style={{
            backgroundColor: "#193664",
            color: "#fff",
            height: "56px",
          }}
          block
          className="mt-[30px] hover:text-white bg-secondary hover:bg-gradient-to-r from-red-500 via-red-600 to-red-800
          text-white py-3 rounded-lg w-full text-[18px] font-medium duration-200"
        >
          Update
        </Button>
      </div>
    </div>
  );
};

export default EditTermsAndCondition;
