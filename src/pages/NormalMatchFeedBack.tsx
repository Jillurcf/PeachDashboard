import { Input, Table } from "antd";
import { Pencil, Search, Trash, Eye } from "lucide-react";
import React, { useState } from "react";
import image from "../assets/Images/Notifications/Avatar.png";
import ModalComponent from "../component/share/ModalComponent";
import { useNormalMatchFeedBackQuery } from "../redux/features/getNormalMatchFeedBack";
import { useDeleteUserMutation } from "../redux/features/deleteUserApi";
import { useFeedbackToggleLevelsMutation } from "../redux/features/putFeedbacktoggleLevel";

const NormalMatchFeedBack = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [openModel, setOpenModel] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openViewModal, setOpenViewModal] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>(null);
  const [role, setRole] = useState<string>("");
  const [buttonLabel, setButtonLabel] = useState<string>("Down Grade Level");
  const [feedbackToggleLevels] = useFeedbackToggleLevelsMutation();

  const pageSize = 5;
  const { data, isLoading, isError } = useNormalMatchFeedBackQuery({
    page: currentPage,
    perPage: pageSize,
  });
  console.log("26", data?.data);
  console.log("27", userData);
  const [deleteUser] = useDeleteUserMutation();

  const userDataSource = data?.data?.map((user: any) => ({
    sId: user.id,
    image: (
      <img src={user.image || image} className="w-9 h-9 rounded" alt="avatar" />
    ),
    name: user.full_name,
    email: user.email,
    matchId: user.match_id,
    matchPlayed: user?.matches_played,
    user_id: user?.user_id,
    questionaries: user?.questionnaire,
    location: "N/A",
    level: user.level_name || "N/A",
    status: user.status === "active" ? "Active" : "Blocked",
    action: {
      sId: user.id,
      image: (
        <img
          src={user.image || image}
          className="w-9 h-9 rounded"
          alt="avatar"
        />
      ),
      user_id: user?.user_id,
      name: user.full_name,
      email: user.email,
      matchId: user?.match_id,
      matchPlayed: user?.matches_played,
      questionaries: user?.questionnaire,
      adjust_status: user?.adjust_status,
      location: "N/A",
      level: user.level_name,
      status: user.status === "active" ? "Active" : "Blocked",
    },
  }));

  const columns = [
    {
      title: "Users",
      dataIndex: "image",
      key: "image",
      render: (_: any, record: any) => (
        <div className="flex items-center gap-4">
          {record.image}
          {record.name}
        </div>
      ),
    },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Match Id", dataIndex: "matchId", key: "matchId" },
    { title: "Level", dataIndex: "level", key: "level" },
    // { title: "Status", dataIndex: "status", key: "status" },
    {
      title: <div className="text-right">Action</div>,
      dataIndex: "action",
      key: "action",
      render: (_: any, record: any) => (
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => handleViewDetails(record.action)}
            className="hover:bg-primary p-1 rounded bg-blue"
          >
            <Eye />
          </button>
          {/* <button
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
          </button> */}
        </div>
      ),
    },
  ];

  const handlePage = (page: number) => setCurrentPage(page);

  const handleUser = (action: any) => {
    setUserData(action);
    setRole(action.role);
    setOpenModel(true);
  };

  const handleViewDetails = (action: any) => {
    setUserData(action);
    setOpenViewModal(true);
  };

  const handleDelete = (action: any) => {
    setUserData(action);
    setOpenDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (userData?.sId) {
      try {
        await deleteUser({ id: userData.sId }).unwrap();
        setOpenDeleteModal(false);
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };

  const toggleButtonLabel = async () => {
    const userId = userData?.sId;
    if (!userId) {
      console.error("User ID is undefined. Cannot toggle level.");
      return;
    }

    setButtonLabel((prevLabel) =>
      prevLabel === "Down Grade Level" ? "Upgrade Level" : "Down Grade Level"
    );

    try {
      const response = await feedbackToggleLevels({
        id: userId,
        action: buttonLabel === "Down Grade Level" ? "up" : "down",
      }).unwrap();

      if (response?.success) {
        setUserData((prevData) => ({
          ...prevData,
          level: response.data.level_name,
        }));
      }
    } catch (error) {
      console.error("Failed to toggle level:", error);
    }
  };

  if (isLoading) return <p>Loading users...</p>;
  if (isError) return <p>Error loading users. Please try again later.</p>;

  return (
    <div>
      <div className="py-8">
        <Table
          dataSource={userDataSource}
          columns={columns}
          pagination={{
            pageSize,
            total: data?.data?.length || 50,
            current: currentPage,
            onChange: handlePage,
          }}
          rowClassName={() => "hover:bg-transparent"}
        />
        <ModalComponent
          openModel={openModel}
          setOpenModel={setOpenModel}
          title="User role"
          subtitle="This is the current role of the selected user"
          cancelLabel="Cancel"
          confirmLabel="Save Changes"
          onConfirm={() => setOpenModel(false)}
          value={userData}
          role={role}
          setRole={setRole}
          showRoleSelect={true}
        />
        <ModalComponent
          openModel={openDeleteModal}
          setOpenModel={setOpenDeleteModal}
          title="Delete User"
          subtitle="Are you sure you want to delete this item?"
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={confirmDelete}
          value={userData}
        />
        <ModalComponent
          openModel={openViewModal}
          setOpenModel={setOpenViewModal}
          confirmLabel={buttonLabel}
          cancelLabel="Cancel"
          onConfirm={toggleButtonLabel}
          value={userData}
          style={{
            padding: "20px",
            maxHeight: "90vh", // Set modal height to 50vh or "100vh" for full-screen
            overflowY: "auto", // Enable scrolling
          }}
        >
          <div className="bg-gray-900 p-4 rounded m-6">
            <div className="flex items-center justify-center my-6">
              <img
                src={userData?.image?.props?.src}
                className="w-24 h-24 rounded-full"
                alt="avatar"
              />
            </div>
            <p>
              <strong>Full Name:</strong> {userData?.name}
            </p>
            <p>
              <strong>Email:</strong> {userData?.email}
            </p>
            <p>
              <strong>Match Id:</strong> {userData?.matchId || "N/A"}
            </p>
            <p>
              <strong>Match Played:</strong> {userData?.matchPlayed || "N/A"}
            </p>
            <p>
              <strong>Location:</strong> {userData?.location || "N/A"}
            </p>
            <p>
              <strong>Level:</strong> {userData?.level || "N/A"}
            </p>
            <h3>Questionnaires:</h3>
            <div>
              {userData?.questionaries?.map((q: any, index: number) => (
                <div
                  key={q.id || index}
                  className="my-2 p-2 bg-gray-600 rounded"
                >
                  <p>
                    <strong>Q-{index + 1}:</strong> {q.question}
                  </p>
                  <div>
                    <p>
                      <strong>Answer:</strong>{" "}
                      {Array.isArray(q.answer)
                        ? q.answer.map((a: any, idx: number) => (
                            <div
                              key={idx}
                              className="ml-4 mt-2 p-2 bg-gray-700 rounded"
                            >
                              <p>
                                <strong>Name:</strong> {a.full_name || "N/A"}
                              </p>
                              <p>
                                <strong>Level:</strong> {a.level || "N/A"}
                              </p>
                              <p>
                                <strong>Matches Played:</strong>{" "}
                                {a.matches_played || "N/A"}
                              </p>
                              <p>
                                <strong>Feedback:</strong> {a.feedback || "N/A"}
                              </p>
                            </div>
                          ))
                        : q?.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ModalComponent>
      </div>
    </div>
  );
};

export default NormalMatchFeedBack;
