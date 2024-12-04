import React, { useState, useEffect } from "react";
import { Collapse, Input, Button } from "antd";
import type { CollapseProps } from "antd";
import { useNavigate } from "react-router-dom";
import { useUpdateNormalMatchQuestionMutation } from "../redux/features/putUpdateNormalMatchQuestion";
import { useUpdateTrialMatchQuestionMutation } from "../redux/features/putUpdateTrialMatchQuestion";
import { useDeleteNormalMatchQuestionMutation } from "../redux/features/deleteNormalMatchQuestion";
import { useAddNormalMatchQuestionMutation } from "../redux/features/postAddNormalMatchQuestionApi";
import { useGetNormalMatchQuestionQuery } from "../redux/features/getNormalMatchQuestionApi";
import { useAddTrialMatchQuestionMutation } from "../redux/features/postAddTrialMatchQuestion";
import { useTrialMatchQuestionQuery } from "../redux/features/getTrialMatchQuestion";
import { useDeleteTrialMatchQuestionMutation } from "../redux/features/deleteTrialMatchQuestion";
import { Pencil, Trash } from "lucide-react";

interface MatchData {
  [key: string]: {
    label: string;
    content: string;
    answers: string[];
  };
}

const Questionaries: React.FC = () => {
  const [normalMatchData, setNormalMatchData] = useState<MatchData>({});
  const [trialMatchData, setTrialMatchData] = useState<MatchData>({});
  const [editingPanel, setEditingPanel] = useState<string | null>(null);
  const [tempContent, setTempContent] = useState<string>("");
  const [tempLabel, setTempLabel] = useState<string>("");
  const [tempAnswers, setTempAnswers] = useState<string[]>(["", "", "", ""]);
  const [idFound, setIdFound] = useState<boolean>(false);
  const [updateNormalMatchQuestion] = useUpdateNormalMatchQuestionMutation();
  const [updateTrialMatchQuestion] = useUpdateTrialMatchQuestionMutation();
  const [deleteNormalMatchQuestion] = useDeleteNormalMatchQuestionMutation();
  const [deleteTrialMatchQuestion] = useDeleteTrialMatchQuestionMutation();
  const [addNormalMatchQuestion] = useAddNormalMatchQuestionMutation();
  const { data } = useGetNormalMatchQuestionQuery();
  const { data: trialMatcAll } = useTrialMatchQuestionQuery();
  const [addTrialMatchQuestion] = useAddTrialMatchQuestionMutation();

  const questenaries = data?.data?.data || [];
  console.log("39 signup question", questenaries);
  const trialMatchQuestion = trialMatcAll?.data?.data || [];
  console.log("38", trialMatchQuestion);
  console.log("42", tempLabel);
  console.log("44", tempAnswers);
  useEffect(() => {
    if (data && data.data && data.data.data) {
      const initialData: MatchData = {};
      console.log("49 - Full Data:", data.data.data); // Logs the entire data array
  
      data.data.data.map((item: any) => {
        // Log each item
        console.log("Item:", item);
  
        // Log individual answers
        console.log("Answer A:", item?.options?.A?.option);
        console.log("Answer b:", item?.options?.B?.option);
        console.log("Answer c:", item?.options?.C?.option);
        console.log("Answer d:", item?.options?.D?.option);
       
  
        initialData[item.id] = {
          label: item.question,
          content: item.content || "Default content",
          answers: [
            item?.options?.A?.option || "Answer A: Not provided",
            item?.options?.B?.option || "Answer B: Not provided",
            item?.options?.C?.option || "Answer C: Not provided",
            item?.options?.D?.option || "Answer D: Not provided",
          ],
        };
      });
      setNormalMatchData(initialData);
    }
  }, [data]);

  useEffect(() => {
    if (trialMatcAll && trialMatcAll.data && trialMatcAll.data.data) {
      const initialData: MatchData = {};
      trialMatcAll.data.data.forEach((item: any) => {
        initialData[item.id] = {
          label: item.question,
          content: item.content || "Default content",
          answers: [
            item?.options?.A?.option || "Answer A: Not provided",
            item?.options?.B?.option || "Answer B: Not provided",
            item?.options?.C?.option || "Answer C: Not provided",
            item?.options?.D?.option || "Answer D: Not provided",
          ],
        };
      });
      setTrialMatchData(initialData);
    }
  }, [trialMatcAll]);

  //   const handleEdit = (key: string, dataType: "normal" | "trial") => {
  //     setEditingPanel(key);

  //     let questionData;
  //     if(dataType = "normal") {

  //       // Find the question data from questenaries based on the id
  //      questionData = questenaries.find((item: any) => item.id === key);
  //     console.log("52", questionData?.id);
  // console.log("templable",tempLabel);
  // console.log("tempContent",tempContent);
  // console.log("tempAnswer",tempAnswers);
  //       if (questionData) {
  //         // Populate the editing fields with data from questenaries
  //         setTempLabel(questionData.question || ""); // Set the question text
  //         setTempContent(questionData.content || ""); // Set the content if available
  //         setTempAnswers([
  //           questionData?.options?.A?.option,
  //           questionData?.options?.B?.option,
  //           questionData?.options?.C?.option,
  //           questionData?.options?.D?.option,
  //         ]); // Set the answers
  //       } else {
  //         // If no data is found, fall back to the existing data in normalMatchData or trialMatchData
  //         const dataToEdit =
  //           dataType === "normal" ? normalMatchData : trialMatchData;
  //         setTempLabel(dataToEdit[key].label);
  //         setTempContent(dataToEdit[key].content);
  //         setTempAnswers(dataToEdit[key].answers || ["", "", "", ""]);
  //       }
  //     }else {
  //       // Find the question data from questenaries based on the id
  //     const questionData = trialMatchQuestion.find((item: any) => item.id);
  //     console.log("52", questionData?.options?.A?.option);

  //       if (questionData) {
  //         // Populate the editing fields with data from questenaries
  //         setTempLabel(questionData.question || ""); // Set the question text
  //         setTempContent(questionData.content || ""); // Set the content if available
  //         setTempAnswers([
  //           questionData?.options?.A?.option,
  //           questionData?.options?.B?.option,
  //           questionData?.options?.C?.option,
  //           questionData?.options?.D?.option,
  //         ]); // Set the answers
  //       } else {
  //         // If no data is found, fall back to the existing data in normalMatchData or trialMatchData
  //         const dataToEdit =
  //           dataType === "normal" ? normalMatchData : trialMatchData;
  //         setTempLabel(dataToEdit[key].label);
  //         setTempContent(dataToEdit[key].content);
  //         setTempAnswers(dataToEdit[key].answers || ["", "", "", ""]);
  //       }
  //     }
  //   };
  const handleEdit = (key: string, dataType: "normal" | "trial") => {
    setEditingPanel(key);

    // Check if the key is a newly added panel (starts with "new-")
    if (key.startsWith("new-")) {
      setTempLabel(""); // default for new entries
      setTempAnswers(["", "", "", ""]);
      return;
    }

    // Retrieve questionData based on dataType
    let questionData;
    if (dataType === "normal") {
      questionData = questenaries.find(
        (item: any) => String(item.id) === String(key)
      );
    } else {
      questionData = trialMatchQuestion.find(
        (item: any) => String(item.id) === String(key)
      );
    }

    if (!questionData) {
      console.error("Question data not found for key:", key);
      return;
    } else {
      setTempLabel(questionData?.question || "");
      if (questionData?.options) {
        setTempAnswers([
          questionData.options.A.option || "",
          questionData.options.B.option || "",
          questionData.options.C.option || "",
          questionData.options.D.option || "",
        ]);
      } else {
        setTempAnswers([
          questionData.A || "",
          questionData.B || "",
          questionData.C || "",
          questionData.D || "",
        ]);
      }
    }

    // setTempLabel(questionData.question || "");
  };
  const handleSave = async (
    key: string | null,
    dataType: "normal" | "trial"
  ) => {
    if (tempAnswers.some((answer) => !answer.trim())) {
      console.error("All answer fields must be filled.");
      return;
    }

    const updatedData = {
      label: tempLabel,
      content: tempContent,
      answers: tempAnswers,
    };

    const addFormattedQuestion: any = {
      question: tempLabel,
      A: tempAnswers[0],
      B: tempAnswers[1],
      C: tempAnswers[2],
      D: tempAnswers[3],
      status: true,
    };
    const updateFormattedQuestion: any = {
      question: tempLabel,
      A: tempAnswers[0],
      B: tempAnswers[1],
      C: tempAnswers[2],
      D: tempAnswers[3],
      _method: "PUT",
      status: true,
    };

    try {
      if (key && key.startsWith("new-")) {
        // For new entries
        if (dataType === "normal") {
          const response = await addNormalMatchQuestion(
            addFormattedQuestion
          ).unwrap();
          if (response && response.success) {
            const newKey = response.data.id;
            setNormalMatchData((prevState) => ({
              ...prevState,
              [newKey]: updatedData,
            }));
          }
        } else {
          const response = await addTrialMatchQuestion(
            addFormattedQuestion
          ).unwrap();
          if (response && response.success) {
            const newKey = response.data.id;
            setTrialMatchData((prevState) => ({
              ...prevState,
              [newKey]: updatedData,
            }));
          }
        }
      } else {
        // For existing entries
        if (dataType === "normal") {
          await updateNormalMatchQuestion({
            id: key,
            data: updateFormattedQuestion,
          }).unwrap();
          setNormalMatchData((prevState) => ({
            ...prevState,
            [key]: updatedData,
          }));
        } else {
          await updateTrialMatchQuestion({
            id: key,
            data: updateFormattedQuestion,
          }).unwrap();
          setTrialMatchData((prevState) => ({
            ...prevState,
            [key]: updatedData,
          }));
        }
      }
    } catch (error) {
      console.error("Error saving question:", error);
    }

    setEditingPanel(null);
  };

  const handleAddNewNormalMatch = () => {
    const newKey = `new-${Date.now()}`;
    const newPanel = {
      [newKey]: {
        label: "New Signup Question",
        content: "This is the new panel content for normal match.",
        answers: ["", "", "", ""],
      },
    };
    setNormalMatchData((prevState) => ({
      ...newPanel,
      ...prevState,
    }));
  };

  const handleAddNewTrialMatch = () => {
    const newKey = `new-${Date.now()}`;
    const newPanel = {
      [newKey]: {
        label: "New Trial Match Question",
        content: "This is the new panel content for trial match.",
        answers: ["", "", "", ""],
      },
    };
    setTrialMatchData((prevState) => ({
      ...newPanel,
      ...prevState,
    }));
  };

  const handleCancel = () => {
    setEditingPanel(null);
  };

  // const handleAddNewNormalMatch = () => {
  //   const newKey = `new-${Date.now()}`;
  //   const newPanel = {
  //     [newKey]: {
  //       label: `This is panel header ${newKey}`,
  //       content: "This is the new panel content for normal match.",
  //       answers: ["", "", "", ""],
  //     },

  //   };

  //   // Prepend the new panel to the top of the existing panels
  //   setNormalMatchData((prevState) => ({
  //     ...prevState, // Then add the existing panels
  //     ...newPanel, // Add the new panel first
  //   }));

  // };

  // const handleAddNewTrialMatch = () => {
  //   const newKey = `new-${Date.now()}`;
  //   const newPanel = {
  //     [newKey]: {
  //       label: `This is panel header ${newKey} for trial match`,
  //       content: "This is the new panel content for trial match.",
  //       answers: ["", "", "", ""],
  //     },
  //   };
  //   setTrialMatchData((prevState) => ({
  //     ...prevState,
  //     ...newPanel,
  //   }));
  // };

  // const handleDeletePanel = async (
  //   key: string,
  //   dataType: "normal" | "trial"
  // ) => {
  //   try {
  //     if (dataType === "normal") {
  //       // Call the delete API and wait for the response
  //       await deleteNormalMatchQuestion({ id: key }).unwrap();
  //       console.log("Delete success");

  //       // Update the local state after successful API deletion
  //       const updatedData = { ...normalMatchData };
  //       delete updatedData[key];
  //       setNormalMatchData(updatedData);
  //     } else {
  //       await deleteTrialMatchQuestion({ id: key }).unwrap();
  //       console.log("Delete success");
  //       // Handle the trial match data deletion similarly
  //       const updatedData = { ...trialMatchData };
  //       delete updatedData[key];
  //       setTrialMatchData(updatedData);
  //     }
  //   } catch (error) {
  //     console.error("Error deleting question:", error);
  //   }
  // };
  const handleDeletePanel = async (key: string, dataType: "normal" | "trial") => {
    try {
      if (key.startsWith("new-")) {
        // Handle deletion for unsaved (new) panels
        console.log("Deleting new (unsaved) panel:", key);
  
        if (dataType === "normal") {
          const updatedData = { ...normalMatchData };
          delete updatedData[key];
          setNormalMatchData(updatedData);
        } else {
          const updatedData = { ...trialMatchData };
          delete updatedData[key];
          setTrialMatchData(updatedData);
        }
  
        return; // Exit function after handling local deletion
      }
  
      // Handle deletion for saved panels (API call)
      if (dataType === "normal") {
        await deleteNormalMatchQuestion({ id: key }).unwrap();
        console.log("Delete success");
  
        const updatedData = { ...normalMatchData };
        delete updatedData[key];
        setNormalMatchData(updatedData);
      } else {
        await deleteTrialMatchQuestion({ id: key }).unwrap();
        console.log("Delete success");
  
        const updatedData = { ...trialMatchData };
        delete updatedData[key];
        setTrialMatchData(updatedData);
      }
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };
  
  const handleAnswerChange = (index: number, value: string) => {
    const updatedAnswers = [...tempAnswers];
    updatedAnswers[index] = value;
    setTempAnswers(updatedAnswers);
  };

  const handlePanelChange = (key: string | string[]) => {
    const activeKey = Array.isArray(key) ? key[0] : key;
    if (activeKey && activeKey !== editingPanel) {
      handleEdit(activeKey, activeKey.startsWith("trial") ? "trial" : "normal");
    }
  };

  const normalMatchItems: CollapseProps["items"] = Object.keys(
    normalMatchData
  ).map((key) => ({
    key,
    label:
      editingPanel === key ? (
        <Input
          value={tempLabel}
          onChange={(e) => setTempLabel(e.target.value)}
          placeholder="Edit question" // Placeholder for question
        />
      ) : (
        <div className="items-center">
          <div className="flex justify-between">
            <div className="flex items-center">
              <span>{normalMatchData[key].label}</span>
            </div>
            <div className="flex">
              <Button
                onClick={() => handleEdit(key, "normal")}
                type="link"
                className="ml-2"
              >
                <Pencil />
              </Button>
              <Button
                onClick={() => handleDeletePanel(key, "normal")}
                type="link"
                danger
                className="ml-2"
              >
                <Trash />
              </Button>
            </div>
          </div>
        </div>
      ),
    children:
      editingPanel === key ? (
        <div>
          {/* Display existing data as default values in editable fields */}
          {tempAnswers.map((answer, index) => {
            console.log("415", answer);
            return (
              <Input
                key={index}
                value={answer}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                placeholder={`Answer option ${index + 1}`} // Placeholder for answers
                className="mt-2"
              />
            );
          })}
          <Button
            onClick={() => handleSave(key, "normal")}
            type="primary"
            className="mt-2"
          >
            Save
          </Button>
          <Button onClick={handleCancel} className="mt-2 ml-2">
            Cancel
          </Button>
        </div>
      ) : (
        <div>
          {/* Display normalMatchData answers as plain text */}
          {(normalMatchData[key].answers || []).map((answer, index) => (
            <p key={index}>{`Answer ${index + 1}: ${answer}`}</p>
          ))}
        </div>
      ),
  }));

  const trialMatchItems: CollapseProps["items"] = Object.keys(
    trialMatchData
  ).map((key) => ({
    key,
    label:
      editingPanel === key ? (
        <Input
          value={tempLabel}
          onChange={(e) => setTempLabel(e.target.value)}
          placeholder="Edit label"
        />
      ) : (
        <div className="items-center">
          <div className="flex justify-between">
            <div className="flex items-center">
              <span>{trialMatchData[key].label}</span>
            </div>
            <div className="flex">
              <Button
                onClick={() => handleEdit(key, "trial")}
                type="link"
                className=""
              >
                <Pencil />
              </Button>
              <Button
                onClick={() => handleDeletePanel(key, "trial")}
                type="link"
                danger
                className="ml-2"
              >
                <Trash />
              </Button>
            </div>
          </div>
        </div>
      ),
    children:
      editingPanel === key ? (
        <div>
          {/* Display existing data as default values in editable fields */}
          {tempAnswers.map((answer, index) => (
            <Input
              key={index}
              value={answer}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              placeholder={`Answer option ${index + 1}`}
              className="mt-2"
            />
          ))}
          <Button
            onClick={() => handleSave(key, "trial")}
            type="primary"
            className="mt-2"
          >
            Save
          </Button>
          <Button onClick={handleCancel} className="mt-2 ml-2">
            Cancel
          </Button>
        </div>
      ) : (
        <div>
          {/* Display trialMatchData answers as plain text */}
          {(trialMatchData[key].answers || []).map((answer, index) => (
            <p key={index}>{`Answer ${index + 1}: ${answer}`}</p>
          ))}
        </div>
      ),
  }));

  const navigate = useNavigate();
  const handleBackSettings = () => {
    navigate("/settings/personalInformation");
  };

  return (
    <div>
      <div className="py-8">
        <Button
          className=""
          onClick={handleBackSettings}
          style={{ backgroundColor: "transparent", color: "black" }}
        >
          Back
        </Button>
      </div>
      <div className="flex gap-4">
        <div className="w-6/12">
          <Collapse items={normalMatchItems} />
          <div className=" py-2">
            <Button
              className="mb-2"
              onClick={handleAddNewNormalMatch}
              style={{ backgroundColor: "#0057B8", color: "#fff" }}
            >
              Add New Signup Question
            </Button>
          </div>
        </div>
        <div className="w-6/12">
          <Collapse items={trialMatchItems} />
          <div className=" py-2">
            <Button
              className="mb-2"
              onClick={handleAddNewTrialMatch}
              style={{ backgroundColor: "#0057B8", color: "#fff" }}
            >
              Add New Trial Match
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questionaries;


// import React, { useState, useEffect } from "react";
// import { Collapse, Input, Button } from "antd";
// import type { CollapseProps } from "antd";
// import { useNavigate } from "react-router-dom";
// import { useUpdateNormalMatchQuestionMutation } from "../redux/features/putUpdateNormalMatchQuestion";
// import { useUpdateTrialMatchQuestionMutation } from "../redux/features/putUpdateTrialMatchQuestion";
// import { useDeleteNormalMatchQuestionMutation } from "../redux/features/deleteNormalMatchQuestion";
// import { useAddNormalMatchQuestionMutation } from "../redux/features/postAddNormalMatchQuestionApi";
// import { useGetNormalMatchQuestionQuery } from "../redux/features/getNormalMatchQuestionApi";
// import { useAddTrialMatchQuestionMutation } from "../redux/features/postAddTrialMatchQuestion";
// import { useTrialMatchQuestionQuery } from "../redux/features/getTrialMatchQuestion";
// import { useDeleteTrialMatchQuestionMutation } from "../redux/features/deleteTrialMatchQuestion";
// import { Pencil, Trash } from "lucide-react";

// interface MatchData {
//   [key: string]: {
//     label: string;
//     content: string;
//     answers: string[];
//   };
// }

// const Questionaries: React.FC = () => {
//   const [normalMatchData, setNormalMatchData] = useState<MatchData>({});
//   const [trialMatchData, setTrialMatchData] = useState<MatchData>({});
//   const [editingPanel, setEditingPanel] = useState<string | null>(null);
//   const [tempContent, setTempContent] = useState<string>("");
//   const [tempLabel, setTempLabel] = useState<string>("");
//   const [tempAnswers, setTempAnswers] = useState<string[]>(["", "", "", ""]);
//   const [updateNormalMatchQuestion] = useUpdateNormalMatchQuestionMutation();
//   const [updateTrialMatchQuestion] = useUpdateTrialMatchQuestionMutation();
//   const [deleteNormalMatchQuestion] = useDeleteNormalMatchQuestionMutation();
//   const [deleteTrialMatchQuestion] = useDeleteTrialMatchQuestionMutation();
//   const [addNormalMatchQuestion] = useAddNormalMatchQuestionMutation();
//   const { data } = useGetNormalMatchQuestionQuery();
//   const { data: trialMatcAll } = useTrialMatchQuestionQuery();
//   const [addTrialMatchQuestion] = useAddTrialMatchQuestionMutation();

//   const questenaries = data?.data?.data || [];
//   const trialMatchQuestion = trialMatcAll?.data?.data || [];

//   useEffect(() => {
//     // Populate normal match data
//     if (data && data.data && data.data.data) {
//       const initialData: MatchData = {};
//       data.data.data.forEach((item: any) => {
//         initialData[item.id] = {
//           label: item.question || "No question provided",
//           content: item.content || "Default content",
//           answers: [
//             item.A || "Answer 1: Not provided",
//             item.B || "Answer 2: Not provided",
//             item.C || "Answer 3: Not provided",
//             item.D || "Answer 4: Not provided",
//           ],
//         };
//       });
//       setNormalMatchData(initialData);
//     }
//   }, [data]);

//   useEffect(() => {
//     // Populate trial match data
//     if (trialMatcAll && trialMatcAll.data && trialMatcAll.data.data) {
//       const initialData: MatchData = {};
//       trialMatcAll.data.data.forEach((item: any) => {
//         initialData[item.id] = {
//           label: item.question || "No question provided",
//           content: item.content || "Default content",
//           answers: [
//             item.A || "Answer 1: Not provided",
//             item.B || "Answer 2: Not provided",
//             item.C || "Answer 3: Not provided",
//             item.D || "Answer 4: Not provided",
//           ],
//         };
//       });
//       setTrialMatchData(initialData);
//     }
//   }, [trialMatcAll]);

//   const handleEdit = (key: string, dataType: "normal" | "trial") => {
//     setEditingPanel(key);
//     const data = dataType === "normal" ? normalMatchData[key] : trialMatchData[key];
//     setTempLabel(data.label);
//     setTempContent(data.content);
//     setTempAnswers([...data.answers]);
//   };

//   const handleSave = async (key: string | null, dataType: "normal" | "trial") => {
//     if (tempAnswers.some((answer) => !answer.trim())) {
//       console.error("All answer fields must be filled.");
//       return;
//     }

//     const updatedData = {
//       label: tempLabel,
//       content: tempContent,
//       answers: tempAnswers,
//     };

//     try {
//       if (dataType === "normal") {
//         await updateNormalMatchQuestion({ id: key, data: updatedData }).unwrap();
//         setNormalMatchData((prevState) => ({
//           ...prevState,
//           [key!]: updatedData,
//         }));
//       } else {
//         await updateTrialMatchQuestion({ id: key, data: updatedData }).unwrap();
//         setTrialMatchData((prevState) => ({
//           ...prevState,
//           [key!]: updatedData,
//         }));
//       }
//     } catch (error) {
//       console.error("Error saving question:", error);
//     }

//     setEditingPanel(null);
//   };

//   const handleCancel = () => {
//     setEditingPanel(null);
//   };

//   const handleDeletePanel = async (key: string, dataType: "normal" | "trial") => {
//     try {
//       if (dataType === "normal") {
//         await deleteNormalMatchQuestion({ id: key }).unwrap();
//         setNormalMatchData((prevState) => {
//           const newState = { ...prevState };
//           delete newState[key];
//           return newState;
//         });
//       } else {
//         await deleteTrialMatchQuestion({ id: key }).unwrap();
//         setTrialMatchData((prevState) => {
//           const newState = { ...prevState };
//           delete newState[key];
//           return newState;
//         });
//       }
//     } catch (error) {
//       console.error("Error deleting question:", error);
//     }
//   };

//   const handleAnswerChange = (index: number, value: string) => {
//     const updatedAnswers = [...tempAnswers];
//     updatedAnswers[index] = value;
//     setTempAnswers(updatedAnswers);
//   };

//   const normalMatchItems = Object.keys(normalMatchData).map((key) => ({
//     key,
//     label: (
//       <div className="flex justify-between items-center">
//         <span>{normalMatchData[key].label}</span>
//         <div>
//           <Button onClick={() => handleEdit(key, "normal")} type="link">
//             <Pencil />
//           </Button>
//           <Button onClick={() => handleDeletePanel(key, "normal")} type="link" danger>
//             <Trash />
//           </Button>
//         </div>
//       </div>
//     ),
//     children: (
//       <div>
//         {editingPanel === key ? (
//           <div>
//             <Input.TextArea
//               value={tempContent}
//               onChange={(e) => setTempContent(e.target.value)}
//               placeholder="Edit content"
//             />
//             {tempAnswers.map((answer, index) => (
//               <Input
//                 key={index}
//                 value={answer}
//                 onChange={(e) => handleAnswerChange(index, e.target.value)}
//                 placeholder={`Answer ${index + 1}`}
//                 className="mt-2"
//               />
//             ))}
//             <Button onClick={() => handleSave(key, "normal")} type="primary" className="mt-2">
//               Save
//             </Button>
//             <Button onClick={handleCancel} className="mt-2 ml-2">
//               Cancel
//             </Button>
//           </div>
//         ) : (
//           normalMatchData[key].answers.map((answer, index) => (
//             <p key={index}>{`Answer ${index + 1}: ${answer}`}</p>
//           ))
//         )}
//       </div>
//     ),
//   }));

//   return (
//     <div>
//       <Collapse items={normalMatchItems} />
//     </div>
//   );
// };

// export default Questionaries;
