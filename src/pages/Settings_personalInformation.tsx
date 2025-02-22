import React, { useState, useEffect } from "react";
import { Upload, Input, Button, Form, message, Alert } from "antd";
import type { UploadFile, UploadProps, FormProps } from "antd";
import ImgCrop from "antd-img-crop";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import Swal from "sweetalert2";
import { useGetProfileQuery } from "../redux/features/getProfileApi";
import { useUpdateUserAvatarMutation } from "../redux/features/postUpdateAvatar";
import { useUpdatePersonalInformationMutation } from "../redux/features/putUpdatePersonalInfromation";

type FileType = Exclude<Parameters<UploadProps["beforeUpload"]>[0], undefined>;

interface FieldType {
  name?: string;
  email?: string;
  password?: string;
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const SettingsPersonalInformation: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewImage, setPreviewImage] = useState<string | undefined>(
    undefined
  );
  const [form] = Form.useForm();
  const { data, isLoading, isError } = useGetProfileQuery({});
  const [updateUserAvatar] = useUpdateUserAvatarMutation();
  const [updatePersonalInformation] = useUpdatePersonalInformationMutation();
  console.log("+++++", data?.data?.avatar);

  // Mock data for personal information
  const mockData = {
    full_name: "John Doe",
    email: "john.doe@example.com",
    image: "https://example.com/profile.png", // Replace with an actual image URL
  };

  useEffect(() => {
    // Set the form fields with mock data
    form.setFieldsValue({
      first_name: data?.data?.first_name,
      last_name: data?.data?.last_name,
      email: data?.data?.email,
    });

    if (data?.data?.avatar) {
      const imageUrl = data?.data?.avatar;
      setFileList([
        {
          uid: "-1",
          name: "profile.png",
          status: "done",
          url: imageUrl,
        } as UploadFile,
      ]);
      setPreviewImage(imageUrl);
    }
  }, [form]);

  const onChange: UploadProps["onChange"] = async ({
    fileList: newFileList,
  }) => {
    setFileList(newFileList);

    if (newFileList.length > 0) {
      const uploadedFile = newFileList[0].originFileObj; // Get the uploaded file

      if (uploadedFile) {
        // Simulating image upload response
        try {
          const formData = new FormData();
          formData.append("avatar", uploadedFile);
          formData.append("_method", "PUT");
          console.log("formData", formData);
          const res = await updateUserAvatar({ data: formData });
          console.log("update image res", res);
        } catch (error) {
          console.log(error);
        }
        console.log("Image upload response:", { status: "success" });

        Swal.fire({
          icon: "success",
          title: "Image Updated",
          text: "Your profile image has been successfully updated!",
          timer: 3000,
          toast: true,
          position: "center",
          showConfirmButton: false,
        });
      }
    }
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    if (!fileList.length || !fileList[0].originFileObj) {
      message.error("Please upload a profile image");
      return;
    }
    console.log(fileList)

    // Create a FormData object and append form values
    const formData = new FormData();
    // formData.append("_method", "PUT");
    formData.append("first_name", values.first_name || "");
    formData.append("last_name", values.last_name || "");
    formData.append("email", values.email || "");
    formData.append("old_password", values.oldPassword || "");
    formData.append("password", values.newPassword || "");
    formData.append("password_confirmation", values.confirmPassword || "");

    // Append the image file as a File object
    const imageFile = fileList[0].originFileObj as File;
    formData.append("avatar", imageFile, imageFile.name);

    // Simulating profile update
    try {
      console.log("formData", formData)
      const updataRes = await updatePersonalInformation(formData)
      console.log("update res",updataRes)
      console.log("FormData content:", Array.from(formData.entries()));
      if(updataRes?.data?.success === true) {
        Swal.fire({
          icon: "success",
          title: "Profile Updated",
          text: "Your profile has been successfully updated!",
          timer: 3000,
          toast: true,
          position: "center",
          showConfirmButton: false,
        });
      }else {
        Swal.fire({
          icon: "warning",
          title: "Profile not Updated",
          text: updataRes?.error?.data?.error,
          timer: 3000,
          toast: true,
          position: "center",
          showConfirmButton: false,
        });
        console.log(updataRes?.error?.data?.error)
      }
    } catch (error) {
      message.error("Failed to update profile");
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="border border-gray-200 h-[80vh] py-12 rounded-2xl flex flex-col items-center">
      <div className="flex justify-center mb-6">
        <ImgCrop rotationSlider>
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={onChange}
            onPreview={onPreview}
          >
            {fileList.length < 1 && "+ Upload"}
          </Upload>
        </ImgCrop>
      </div>
      <Form
        name="basic"
        form={form}
        layout="vertical"
        style={{ width: "100%", maxWidth: "800px", marginTop: "50px" }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <div className="flex gap-4">
          <Form.Item<FieldType>
            name="first_name"
            label="First Name"
            rules={[{ required: false, message: "Please input your name!" }]}
            className="flex-1"
          >
            <Input placeholder="First Name" className="h-12" />
          </Form.Item>

          <Form.Item<FieldType>
            name="last_name"
            label="Last Name"
            rules={[{ required: false, message: "Please input your name!" }]}
            className="flex-1"
          >
            <Input placeholder="Last Name" className="h-12" />
          </Form.Item>
        </div>

        <Form.Item<FieldType>
          name="email"
          label="Email"
          rules={[{ required: false, message: "Please input your email!" }]}
        >
          <Input readOnly placeholder="Email" className="h-12" />
        </Form.Item>
        <Form.Item<FieldType>
          name="oldPassword"
          label="Old Password"
          rules={[
            { required: false, message: "Please input your old password!" },
          ]}
        >
          <Input.Password
            placeholder="Old Password"
            className="h-12"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>
        <Form.Item<FieldType>
          name="newPassword"
          label="New Password"
          rules={[
            { required: false, message: "Please input your new password!" },
          ]}
        >
          <Input.Password
            placeholder="New Password"
            className="h-12"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>
        <Form.Item<FieldType>
          name="confirmPassword"
          label="Confirm Password"
          rules={[{ required: false, message: "Please confirm your password!" }]}
        >
          <Input.Password
            placeholder="Confirm Password"
            className="h-12"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            className="w-full h-12 bg-[#4964C6]"
            htmlType="submit"
          >
            Edit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SettingsPersonalInformation;
