import { Input, Table, Select, Modal, DatePicker, TimePicker, Button } from "antd";
import React, { useState } from "react";
import { Search } from "lucide-react";
import ModalComponent from "../component/share/ModalComponent";
import moment from 'moment';

const { Option } = Select;

interface UserAction {
  sId: number;
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
  club: string;
  action: UserAction;
}

interface RequestProps {}

const Request: React.FC<RequestProps> = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [openModel, setOpenModel] = useState<boolean>(false);
  const [openTrialModal, setOpenTrialModal] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserAction>({} as UserAction);
  const [selectedClubs, setSelectedClubs] = useState<{ [key: number]: string }>({});
  const [trialMatchData, setTrialMatchData] = useState<UserData | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<number[]>([]);
  const [selectedOpponents, setSelectedOpponents] = useState<number[]>([]);

  const pageSize = 10;

  const clubs = ["Spania", "Barcelona", "Madrid", "Liverpool", "Chelsea", "Arsenal", "Real Madrid", "PSG", "Manchester United", "Juventus"];

  const data: UserData[] = [...Array(9).keys()].map((item, index) => ({
    sId: index + 1,
    name: `Player ${index + 1}`,
    location: "New York, USA",
    currentLevel: "2",
    requestedLevel: "3",
    club: selectedClubs[index + 1] || 'Spania',
    status: "Approved",
    action: {
      sId: index + 1,
      name: `Player ${index + 1}`,
      email: `player${index + 1}@example.com`,
      status: "Approved",
      dateOfBirth: "24-05-2024",
      contact: "0521545861520",
    },
  }));

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Current Level",
      dataIndex: "currentLevel",
      key: "currentLevel",
    },
    {
      title: "Requested Level",
      dataIndex: "requestedLevel",
      key: "requestedLevel",
    },
    {
      title: "Club",
      dataIndex: "club",
      key: "club",
      render: (_: any, record: UserData) => (
        <Select
          defaultValue={record.club}
          style={{ width: 120 }}
          onChange={(value) => handleClubChange(record.sId, value)}
          dropdownRender={(menu) => (
            <div style={{ maxHeight: 150, overflowY: 'auto' }}>
              {menu}
            </div>
          )}
        >
          {clubs.map((club) => (
            <Option key={club} value={club}>
              {club}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Trial Matches",
      dataIndex: "trialMatches",
      key: "trialMatches",
      render: (_: any, record: UserData) => (
        <button
          onClick={() => handleTrialMatches(record)}
          className="text-[#00BCE6] px-3"
        >
          Set Up
        </button>
      ),
    },
  ];

  const handlePage = (page: number) => {
    setCurrentPage(page);
  };

  const handleClubChange = (sId: number, value: string) => {
    setSelectedClubs((prev) => ({ ...prev, [sId]: value }));
  };

  const handleTrialMatches = (record: UserData) => {
    setTrialMatchData(record);  // Set the data for the modal
    setOpenTrialModal(true);  // Open the trial match modal
  };

  const confirmTrialMatch = () => {
    console.log("Trial match created with:");
    console.log("Team:", selectedTeam);
    console.log("Opponents:", selectedOpponents);
    setOpenTrialModal(false);
  };

  return (
    <div className="py-4">
      <div>
        <Input
          prefix={<Search />}
          className="w-full rounded-2xl h-12 bg-base border-0 text-primary placeholder:text-gray-200"
          placeholder="Search for Listing"
          style={{
            backgroundColor: "#f0f0f0",
            color: "#333333",
          }}
        />
      </div>
      <div className="py-8">
        <Table
          dataSource={data}
          columns={columns}
          pagination={{
            pageSize,
            total: 50,
            current: currentPage,
            onChange: handlePage,
          }}
          rowClassName={() => "hover:bg-transparent"}
        />

        {/* Trial Match Modal */}
        <Modal
          title="Setup a Trial Match"
          visible={openTrialModal}
          onCancel={() => setOpenTrialModal(false)}
          footer={[
            <Button key="cancel" onClick={() => setOpenTrialModal(false)}>
              Cancel
            </Button>,
            <Button key="create" type="primary" onClick={confirmTrialMatch}>
              Create Trial Match
            </Button>,
          ]}
        >
          <div>
            <h3>Team</h3>
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Select Team"
              onChange={(values) => setSelectedTeam(values)}
            >
              {data.map((player) => (
                <Option key={player.sId} value={player.sId}>
                  {player.name}
                </Option>
              ))}
            </Select>

            <h3>Opponent</h3>
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Select Opponents"
              onChange={(values) => setSelectedOpponents(values)}
            >
              {data.map((player) => (
                <Option key={player.sId} value={player.sId}>
                  {player.name}
                </Option>
              ))}
            </Select>

            <h3>Schedule</h3>
            <TimePicker style={{ width: '100%' }} defaultValue={moment('12:08', 'HH:mm')} />
            <DatePicker style={{ width: '100%', marginTop: 10 }} />

            <h3>Club</h3>
            <div>{trialMatchData?.club}</div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Request;
