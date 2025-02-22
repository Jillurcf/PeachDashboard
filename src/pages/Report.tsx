import { Input, Table, Modal, Button, Radio } from "antd";
import { Pencil, Search, Trash, Eye } from "lucide-react";
import React, { useState, useEffect } from "react";
import image from "../assets/Images/Notifications/Avatar.png";
import { useGetAllUsersQuery } from "../redux/features/getAllUsersApi";
import { useGetUserDetailsQuery } from "../redux/features/getUserDetialsApi";
import { useDeleteUserMutation } from "../redux/features/deleteUserApi";
import { useSearchUsersQuery } from "../redux/features/getSearchUser";
import { useUpdateUserStatusMutation } from "../redux/features/postUpdateUserStatus";
import { useGetAllReportQuery } from "../redux/features/getAllReport";
import { useGetReportDetailsQuery } from "../redux/features/getAllReportDetails";

const mockUsers = [
  {
    id: 1,
    full_name: "John Doe",
    email: "john.doe@example.com",
    location: "New York",
    subStatus: "Active",
    plan: "Premium",
    paymentStatus: "Paid",
    status: "active",
    image: image, // Path to your image
  },
  {
    id: 2,
    full_name: "Jane Smith",
    email: "jane.smith@example.com",
    location: "California",
    subStatus: "Inactive",
    plan: "Basic",
    paymentStatus: "Pending",
    status: "banned",
    image: image,
  },
  {
    id: 3,
    full_name: "Mark Johnson",
    email: "mark.johnson@example.com",
    location: "Florida",
    subStatus: "Active",
    plan: "Standard",
    paymentStatus: "Paid",
    status: "active",
    image: image,
  },
  {
    id: 4,
    full_name: "Emily Davis",
    email: "emily.davis@example.com",
    location: "Texas",
    subStatus: "Active",
    plan: "Premium",
    paymentStatus: "Paid",
    status: "active",
    image: image,
  },
  {
    id: 5,
    full_name: "Michael Brown",
    email: "michael.brown@example.com",
    location: "Nevada",
    subStatus: "Inactive",
    plan: "Basic",
    paymentStatus: "Pending",
    status: "banned",
    image: image,
  },
];

const mockUserDetails = {
  data: {
    full_name: "John Doe",
    email: "john.doe@example.com",
    location: "New York",
    level_name: "Gold",
    points: 150,
    role: "Admin",
    created_at: "2022-01-15",
    image: image, // Path to user image
  },
};

