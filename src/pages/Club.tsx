// import React, { useState } from "react";
// import {
//   Button,
//   Modal,
//   Upload,
//   Input,
//   Switch,
//   Form,
//   message,
//   UploadFile,
//   AutoComplete,
// } from "antd";
// import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
// import { useGetAllClubQuery } from "../redux/features/getAllClubApi";
// import clubImg from "../assets/Images/dashboard/clubImg.svg";
// import { usePostCreateclubMutation } from "../redux/features/postCreateClub";
// import { usePutUpdateClubMutation } from "../redux/features/putUpdateClub";
// import { useDeleteClubMutation } from "../redux/features/deleteClubApi";
// import {
//   Autocomplete,
//   GoogleMap,
//   LoadScript,
//   Marker,
// } from "@react-google-maps/api";
// import Swal from "sweetalert2";


// interface Club {
//   club_name: string;
//   description: string;
//   latitude: number;
//   longitude: number;
//   activities: string[];
//   website: string;
//   location: string;
//   banners?: string[];
//   sponsored?: boolean;
// }

// const Club: React.FC = () => {
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [currentClub, setCurrentClub] = useState<any>(null);
//   const [fileList, setFileList] = useState<UploadFile[]>([]);
//   const [sponsored, setSponsored] = useState(false);
//   const [latitude, setLatitude] = useState<number | null>(null);
//   const [longitude, setLongitude] = useState<number | null>(null);
//   const [autocomplete, setAutocomplete] = useState(null);
//   const [form] = Form.useForm();
// console.log("36", latitude, longitude);
//   const googleMapApiKey = "AIzaSyBOx-P4WZSYeCYMbWa37lP7QMVVSuip9sc";

//   const { data, isLoading, isError, refetch } = useGetAllClubQuery();
//   console.log("data 40",data)
//   const clubName = Array.isArray(data?.data?.clubs) 
//   ? data.data?.clubs?.map((c) => c?.club_name)
//   : []; 
//   console.log("44",clubName)
//   const [postCreateclub, { isLoading: isCreating }] =
//     usePostCreateclubMutation();
//   const [putUpdateClub, { isLoading: isUpdating }] = usePutUpdateClubMutation();

//   const [deleteClub] = useDeleteClubMutation();

//   const handleNewClub = () => {
//     setIsEditMode(false);
//     setCurrentClub(null);
//     setIsModalVisible(true);
//     form.resetFields();
//     setSponsored(false);
//     setLatitude(null);
//     setLongitude(null);
//     setFileList([]);
//   };

//   const handleCancel = () => {
//     setIsModalVisible(false);
//     setFileList([]);
//     form.resetFields();
//   };

//   const handleUploadChange = ({
//     fileList: newFileList,
//   }: {
//     fileList: UploadFile[];
//   }) => {
//     setFileList(newFileList);
//   };

//   const handleSponsoredChange = (checked: boolean) => setSponsored(checked);

//   const hanldlePlaceChanged = () => {
//     if (autocomplete !== null) {
//       const place = autocomplete.getPlace();
//       const location = place.geometry?.location;
//       if (location) {
//         setLatitude(location.lat());
//         setLongitude(location.lng());
//         form.setFieldsValue({ location: place.formatted_address });
//         form.validateFields(["location"]);
//       }
//     } else {
//       console.log("autocomplete");
//     }
//   };

//   const handleFormSubmit = async (values: any) => {
//     const formData = new FormData();
//     console.log("85", formData);
//     fileList.forEach((file, index) => {
//       if (file.originFileObj) {
//         formData.append(`banners[${index}]`, file.originFileObj, file.name);
//       }
//     });
// //  if (clubName.includes(values.clubName)) {
// //     Swal.fire("Error", "Club name already exists!", "error");
// //     return; // Stop execution if duplicate is found
// //   }

// formData.append("club_name", values.clubName);
// formData.append("description", values.description);
// formData.append("latitude", latitude?.toString());
// formData.append("longitude", longitude?.toString());
// formData.append("sponsored", sponsored ? "true" : "false");
// formData.append("activities", values?.activities)
// // Convert `activities` input into an array and append each item individually
// // const activitiesArray = values.activities
// //   .split(",")
// //   .map((activity) => activity.trim());
// // activitiesArray.forEach((activity, index) => {
// //   formData.append(`activities[${index}]`, activity);
// // });

// formData.append("website", values.website);
// formData.append("location", values.location);

//     try {
//       if (isEditMode && currentClub) {
//         formData.append("_method", "PUT");
//         await putUpdateClub({ id: currentClub.id, data: formData }).unwrap();
//         message.success("Club updated successfully!");
//       } else {
//         if(clubName.includes(values.clubName)){
//           Swal.fire("Club name is exist \nplease try again")
//           return;
//         }else {
//           await postCreateclub(formData).unwrap();
//           message.success("Club created successfully!");
//         }
        
//       }

//       setIsModalVisible(false);
//       refetch();
//     } catch (error: any) {
//       console.error("Error saving club:", error);
//       message.error("Failed to save club. Please try again.");
//     }
//   };
// console.log("EditMode", isEditMode)
// console.log("current Club", currentClub)
//   const handleUpdate = (club: any) => {
//     console.log("Editing Club:", club); // Debugging
//     if (!club) {
//       console.error("Invalid club data provided");
//       return;
//     }
  
//     setIsEditMode(true);
//     setCurrentClub(club);
//     setIsModalVisible(true);
//     form.setFieldsValue({
//       clubName: club?.club_name || "",
//       description: club?.description || "",
//       latitude: club?.latitude || null,
//       longitude: club?.longitude || null,
//       activities: club?.activities || "",
//       website: club?.website || "",
//       location: club?.location || "",
//     });
    
