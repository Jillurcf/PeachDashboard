import {
  Input,
  Table,
  Select,
  Modal,
  Button,
  Radio,
  Form,
  Tag,
} from "antd";
import React, { useState } from "react";
import { Eye, Pencil, Trash } from "lucide-react";
import moment from "moment";

// Mock Data
const mockRequestMatch = [
  {
    request_id: 1,
    user: { user_id: 1, full_name: "John Doe", current_level: "Beginner", request_level: "Intermediate" },
    club: [{ id: 1, club_name: "Football Club" }],
    status: "active",
    created_at: "2024-12-01T10:00:00Z",
  },
  {
    request_id: 2,
    user: { user_id: 2, full_name: "Jane Smith", current_level: "Intermediate", request_level: "Advanced" },
    club: [{ id: 2, club_name: "Basketball Club" }],
    status: "inactive",
    created_at: "2024-12-02T14:00:00Z",
  },
  // Add more mock users if needed
];

const mockClubs = [
  { id: 1, club_name: "Football Club" },
  { id: 2, club_name: "Basketball Club" },
  // Add more mock clubs if needed
];

const mockVolunteers = [
  { id: 1, name: "Volunteer 1" },
  { id: 2, name: "Volunteer 2" },
  // Add more mock volunteers if needed
];

const Subscriptions: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [openTrialModal, setOpenTrialModal] = useState<boolean>(false);
  const [trialMatchData, setTrialMatchData] = useState<any | null>(null);
  const [selectedClubs, setSelectedClubs] = useState<{ [key: number]: number }>({});
  const [selectedOpponents, setSelectedOpponents] = useState<number[]>([]);
  const [openModel, setOpenModel] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [userData, setUserData] = useState<any | null>(null);
  const [status, setStatus] = useState<string>("active");

  const pageSize = 10;

  const dataSource = mockRequestMatch.map((item, index) => ({
    sId: item.request_id,
    name: "Basic Plan",
    cost: "$20",
    duration: "Monthly",
    features: "Access to member gallery",
    club: item.club.map((c) => c.id),
    status: item.status,
    action: {
      sId: item.request_id,
      userId: item.user.user_id,
      time: item.created_at,
      date: item.created_at,
      name: item.user.full_name,
      duration: item.user.current_level,
      features: item.user.request_level,
      club: item.club.map((c) => c.id),
      email: `player${index + 1}@example.com`,
      status: item.status,
      dateOfBirth: "24-05-2024",
      contact: "0521545861520",
    },
  }));

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
      render: (_: any, record: any) => (
        <div className="flex items-center justify-end gap-3">
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

  const handleUser = (action: any) => {
    setUserData(action);
    setStatus(action.status);
    setOpenModel(true);
  };

  const handleDelete = (action: any) => {
    setUserData(action);
    setOpenDeleteModal(true);
  };

  const onDeleteConfirm = async () => {
    if (userData?.sId) {
      console.log("Deleting user:", userData);
      setOpenDeleteModal(false);
    }
  };

  const onConfirmRoleChange = async () => {
    if (userData?.sId) {
      console.log("Changing user status:", status);
      setOpenModel(false);
    }
  };

  const handleCancel = () => {
    setOpenModel(false);
  };

  return (
    <div className="py-4">
      <Button key="add-club">Add New</Button>

      <div className="py-8">
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={{
            pageSize,
            total: mockRequestMatch.length,
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
            >
              Delete
            </Button>,
          ]}
        >
          <p>Are you sure you want to delete this user?</p>
        </Modal>
      </div>
    </div>
  );
};

export default Subscriptions;