const Report = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [openModel, setOpenModel] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openViewModal, setOpenViewModal] = useState<boolean>(false);
  const [userData, setUserData] = useState<any | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [id, setId] = useState<number | null>(null);

  const [status, setStatus] = useState<string>("active");

  const { data, isLoading, isErrror } = useGetAllReportQuery({});
  console.log("data", data?.reports?.data);
  const { data: userDetails } = useGetReportDetailsQuery(userId);
  const [updateUserStatus] = useUpdateUserStatusMutation();
  const [deleteUser] = useDeleteUserMutation();

  console.log("userDetails", userDetails, userId);

  const pageSize = 5;

  // Mocking the fetch of users
  const userDataSource = data?.reports?.data?.map((user) => ({
    sId: user?.id,
    image1: (
      <img
        src={user?.blocked_user?.avatar || image}
        className="w-9 h-9 rounded"
        alt="avatar"
      />
    ),
    image2: (
      <img
        src={user?.user?.avatar || image}
        className="w-9 h-9 rounded"
        alt="avatar"
      />
    ),
    name1: user?.blocked_user?.first_name + user?.blocked_user?.last_name,
    name2: user?.user?.first_name + user?.blocked_user?.last_name,
    email: user?.blocked_user?.email,
    reason: user.reason,
    status: user?.status,
    subStatus: user.subStatus,
    plan: user.plan,
    paymentStatus: user.paymentStatus,
    action: {
      sId: user.id,
      name: user.full_name,
      status: user.status,
      email: user.email,
    },
  }));

  const columns = [
    {
      title: "Reported By ",
      dataIndex: "image1",
      key: "image1",
      render: (_: any, record: any) => (
        <div className="flex items-center gap-4">
          {record.image1}
          {record.name1}
        </div>
      ),
    },
    {
      title: "Reported to ",
      dataIndex: "image2",
      key: "image2",
      render: (_: any, record: any) => (
        <div className="flex items-center gap-4">
          {record.image2}
          {record.name2}
        </div>
      ),
    },
    // { title: "Email", dataIndex: "email", key: "email" },
    { title: "reason", dataIndex: "reason", key: "reason" },
    { title: "status", dataIndex: "status", key: "status" },
    // { title: "Plan", dataIndex: "plan", key: "plan" },
    // { title: "Payment status", dataIndex: "paymentStatus", key: "paymentStatus" },
    {
      title: <div className="text-right">Action</div>,
      dataIndex: "action",
      key: "action",
      render: (_: any, record: any) => (
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => handleViewDetails(record.sId)}
            className="hover:bg-primary p-1 rounded bg-blue"
          >
            <Eye />
          </button>
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

  const handlePage = (page: number) => setCurrentPage(page);

  const handleUser = (action: any) => {
    console.log("acttion", action?.sId);
    setUserData(action);
    setId(action?.sId);
    setStatus(action.status);
    setOpenModel(true);
  };

  const handleViewDetails = (id: number) => {
    setUserId(id);
    setOpenViewModal(true);
  };

  const handleDelete = (action: any) => {
    setUserData(action);
    setId(action?.sId);
    setOpenDeleteModal(true);
  };

  const onDeleteConfirm = async () => {
    console.log("click", id);
    try {
      const deleteRes = await deleteUser(id);
      console.log("deleted response", deleteRes);
    } catch (error) {
      console.log(error);
    }
    // if (userData?.sId) {
    //   console.log("User deleted successfully");
    setOpenDeleteModal(false);
    // }
  };

  const onConfirmRoleChange = async () => {
    console.log("click", status, id);
    try {
      const formData = new FormData();
      console.log("Before appending:", status, id);

      if (!status) {
        throw new Error("Status is undefined or null");
      }

      formData.append("status", status);
      formData.append("_method", "PUT");

      console.log("FormData entries:");
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const res = await updateUserStatus({ data: formData, id });
      console.log("status update res", res);
    } catch (error) {
      console.error("Error:", error);
    }

    // if (userData?.sId) {
    //   console.log("Status updated successfully");
    setOpenModel(false);
    // }
  };

  const onViewModalClose = () => {
    setOpenViewModal(false);
  };

  return (
    <div>
      <Input
        prefix={<Search />}
        className="w-full rounded-2xl h-12 bg-base border-0 text-primary placeholder:text-gray-200"
        placeholder="Search by email"
        style={{ backgroundColor: "#f0f0f0", color: "#333333" }}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="py-8">
        <Table
          dataSource={userDataSource}
          columns={columns}
          pagination={{
            pageSize,
            total: mockUsers.length,
            current: currentPage,
            onChange: handlePage,
          }}
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
            <Button key="confirm" type="primary" onClick={onConfirmRoleChange}>
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
            <Radio value="blocked">Blocked</Radio>
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

        <Modal
          width={800}
          visible={openViewModal}
          onCancel={onViewModalClose}
          title="User Details"
          footer={[
            <Button key="close" type="primary" onClick={onViewModalClose}>
              Close
            </Button>,
          ]}
        >
          {userDetails ? (
            <div className="flex flex-row justify-between">
              <div className="border border-gray-200 rounded-lg p-12">
                <h1 className="text-black font-bold">Blocked user</h1>
                {userDetails?.report?.reported_user?.avatar && (
                  <img
                    src={userDetails?.report?.reported_user?.avatar}
                    alt="User Avatar"
                    className="w-24 flex mx-auto mb-12 h-24 rounded-full"
                  />
                )}
                <p className="text-black text-lg ">
                  <strong>Full Name:</strong>{" "}
                  {userDetails?.report?.reported_user?.name || "xyz"}
                </p>
                <p className="text-black py-2">
                  <strong>Email:</strong>{" "}
                  {userDetails?.report?.reported_user?.email}
                </p>

                <p className="text-black">
                  <strong>Created At:</strong>{" "}
                  {userDetails?.report?.created_at.toString().slice(0, 10)}
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-12">
                <h1 className="text-black font-bold">Blocked By</h1>
                {userDetails?.report?.reported_user?.avatar && (
                  <img
                    src={userDetails?.report?.user?.avatar}
                    alt="User Avatar"
                    className="w-24 flex mx-auto mb-12 h-24 rounded-full"
                  />
                )}
                <p className="text-black text-lg ">
                  <strong>Full Name:</strong>{" "}
                  {userDetails?.report?.user?.name || "xyz"}
                </p>
                <p className="text-black py-2">
                  <strong>Email:</strong> {userDetails?.report?.user?.email}
                </p>

                <p className="text-black">
                  <strong>Created At:</strong>{" "}
                  {userDetails?.report?.created_at.toString().slice(0, 10)}
                </p>
              </div>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default Report;