//     setFileList(
//       club.banners?.map((banner: string, index: number) => ({
//         uid: index.toString(),
//         name: `Banner ${index + 1}`,
//         url: banner,
//       })) || []
//     );
//     setSponsored(!!club.sponsored);
//   };
  

//   const handleDelete = async (clubId) => {
//     if (clubId) {
//       try {
//         await deleteClub({ id: clubId }).unwrap();
//         console.log("Club deleted successfully:", clubId);
//         refetch();
//       } catch (error) {
//         console.error("Failed to delete club:", error);
//       }
//     } else {
//       console.error("Club ID is undefined");
//     }
//   };

//   return (
//     <div>
//       <div className="flex justify-between">
//         <h1>Clubs</h1>
//         <Button key="add-club" onClick={handleNewClub}>
//           Add New
//         </Button>
//       </div>

//       <div className="grid grid-cols-5 gap-4 justify-center py-8">
//         {isLoading && <p>Loading clubs...</p>}
//         {isError && <p>Error loading clubs. Please try again later.</p>}
//         {data?.data?.clubs?.map((club) => (
//           <div
//             className="flex flex-col items-center overflow-hidden justify-center text-center border border-gray-200 rounded-2xl p-4"
//             key={club.id}
//           >
//             <div className="h-80 overflow-hidden fit-cover">
//               <img
//                 src={club.banners[0] || clubImg}
//                 alt={club.club_name}
//                 className="mb-4 rounded-2xl h-80 w-48"
//               />
//             </div>
//             <h1 className="text-lg font-semibold">{club.club_name}</h1>
//             <p className="text-gray-500">{club.location}</p>
//             <a
//               href={club.website}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-blue-500"
//             >
//               {club.website}
//             </a>
//             <div className="flex flex-row gap-8 py-4">
//               <Button key="edit" onClick={() => handleUpdate(club)}>
//                 Edit
//               </Button>
//               <Button key="delete" onClick={() => handleDelete(club.id)}>
//                 Delete
//               </Button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Modal for Adding/Editing Club */}
//       <Modal
//         title={isEditMode ? "Edit Club" : "Add Club"}
//         visible={isModalVisible}
//         onCancel={handleCancel}
//         footer={null}
//       >
//         <Form
//          layout="vertical"
//         form={form} onFinish={handleFormSubmit}>
//           <Form.Item>
//             <Upload
//               fileList={fileList}
//               onChange={handleUploadChange}
//               beforeUpload={() => false}
//               listType="picture"
//             >
//               <Button icon={<UploadOutlined />}>
//                 Click or drag file to upload
//               </Button>
//             </Upload>
//           </Form.Item>

//           <Form.Item label="Sponsored">
//             <Switch checked={sponsored} onChange={handleSponsoredChange} />
//           </Form.Item>

//           <Form.Item
//             name="clubName"
//             label="Club Name"
//             rules={[{ required: true, message: "Please enter the club name" }]}
//           >
//             <Input className="w-full" placeholder="Enter club name" />
//           </Form.Item>

//           {/* <Form.Item
//             name="latitude"
//             label="Latitude"
//             rules={[{ required: true, message: "Please enter the latitude" }]}
//           >
//             <Input placeholder="Enter latitude" />
//           </Form.Item> */}

//           {/* <Form.Item
//             name="longitude"
//             label="Longitude"
//             rules={[{ required: true, message: "Please enter the longitude" }]}
//           >
//             <Input placeholder="Enter longitude" />
//           </Form.Item> */}

//           <Form.Item
//             name="activities"
//             label="Activities"
//             rules={[{ required: false, message: "Please enter activities" }]}
//           >
//             <Input.TextArea className="w-full h-24" placeholder="Enter activities separated by commas" />
//           </Form.Item>

//           <Form.Item
//             name="description"
//             label="Description"
//             rules={[{ required: true, message: "Please enter a description" }]}
//           >
//             <Input.TextArea placeholder="Enter description" rows={3} />
//           </Form.Item>

//           <Form.Item
//             name="location"
//             label="Location"
//             rules={[{ required: true, message: "Please enter the location" }]}
//           >
//             <LoadScript
//               googleMapsApiKey={googleMapApiKey}
//               libraries={["places"]}
//             >
//               <Autocomplete
//                 onLoad={(autocompleteInstance) =>
//                   setAutocomplete(autocompleteInstance)
//                 }
//                 onPlaceChanged={hanldlePlaceChanged}
//               >
//                 <Input className="w-full" placeholder="Search location" />
//               </Autocomplete>
//               {/* display google map */}
//               <GoogleMap
//                 mapContainerStyle={{
//                   borderRadius: "10px",
               
//                   width: "100%",
//                   height: "200px",
//                   marginTop: "16px",
//                 }}
//                 center={{ lat: latitude, lng: longitude }}
//                 zoom={12}
//               >
//                 <Marker position={{ lat: latitude, lng: longitude }} />
//               </GoogleMap>
//             </LoadScript>
//           </Form.Item>

//           <Form.Item
//             name="website"
//             label="Website"
//             rules={[
//               { type: "url", message: "Please enter a valid website URL" },
//             ]}
//           >
//             <Input className="w-full" placeholder="www.website.com" />
//           </Form.Item>

//           <Form.Item>
//             <Button
//               type="primary"
//               htmlType="submit"
//               block
//               loading={isCreating || isUpdating}
//             >
//               {isEditMode ? "Update Club" : "Create Club"}
//             </Button>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default Club;
