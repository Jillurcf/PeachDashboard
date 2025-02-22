import React, { useEffect, useState } from "react";
import { Collapse, Input, Button, message } from "antd";
import type { CollapseProps } from "antd";
import { Pencil, Trash } from "lucide-react";
import { useGetAllFaqQuery } from "../redux/features/getAllFaq";
import { useAddFaqMutation } from "../redux/features/postFaqApi";
import { useDeleteFaqMutation } from "../redux/features/deleteFaqApi";

interface FaqData {
  [key: string]: {
    question: string;
    status: string;
    answer: string;
  };
}

const SettingsFaq: React.FC = () => {
  // Mock Data for FAQs
  const mockFaqData = [
    {
      id: "1",
      question: "What is your refund policy?",
      answer: "We offer a 30-day refund policy.",
      status: "active",
    },
    {
      id: "2",
      question: "How to contact support?",
      answer: "You can contact support via email at support@example.com.",
      status: "active",
    },
    {
      id: "3",
      question: "What payment methods are accepted?",
      answer: "We accept Visa, MasterCard, and PayPal.",
      status: "active",
    },
  ];

  const [panelData, setPanelData] = useState<FaqData>({});
  const [editingPanel, setEditingPanel] = useState<string | null>(null);
  const [tempQuestion, setTempQuestion] = useState<string>("");
  const [tempAnswer, setTempAnswer] = useState<string>("");
  const [id, setId] = useState();
  const { data, isLoading, isError } = useGetAllFaqQuery({
    page: 10,
  });
  const [addFaq] = useAddFaqMutation();
  const [deleteFaq] = useDeleteFaqMutation();
  console.log("faqData", data?.faqs?.data);
  console.log("faqData Q A", tempQuestion, tempAnswer);

  // Initialize panel data with mock FAQs
  useEffect(() => {
    const initialData: FaqData = {};
    data?.faqs?.data.forEach((item) => {
      initialData[item.id] = {
        question: item.question,
        answer: item.answer,
        status: item.status,
      };
      setId(item?.id);
    });
    setPanelData(initialData);
  }, []);

  const handleAddFaq = () => {
    const newKey = `new-${Date.now()}`;
    const newPanel = {
      [newKey]: {
        question: "",
        status: "active",
        answer: "",
      },
    };
    setPanelData((prevState) => ({
      ...newPanel,
      ...prevState,
    }));
    setEditingPanel(newKey);
  };

  const handleEdit = (key: string) => {
    const faqData = panelData[key];
    setEditingPanel(key);

    if (faqData) {
      setTempQuestion(faqData.question);
      setTempAnswer(faqData.answer);
    } else if (key.startsWith("new-")) {
      setTempQuestion("");
      setTempAnswer("");
    }
  };

  const handleSave = async (key: string) => {
    const isNewFaq = key.startsWith("new-");
    const faqDetails = {
      question: tempQuestion,
      answer: tempAnswer,
      status: "active",
    };

    if (isNewFaq) {
      const newId = `${Date.now()}`; // Simulate a new unique ID for the FAQ
      setPanelData((prevState) => ({
        ...prevState,
        [newId]: faqDetails,
      }));
      try {
        const formData = new FormData();
        formData.append("question", tempQuestion);
        formData.append("answer", tempAnswer);
        console.log("formData", formData);
        const addFaqRes = await addFaq(formData);
        console.log("addFaqRes", addFaqRes);
      } catch (error) {
        console.log(error);
      }
      message.success("FAQ added successfully.");
    } else {
      setPanelData((prevState) => ({
        ...prevState,
        [key]: faqDetails,
      }));
      message.success("FAQ updated successfully.");
    }

    // Clear editing panel state
    setEditingPanel(null);
  };

  const handleCancel = () => {
    setEditingPanel(null);
  };

  const handleDelete = async (key: string) => {
    const updatedData = { ...panelData };
    delete updatedData[key];
    setPanelData(updatedData);
    const deleteRes = await deleteFaq(id);
    console.log("deletedRes", deleteRes);
    message.success("FAQ deleted successfully.");
  };

  const items: CollapseProps["items"] = Object.keys(panelData).map((key) => ({
    key,
    label:
      editingPanel === key ? (
        <Input
          value={tempQuestion}
          onChange={(e) => setTempQuestion(e.target.value)}
          placeholder="Edit question"
        />
      ) : (
        <div className="items-center">
          <div className="flex justify-between">
            <div className="flex items-center">
              <span>{panelData[key].question}</span>
            </div>
            <div>
              <Button
                onClick={() => handleEdit(key)}
                type="link"
                className="ml-2"
              >
                <Pencil />
              </Button>
              <Button
                danger
                onClick={() => handleDelete(key)}
                type="link"
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
          <Input.TextArea
            value={tempAnswer}
            onChange={(e) => setTempAnswer(e.target.value)}
            rows={4}
            placeholder="Edit answer"
          />
          <Button
            onClick={() => handleSave(key)}
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
          <p>{panelData[key].answer}</p>
        </div>
      ),
  }));

  // Handle panel changes
  const handlePanelChange = (activeKey: string | string[]) => {
    console.log("Active panel changed: ", activeKey);
  };

  return (
    <div>
      <Button type="primary" onClick={handleAddFaq} className="mb-4">
        Add FAQ
      </Button>
      <Collapse
        items={items}
        defaultActiveKey={["1"]}
        onChange={handlePanelChange}
      />
    </div>
  );
};

export default SettingsFaq;
