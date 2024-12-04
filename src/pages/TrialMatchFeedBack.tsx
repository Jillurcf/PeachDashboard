import { Input, Table } from "antd";
import { Pencil, Search, Trash, Eye } from "lucide-react";
import React, { useState } from "react";
import image from "../assets/Images/Notifications/Avatar.png";
import ModalComponent from "../component/share/ModalComponent";

import { useDeleteUserMutation } from "../redux/features/deleteUserApi";
import { useFeedbackToggleLevelsMutation } from "../redux/features/putFeedbacktoggleLevel";
import { useTrialMatchQuestionQuery } from "../redux/features/getTrialMatchQuestion";
import { useTrialMatchFeedBackQuery } from "../redux/features/getTrialMatchFeedBack";

const TrialMatchFeedBack = () => {
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
  const { data, isLoading, isError } = useTrialMatchFeedBackQuery({
    page: currentPage,
    perPage: pageSize,
  });

  console.log("28", data?.data);
  console.log("30", userData);
  console.log("31", userData?.adjust_status);

  const [deleteUser] = useDeleteUserMutation();

  const userDataSource = data?.data?.map((user: any) => ({
    sId: user.id,
    image: (
      <img
        src={user.profile || image}
        className="w-9 h-9 rounded-full"
        alt="avatar"
      />
    ),
    name: user.full_name,
    email: user.email,
    user_id: user?.user_id,
    tiralMatchId: user?.trail_match_id,
    trialMatchQuestionAnswer: user?.trail_match_question_answers || [],
    volunteers: user?.volunteer || [],
    volunteer: user?.volunteer,
    adjust_status: user?.adjust_status,
    matchPlayed: user?.matches_played,
    location: "N/A",
    level: user.level_name || "N/A",
    action: {
      sId: user.id,
      name: user.full_name,
      image: (
        <img
          src={user.profile || image}
          className="w-9 h-9"
          alt="avatar rounded-full"
        />
      ),
      matchPlayed: user?.matches_played,
      user_id: user?.user_id,
      email: user.email,
      tiralMatchId: user?.trail_match_id,
      trialMatchQuestionAnswer: user?.trail_match_question_answers || [],
      volunteers: user?.volunteer || [],
      adjust_status: user?.adjust_status,
      location: "N/A",
      level: user.level_name || "N/A",
      status: user.status === "active" ? "Active" : "Blocked",
    },
  }));
  console.log("", userDataSource);
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
    { title: "Trial Match Id", dataIndex: "tiralMatchId", key: "tiralMatchId" },
    { title: "Level", dataIndex: "level", key: "level" },
    { title: "Match Played", dataIndex: "matchPlayed", key: "matchPlayed" },
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

  React.useEffect(() => {
    if (openViewModal) {
      console.log("userData in Modal:", userData); 
      console.log("trialMatchQuestionAnswer:", userData?.trialMatchQuestionAnswer);
    }
  }, [openViewModal, userData]);

  const handleDelete = (action: any) => {
    setUserData(action);
    setOpenDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (userData?.sId) {
      try {
        await deleteUser({ id: userData.sId }).unwrap();
        console.log("User deleted successfully:", userData.sId);
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
  if (searchTerm && !userDataSource.length)
    return <p>No users found for the search term.</p>;

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
          modalStyle={{ width: '80vw', maxWidth: '900px', padding: '20px' }}  // Custom width for the modal
        >
          <div className="bg-white p-4 rounded border rounded-lg m-6 shadow-lg">
            <div className="flex items-center justify-center my-6">
              <img
                src={userData?.image?.props?.src}
                className="w-24 h-24 rounded-full"
                alt="avatar"
              />
            </div>
            <div className="">
              <div>
                <div>
                  <p className="text-xl text-gray-900">
                    <strong>Full Name:</strong> {userData?.name}
                  </p>
                  <p className="text-md text-gray-900">
                    <strong>Email:</strong> {userData?.email}
                  </p>
                  <p className="text-md text-gray-900">
                    <strong>Trial Match Id:</strong> {userData?.tiralMatchId}
                  </p>
                  <p className="text-md text-gray-900">
                    <strong>Matches Played:</strong>{" "}
                    {userData?.matchPlayed || "N/A"}
                  </p>
                  <p className="text-md text-gray-900">
                    <strong>Level:</strong> {userData?.level || "N/A"}
                  </p>
                  <p className="text-md text-gray-900 pt-2 text-center">
                    <strong>Question and Answer:-</strong>
                  </p>
                </div>
                {userData?.trialMatchQuestionAnswer?.length > 0 ? (
                  userData.trialMatchQuestionAnswer.map((qa, idx) => (
                    <div key={idx}>
                      <p className="text-gray-900">
                        <strong>Question-</strong>{" "}
                        {qa?.question || "No Question Available"}
                      </p>
                      <p className="text-gray-900">
                        <strong>Answer-</strong>
                        {qa?.answer || "No Question Available"}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-900">No Question Available</p>
                )}
              </div>
              <p className="text-gray-900 txt-md pt-8 text-center">
                <strong>Volunteers: </strong>
              </p>

              {userData?.volunteers?.length > 0 ? (
                userData?.volunteers.map((v, idx) => (
                  <div key={idx}>
                    <img
                      src={v?.image}
                      className="w-24 h-24 rounded-full"
                      alt="avatar"
                    />
                    <p className="text-gray-900">
                      <strong>Name</strong>
                      {v?.name || "No name Available"}
                    </p>
                    <p className="text-gray-900">
                      <strong>Email</strong>
                      {v?.email || "No Question Available"}
                    </p>
                  </div>
                ))
              ) : (
                <p>No Volunteers available</p>
              )}
            </div>
          </div>
        </ModalComponent>
      </div>
    </div>
  );
};

export default TrialMatchFeedBack;
