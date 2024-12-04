import React, { useState } from "react";
import AuthWrapper from "../component/share/AuthWrapper";
import { Button, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Images/LogoOkProPadel.png";
import { usePostForgetPasswordMutation } from "../redux/features/postForgetPasswordApi";
import Swal from "sweetalert2";

interface ForgetPasswordFormValues {
  email: string;
}

const ForgetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [setForgetPassword, { isLoading }] = usePostForgetPasswordMutation();
  const [email, setEmail] = useState('')

  const onFinish = async (values: ForgetPasswordFormValues) => {
    console.log("Submitted values:", values);

    try {
      const response = await setForgetPassword(values).unwrap(); // Unwrap to directly access data
      console.log("API response:", response);
      localStorage.setItem("ForgetPasswordEmail", email)

      if (response?.success) {
        Swal.fire({
          icon: "success",
          title: "Email Sent",
          text: response?.message || "Please check your email for verification.",
        });
        console.log("Navigating to /auth/verify...");
        navigate("/auth/verify");
      } else {
        console.log("Unexpected status code:", response?.success);
      }
    } catch (err: any) {
      console.error("Error response:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.data?.message || "An error occurred. Please try again.",
        footer: '<a href="#">Why do I have this issue?</a>',
      });
    }
  };

  return (
    <AuthWrapper>
      <div className="text-center mb-12">
        <div className="flex py-8">
          <div className="flex items-center mx-auto gap-2">
            <img src={logo} alt="Logo" className="w-20" />
            <h1 className="font-bold text-3xl">Choozy</h1>
          </div>
        </div>
        <p>Please enter your email and click send</p>
      </div>
      <Form<ForgetPasswordFormValues> layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please enter your email" }]}
        >
          <Input 
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          placeholder="Enter your email" style={{ height: "50px" }} />
        </Form.Item>

        <Form.Item>
          <Button
            className="bg-[#4964C6] h-12 text-white text-lg w-full mt-6"
            htmlType="submit"
            loading={isLoading} // Show loading spinner while submitting
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </AuthWrapper>
  );
};

export default ForgetPassword;
