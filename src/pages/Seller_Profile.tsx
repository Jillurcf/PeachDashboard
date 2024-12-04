import React, { useState } from "react";
import { ChevronLeft, Pencil, Search, Trash } from "lucide-react";
import { Input } from "antd";
import image from "../assets/Images/Notifications/Avatar.png";
import SelectBox from "../component/share/SelectBox";
import SellerActivityChart from "../component/manageUsers/SellerActivityChart";
import CustomTable from "../component/share/CustomTable";
import ModalComponent from "../component/share/ModalComponent";
import { useNavigate } from "react-router-dom";

type Props = {};
interface UserAction {
  sId: number;
  image: React.ReactNode;
  productName: string;
  productCategory: string;
  email: string;
  status: string;
  dateOfBirth: string;
  contact: string;
}

interface UserData {
  sId: number;
  image: React.ReactNode;
  productName: string;
  productCategory: string;
  email: string;
  status: string;
  action: UserAction;
}

const Seller_Profile = (props: Props) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserAction>({} as UserAction);
  const [type, setType] = useState<string>("");
  const pageSize = 3;

  const [selectedValue, setSelectedValue] = useState();
  const handleSelectChange = (value: string) => {
    setSelectedValue(value);
    console.log("Selected", value);
  };

  const selectOptions = [
    { value: "1", label: "Last week" },
    { value: "2", label: "Last Month" },
    { value: "3", label: "Last Year" },
  ];

  // React chart section

  const data: UserData[] = [...Array(100).keys()].map((item, index) => ({
    sId: index + 1,
    image: <img src={image} className="w-9 h-9 rounded" alt="avatar" />,
    productName: "KTM 390Duke",
    level: "2",
    status: "Created",
    date: "05-08-2024", 
    location: "Madrid",
    quantity: "Quantity",
   
    action: {
      sId: index + 1,
      image: <img src={image} className="w-9 h-9 rounded" alt="" />,
      productName: "KTM 390Duke",
      level: "2",
      location: "Madrid",
      date: "05-08-2024",
      productCategory: "Vehicle",
      price: "$6729.00",
      quantity: "quantity",
      status: "Approved",
      dateOfBirth: "24-05-2024",
      contact: "0521545861520",
    },
  }));

  const columns = [
    {
      title: "Listing",
      dataIndex: "image",
      key: "image",
      render: (_: any, record: UserData) => (
        <div className="flex items-center">
          {record.image}
          <span className="ml-3">{record.productName}</span>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    
    {
      title: <div className="text-right">Action</div>,
      dataIndex: "action",
      key: "action",
      render: (_: any, record: UserData) => (
        <div className="flex items-center justify-end gap-3">
          {/* <button
            onClick={() => handleUser(record.action)}
            className="hover:bg-primary p-1 rounded bg-blue"
          >
            <Pencil />
          </button> */}
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

  const handleUser = (values: UserAction) => {
    setUserData(values);
    setOpenModal(true);
    setType("user");
  };

  const handleDelete = (values: UserAction) => {
    setUserData(values);
    setOpenDeleteModal(true);
  };

  const confirmApprove = () => {
    console.log("Approved:", userData);
    setOpenModal(false);
    // Add approve logic here
  };

  const confirmDelete = () => {
    console.log("Deleted:", userData);
    setOpenDeleteModal(false);
    // Add delete logic here
  };
const navigate = useNavigate()
const handleBack = () => {
  navigate('/manage-users')
}
  return (
    <div>
      <div className="flex justify-between w-full">
        <div onClick={handleBack} className="flex cursor-pointer">
          <ChevronLeft />
          <h1>User Profile</h1>
        </div>
        <div>
          <Input
            prefix={<Search />}
            className=" rounded-2xl h-12 bg-base border-0 text-primary placeholder:text-gray-200"
            placeholder="Search here"
            style={{
              backgroundColor: "#f0f0f0",
              color: "#333333",
            }}
          />
        </div>
      </div>
      <div className="flex gap-2 h-36 items-center justify-center mt-28">
        <div className="w-1/2 h-[350px] items-center justify-center py-8 bg-white rounded-2xl">
          <div className="mx-auto text-center items-center">
            <img src={image} className="w-24 h-24 rounded mx-auto" alt="" />
            <h1 className="text-xl font-bold py-2">Hasan Mahmud</h1>
            <p className="">Location: Times square, USA</p>
            <p> hasanmahmud@gmail.com</p>
          </div>
          <div className="grid grid-cols-2 py-12 gap-4 p-4 ">
           
            <div className="border border-gray-200 py-6 4/12 rounded-md px-6 ">
              <p>Created</p>
              <h1 className="text-xl font-bold">26</h1>
            </div>
            <div className="border border-gray-200 py-6 4/12 rounded-md px-6 ">
              <p>Played</p>
              <h1 className="text-xl font-bold">56</h1>
            </div>
          </div>
        </div>

        <div className=" h-[350px] w-1/2 py-4 justify-center bg-white rounded-2xl">
          <div className="flex justify-between w-full px-6">
            <div className="text-lg font-bold">Match Activities</div>
            <div>
              <SelectBox
                placeholder="Last week"
                options={selectOptions}
                onChange={handleSelectChange}
                style={{ width: 150 }}
              />
            </div>
          </div>
          <SellerActivityChart />
        </div>
      </div>
      <div className="mt-28 bg-white ">
        <h1 className="p-4 text-xl font-bold">Match Listing</h1>
        <CustomTable
          dataSource={data}
          columns={columns}
          pagination={{
            pageSize,
            total: 50,
            current: currentPage,
          }}
          handlePageChange={handlePage}
        />

        <ModalComponent
          openModel={openModal}
          setOpenModel={setOpenModal}
          title="Approve Item"
          subtitle="Are you sure you want to approve the product?"
          cancelLabel="Cancel"
          confirmLabel="Approve"
          onConfirm={confirmApprove} // Your approve logic
        />

        <ModalComponent
          openModel={openDeleteModal}
          setOpenModel={setOpenDeleteModal}
          title="Delete Item"
          subtitle="Are you sure you want to delete this item?"
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={confirmDelete} // Your delete logic
        />
      </div>
    </div>
  );
};

export default Seller_Profile;
