import {
  Input,
  Table,
  Select,
  Modal,
  DatePicker,
  TimePicker,
  Button,
  Radio,
  Form,
  Tag,
} from "antd";
import React, { useState } from "react";
import { Eye, Pencil, Search, Trash } from "lucide-react";
import moment from "moment";
import { useGetAllRequestQuery } from "../redux/features/getAllRequestApi";
import { usePostSetupTrialMatchMutation } from "../redux/features/postSetupTrialMatch";
import { useGetAllVolunteerQuery } from "../redux/features/getAllVolunteer";
import { useGetAllClubQuery } from "../redux/features/getAllClubApi";

const { Option } = Select;

interface UserAction {
  sId: number;
  userId: number;
  image: React.ReactNode;
  name: string;
  email: string;
  status: string;
  dateOfBirth: string;
  contact: string;
}

interface UserData {
  sId: number;
  image: React.ReactNode;
  name: string;
  email: string;
  status: string;
  currentLevel: string;
  requestedLevel: string;
  club: { id: number; club_name: string }[] | undefined;
  action: UserAction;
}

const Subscriptions: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [openTrialModal, setOpenTrialModal] = useState<boolean>(false);
  const [trialMatchData, setTrialMatchData] = useState<UserData | null>(null);
  const [selectedClubs, setSelectedClubs] = useState<{ [key: number]: number }>(
    {}
  );
  const [selectedTeam, setSelectedTeam] = useState<number[]>([]);
  const [selectedOpponents, setSelectedOpponents] = useState<number[]>([]);
  const [openModel, setOpenModel] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openViewModal, setOpenViewModal] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserAction | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [status, setStatus] = useState<string>("active");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentClub, setCurrentClub] = useState<any>(null);
  // const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [sponsored, setSponsored] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [form] = Form.useForm();
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState("");

  // Fetching data with loading checks
  const { data: requestMatch, isLoading, isError } = useGetAllRequestQuery();
  const { data: volunteers } = useGetAllVolunteerQuery();
  const { data: clubs } = useGetAllClubQuery();

  const club = clubs?.data?.clubs || []; // Fallback to empty array if undefined
  const volunteer = volunteers?.data?.volunteers || []; // Fallback to empty array if undefined

  const [postSetupTrialMatch] = usePostSetupTrialMatchMutation();

  const pageSize = 10;
  console.log("64", requestMatch);
  // Construct dataSource with optional chaining
  const dataSource =
    requestMatch?.data?.map((item, index) => ({
      sId: 1,
      name: "Basic Plan",
      cost: "$20",
      duration: "Monthly",
      features: "Access to member gallery",
      club: Array.isArray(item?.club) ? item.club.map((c) => c.id) : [], // Default to empty array if club is undefined,
      status: item?.status,
      action: {
        sId: item.request_id,
        userId: item?.user?.user_id,
        time: item?.created_at,
        date: item?.created_at,
        name: item?.user?.full_name,
        duration: item?.user?.current_level,
        features: item?.request_level,
        club: Array.isArray(item?.club) ? item.club.map((c) => c.id) : [], // Default to empty array if club is undefined
        email: `player${index + 1}@example.com`,
        status: item?.status,
        dateOfBirth: "24-05-2024",
        contact: "0521545861520",
      },
    })) || []; // Default to empty array if requestMatch.data is undefined

  const columns = [
    {
      title: "Plan Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Cost",
      dataIndex: "cost",
      key: "cost",
    },
    {
      title: "Duration ",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "Features",
      dataIndex: "features",
      key: "features",
    },
    {
      title: <div className="text-right">Action</div>,
      dataIndex: "action",
      key: "action",
      render: (_: any, record: UserData) => (
        <div className="flex items-center justify-end gap-3">
          {/* <button onClick={() => handleViewDetails(record.sId)} className="hover:bg-primary p-1 rounded bg-blue">
            <Eye />
          </button> */}
          <button
            onClick={() => handleUser(record.action)}
            className="hover:bg-primary p-1 rounded bg-blue"
          >
            <Pencil />
          </button>
          <button
            onClick={() => handleDelete(record.action)}
            className="bg-secondary px-3 py-1 rounded hover:bg-primary"
          >
            <Trash />
          </button>
        </div>
      ),
    },
  ];

  const handlePage = (page: number) => {
    setCurrentPage(page);
  };

  const handleClubChange = (sId: number, value: number) => {
    setSelectedClubs((prev) => ({ ...prev, [sId]: value }));
  };

  const handleTrialMatches = (record: UserData) => {
    setTrialMatchData(record);
    setSelectedTeam([record.sId]);
    if (record.club?.[0]?.id) {
      setSelectedClubs((prev) => ({
        ...prev,
        [record.sId]: record?.club[0].id,
      }));
    }
    setOpenTrialModal(true);
  };
  console.log("trialmatch data", trialMatchData);
  const confirmTrialMatch = async () => {
    if (trialMatchData) {
      const id = trialMatchData.sId;
      console.log("146, Selected Opponents before posting:", selectedOpponents); // Debugging step
      const postData = {
        user_id: trialMatchData.userId,
        club_id: selectedClubs[trialMatchData.sId] || trialMatchData.club,
        volunteer_ids: selectedOpponents?.length > 0 ? selectedOpponents : [], // Ensure it's an array
        time: moment().format("HH:mm"),
        date: moment().format("YYYY-MM-DD"),
      };

      console.log("Post data being sent:", postData); // Debugging log for post data
      try {
        const result = await postSetupTrialMatch({
          id,
          data: postData,
        }).unwrap();
        console.log("Trial match created successfully:", result);
        setOpenTrialModal(false);
      } catch (error) {
        console.error("Error setting up trial match:", error);
      }
    }
  };

  const handleUser = (action: UserAction) => {
    console.log("97", action);
    setUserData(action);
    setStatus(action.status);
    setOpenModel(true);
  };

  const handleViewDetails = (id: number) => {
    setUserId(id);
    setOpenViewModal(true);
  };

  const handleDelete = (action: UserAction) => {
    console.log("109", action);
    setUserData(action);
    setOpenDeleteModal(true);
  };

  const onDeleteConfirm = async () => {
    console.log("113", userData);
    if (userData?.sId) {
      try {
        await deleteUser({ id: userData?.sId });
        setOpenDeleteModal(false);
        console.log("User deleted successfully");
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };

  const onConfirmRoleChange = async () => {
    // if (userData?.sId) {
    //   try {
    //     await putChangeUserStatus({
    //       id: userData.sId,
    //       data: { status, _method: "PUT" },
    //     }).unwrap();
    //     setOpenModel(false);
    //     console.log("Status updated successfully");
    //   } catch (error) {
    //     console.error("Error updating status:", error);
    //   }
    // }
  };

  const onViewModalClose = () => {
    setOpenViewModal(false);
  };
  const handleNewClub = () => {
    setIsEditMode(false);
    // setCurrentClub(null);
    setIsModalVisible(true);
    form.resetFields();
    // setSponsored(false);
    // setLatitude(null);
    // setLongitude(null);
    // setFileList([]);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
    // setFileList([]);
    form.resetFields();
  };

  // Add a tag
  const handleAddTag = () => {
    if (inputValue.trim() && !tags.includes(inputValue.trim())) {
      setTags([...tags, inputValue.trim()]);
      setInputValue("");
      form.setFieldsValue({ tags: [...tags, inputValue.trim()] }); // Update form value
    }
  };

  // Remove a tag
  const handleRemoveTag = (removedTag) => {
    const updatedTags = tags.filter((tag) => tag !== removedTag);
    setTags(updatedTags);
    form.setFieldsValue({ tags: updatedTags }); // Update form value
  };
  return (
    <div className="py-4">
      <Button key="add-club" onClick={handleNewClub}>
        Add New
      </Button>

      <div className="py-8">
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={{
            pageSize,
            total: requestMatch?.data?.length || 0,
            current: currentPage,
            onChange: handlePage,
          }}
          rowKey="sId"
          rowClassName={() => "hover:bg-transparent"}
        />

        <Modal
          visible={openModel}
          onCancel={() => setOpenModel(false)}
          title="User Status"
          footer={[
            <Button key="cancel" onClick={() => setOpenModel(false)}>
              Cancel
            </Button>,
            <Button
              key="confirm"
              type="primary"
              onClick={onConfirmRoleChange}
              // loading={isUpdating}
            >
              Save Changes
            </Button>,
          ]}
        >
          <p>
            <strong>Name:</strong> {userData?.name}
          </p>
          <p>
            <strong>Email:</strong> {userData?.email}
          </p>
          <Radio.Group
            onChange={(e) => setStatus(e.target.value)}
            value={status}
          >
            <Radio value="active">Active</Radio>
            <Radio value="banned">Blocked</Radio>
          </Radio.Group>
        </Modal>

        <Modal
          visible={openDeleteModal}
          onCancel={() => setOpenDeleteModal(false)}
          title="Delete User"
          footer={[
            <Button key="cancel" onClick={() => setOpenDeleteModal(false)}>
              Cancel
            </Button>,
            <Button
              key="confirm"
              type="primary"
              danger
              onClick={onDeleteConfirm}
              // loading={isDeleting}
            >
              Delete
            </Button>,
          ]}
        >
          <p>Are you sure you want to delete this user?</p>
        </Modal>

        <Modal
          visible={openViewModal}
          onCancel={onViewModalClose}
          title="User Details"
          footer={[
            <Button key="close" type="primary" onClick={onViewModalClose}>
              Close
            </Button>,
          ]}
        >
          {/* {userDetails ? ( */}
          <div className="border border-gray-200 rounded-lg p-12">
            {/* {userDetails?.data?.image && ( */}
            <img
              // src={userDetails?.data?.image}
              alt="User Avatar"
              className="w-24 flex mx-auto mb-12 h-24 rounded-full mb-4"
            />
            {/* )} */}
            <p className="text-black text-lg ">
              <strong>Full Name:</strong>
              {/* {userDetails.data.full_name} */}
            </p>
            <p className="text-black py-2">
              <strong>Email:</strong>

              {/* {userDetails.data.email} */}
            </p>
            <p className="text-black">
              <strong>Location:</strong>
              {/* {userDetails.data.location || "N/A"} */}
            </p>
            <p className="text-black py-2">
              <strong>Level:</strong>
              {/* {userDetails.data.level_name} */}
            </p>
            <p className="text-black">
              <strong>Points:</strong>
              {/* {userDetails.data.points} */}
            </p>
            <p className="text-black py-2">
              <strong>Role:</strong>
              {/* {userDetails.data.role} */}
            </p>
            <p className="text-black">
              <strong>Created At:</strong>
              {/* {userDetails.data.created_at} */}
            </p>
          </div>
          {/* ) : (
            <p>Loading user details...</p>
          )} */}
        </Modal>

        {/* Modal for Adding/Editing Subscription */}
        <Modal
          title={isEditMode ? "Edit Club" : "Add Club"}
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <Form
            layout="vertical"
            form={form}
            // onFinish={handleFormSubmit}
          >
            <Form.Item
              name="planName"
              label="Plan Name"
              rules={[
                { required: true, message: "Please enter the plan name" },
              ]}
            >
              <Input className="w-full" placeholder="Enter plan name" />
            </Form.Item>

            <Form.Item
              name="duration"
              label="Duration"
              rules={[{ required: false, message: "Please enter duration" }]}
            >
              <Input placeholder="Enter duration" />
            </Form.Item>

            <Form.Item
              name="planCost"
              label="Plan Cost"
              rules={[
                { required: true, message: "Please enter a description" },
              ]}
            >
              <Input placeholder="Enter description" rows={3} />
            </Form.Item>

            <Form.Item
              name="features"
              label="Features"
              rules={[{ type: "url", message: "Please enter features" }]}
            >
              <div style={{ display: "flex", gap: "8px" }}>
                <Input
                  className="relative"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onPressEnter={handleAddTag}
                  placeholder="Enter a tag"
                />
                <Button
                  className="bg-black absolute right-0"
                  onClick={handleAddTag}
                  type="primary"
                >
                  Add
                </Button>
              </div>
            </Form.Item>
            <div
              style={{
                marginTop: "10px",
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              {tags.map((tag) => (
                <Tag closable key={tag} onClose={() => handleRemoveTag(tag)}>
                  {tag}
                </Tag>
              ))}
            </div>
            <Form.Item>
              <Button
                className="bg-black my-2"
                type="primary"
                htmlType="submit"
                block
                // loading={isCreating || isUpdating}
              >
                {isEditMode ? "Update Subscription" : "Create Subscription"}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Subscriptions;
