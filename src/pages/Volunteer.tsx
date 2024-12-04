import {
  Input,
  Table,
  Select,
  Modal,
  Button,
  Form,
  message,
  Upload,
  UploadFile,
} from "antd";
import React, { useState } from "react";
import { Search } from "lucide-react";
import { useGetAllVolunteerQuery } from "../redux/features/getAllVolunteer";
import { usePostAddVolunteerMutation } from "../redux/features/postAddVolunteer";
import { usePutUpdateVolunteerMutation } from "../redux/features/putUpdateVolunteer";
import {
  Autocomplete,
  GoogleMap,
  LoadScript,
  Marker,
} from "@react-google-maps/api";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

const Volunteer: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [openAddVolunteerModal, setOpenAddVolunteerModal] =
    useState<boolean>(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<any>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentVolunteer, setCurrentVolunteer] = useState<any>(null);
  const [latitude, setLatitude] = useState<number>(0); // Default to 0
  const [longitude, setLongitude] = useState<number>(0); // Default to 0
  const [autoComplete, setAutoComplete] = useState(null);
  // Store the selected volunteer for editing
  const [form] = Form.useForm();
  const googleMapApiKey = "AIzaSyBOx-P4WZSYeCYMbWa37lP7QMVVSuip9sc";
  // Fetch volunteer data from the API
  const { data, isLoading, refetch } = useGetAllVolunteerQuery();
  const [addVolunteer, { isLoading: isAdding }] = usePostAddVolunteerMutation();
  const [updateVolunteer, { isLoading: isUpdating }] =
    usePutUpdateVolunteerMutation();
  console.log("29", selectedVolunteer);
  const pageSize = 10;
  const roleOptions = [
    "02 (Lower-Intermediate)",
    "03 (Intermediate)",
    "04 (Advanced)",
    "05 (Professional)",
  ];

  const tableData = (data?.data?.volunteers || []).map((volunteer) => ({
    key: volunteer.id, // Unique key for each row in the table
    sId: volunteer.id,
    name: volunteer.name,
    location: volunteer.location,
    email: volunteer.email,
    currentLevel: volunteer.level,
    role: volunteer.role || "04 (Advanced)",
    status: volunteer.status ? "Active" : "Inactive",
  }));
  
  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Location", dataIndex: "location", key: "location" },
    { title: "Current Level", dataIndex: "currentLevel", key: "currentLevel" },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (_, record) => (
        <Select value={record.role} style={{ width: 220 }} disabled>
          {roleOptions.map((role) => (
            <Option key={role} value={role}>
              {role}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => handleEditVolunteer(record)}
          loading={isUpdating}
        >
          Update
        </Button>
      ),
    },
  ];
  
  
  const handlePageChange = (page) => setCurrentPage(page);

  const handleAddVolunteer = () => {
    // setIsEditMode(false)
    setCurrentVolunteer(null);
    setSelectedVolunteer(null); // Clear selected volunteer
    setOpenAddVolunteerModal(true);
    setLatitude(0);
    setLongitude(0);
    form.resetFields();
  };

  const handleUpload = ({
    fileList: newFileList,
  }: {
    fileList: UploadFile[];
  }) => {
    setFileList(newFileList);
  };

  
  const hanldlePlaceChanged = () => {
    if (autoComplete !== null) {
      const place = autoComplete.getPlace();
      const location = place.geometry?.location;
      if (location) {
        setLatitude(location.lat());
        setLongitude(location.lng());
        form.setFieldsValue({ location: place.formatted_address });
        form.validateFields(["location"]);
      }
    } else {
      console.log("autocomplete");
    }
  };
  const handleAddVolunteerSubmit = async (values: any) => {
    const formData = new FormData();
    fileList.forEach((file, index) => {
      if (file.originFileObj) {
        formData.append(`banners[${index}]`, file.originFileObj, file.name);
      }
    });
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("location", values.location);
    formData.append("phone_number", values.phoneNumber);
    formData.append("level", values.level);
    formData.append("role", values.role);
    // formData.append("status", values.status);
    // await addVolunteer(values).unwrap();
    // message.success("Volunteer added successfully!");
    // setOpenAddVolunteerModal(false);
    // refetch();
    try {
      if (isEditMode && selectedVolunteer) {
        // If editing, use PUT to update the volunteer
        formData.append("_method", "PUT");
        await updateVolunteer({
          id: selectedVolunteer.sId,
          data: formData,
        }).unwrap();
        message.success("Volunteer updated successfully!");
      } else {
        // If adding a new volunteer, use POST
        await addVolunteer(formData).unwrap();
        message.success("Volunteer added successfully!");
      }
      setOpenAddVolunteerModal(false);
      refetch();
    } catch (error) {
      console.error("Error saving volunteer:", error);
      message.error("Failed to save volunteer. Please try again.");
    }
  };
  const handleEditVolunteer = (volunteer) => {
    setIsEditMode(true);
    setSelectedVolunteer(volunteer); // Set the selected volunteer data
    form.setFieldsValue({
      name: volunteer.name,
      email: volunteer.email,
      location: volunteer.location,
      level: volunteer.currentLevel,
      role: volunteer.role,
    });
    setFileList(
      volunteer.banners?.map((banner: string, index: number) => ({
        uid: index.toString(),
        name: `Banner ${index + 1}`,
        url: banner,
      })) || []
    );
    setOpenAddVolunteerModal(true);
  };
  return (
    <div className="py-4">
      <div className="flex justify-between">
        <Input
          prefix={<Search />}
          className="w-[50%] rounded-2xl h-12 bg-base border-0 text-primary placeholder:text-gray-200"
          placeholder="Search Volunteer"
          style={{ backgroundColor: "#f0f0f0", color: "#333333" }}
        />
        <Button onClick={handleAddVolunteer}>Add Volunteer</Button>
      </div>
      <div className="py-8">
        <Table
          dataSource={tableData}
          columns={columns}
          loading={isLoading}
          pagination={{
            pageSize,
            total: data?.data?.meta?.total_volunteers || 0,
            current: currentPage,
            onChange: handlePageChange,
          }}
        />

        {/* Add/Edit Volunteer Modal */}
        <Modal
          title={selectedVolunteer ? "Edit Volunteer" : "Add New Volunteer"}
          visible={openAddVolunteerModal}
          onCancel={() => setOpenAddVolunteerModal(false)}
          footer={null}
        >
          <Form
            layout="vertical"
            form={form}
            onFinish={handleAddVolunteerSubmit}
          >
            <Form.Item label="Upload Images">
              <Upload
                fileList={fileList}
                onChange={handleUpload}
                beforeUpload={() => false}
                listType="picture-card"
              >
                {fileList.length < 5 && (
                  <div>
                    <Button icon={<UploadOutlined />}>Upload</Button>
                  </div>
                )}
              </Upload>
            </Form.Item>
            <Form.Item
              name="name"
              label="Name"
              rules={[
                {
                  required: true,
                  message: "Please enter the volunteer's name",
                },
              ]}
            >
              <Input placeholder="Enter name" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Please enter a valid email",
                },
              ]}
            >
              <Input placeholder="Enter email" />
            </Form.Item>

            <Form.Item
              name="location"
              label="Location"
              rules={[{ required: true, message: "Please enter the location" }]}
            >
              <LoadScript
                googleMapsApiKey={googleMapApiKey}
                libraries={["places"]}
              >
                <Autocomplete
                  onLoad={(autocompleteInstance) =>
                    setAutoComplete(autocompleteInstance)
                  }
                  onPlaceChanged={hanldlePlaceChanged}
                >
                  <Input placeholder="Search location" />
                </Autocomplete>
                {/* display google map */}
                <GoogleMap
                  mapContainerStyle={{
                    width: "100%",
                    height: "200px",
                    marginTop: "16px",
                  }}
                  center={{ lat: latitude, lng: longitude }}
                  zoom={12}
                >
                  <Marker position={{ lat: latitude, lng: longitude }} />
                </GoogleMap>
              </LoadScript>
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              label="Phone Number"
              rules={[{ required: true, message: "Please enter the location" }]}
            >
              <Input placeholder="Enter location" />
            </Form.Item>

            <Form.Item
              name="level"
              label="Current Level"
              rules={[
                { required: true, message: "Please enter the current level" },
              ]}
            >
              <Input placeholder="Enter current level" />
            </Form.Item>

            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: "Please select a role" }]}
            >
              <Select placeholder="Select a role">
                {roleOptions.map((roleOption) => (
                  <Option key={roleOption} value={roleOption}>
                    {roleOption}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            {/* 
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: "Please enter the current level" }]}
            >
              <Input placeholder="Enter current level" />
            </Form.Item> */}

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isAdding || isUpdating}
              >
                {selectedVolunteer ? "Update Volunteer" : "Add Volunteer"}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Volunteer;
