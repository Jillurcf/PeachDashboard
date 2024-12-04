import { Modal, Button } from "antd";
import React, { useState, useEffect } from "react";
import { useFeedbackToggleLevelsMutation } from "../../redux/features/putFeedbacktoggleLevel";

const ModalComponent: React.FC<ModalComponentProps> = ({
  openModel,
  setOpenModel,
  title,
  subtitle,
  cancelLabel = "Cancel",
  confirmLabel = "Confirm",
  onCancel,
  onConfirm,
  value,
  style,
  children,
}) => {
  const [buttonLabel, setButtonLabel] = useState<string>("Down Grade Level"); // Initial button label
  const [feedbackToggleLevels] = useFeedbackToggleLevelsMutation();

  useEffect(() => {
    console.log("22, ModalComponent received value:", value);
    setButtonLabel(value?.adjust_status === "N/A" && "down" || value?.level ==="Beginner" ? "up" : "down")

  }, [value?.adjust_status, value?.level ==="Beginner"]);

  const hideModal = () => {
    setOpenModel(false);
    if (onCancel) onCancel();
  };

 

  const handleApprove = async () => {
    const userId = value?.user_id; // Ensure the correct user ID is used
    console.log("38", value);
    if (!userId) {
      console.error("User ID is undefined");
      return;
    }

    try {
      // Determine the action based on the button label
      const levelAction = buttonLabel === "up" ? "up" : "down"; // Use buttonLabel to set action

      // Construct the payload with the required fields
      const payload = {
        id: value?.user_id,

        data: {
          action: levelAction,
          _method: "PUT",
          adjust_status:
            value?.adjust_status === "N/A" || "down"
              ? "up"
              : "down"
             
        }, // Make sure the 'action' field is included
      };
      console.log("60, payload ++++++++++++++++++++", payload);

      // Send the request

      // console.log("56, payload ++++++++++++++++++++", payload);
      const levelResponse = await feedbackToggleLevels(payload);
      console.log("User level updated 60:", levelResponse);

      // Toggle the button label after the action

    setButtonLabel(levelResponse?.data?.data?.adjust_status === "down" ? "up" : "down")
   hideModal()

     
      
      if (onConfirm) onConfirm();
    } catch (error) {
      console.error("Error updating user level:", error);
    }
  };

  return (
    <Modal
      open={openModel}
      onCancel={hideModal}
      footer={null}
      centered={true}
      style={style}
    >
      <div className="text-center mb-4">
        <h1 className="text-xl font-bold text-black">{title}</h1>
        <h2 className="text-lg text-gray-600">{subtitle}</h2>
      </div>
      {children}
      {/* <div className="mb-4">
        <p>
          <strong>Name:</strong> {value?.full_name}
        </p>
        <p>
          <strong>Email:</strong> {value?.email}
        </p>
        <p><strong>Match ID:</strong> {value?.match_id}</p>
      </div> */}
      <div className="flex justify-center">
        <Button onClick={hideModal} style={{ marginRight: "10px" }}>
          {cancelLabel}
        </Button>
        <Button type="primary" onClick={handleApprove}>
          {buttonLabel} {/* Use the dynamic button label */}
        </Button>
      </div>
    </Modal>
  );
};

export default ModalComponent;
