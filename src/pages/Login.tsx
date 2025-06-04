import React, { useEffect, useState } from "react";
import AuthWrapper from "../component/share/AuthWrapper";
import { Button, Checkbox, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { usePostLoginMutation } from "../redux/features/postLoginApi";
import Swal from "sweetalert2";

interface LoginFormValues {
  email: string;
  password: string;
  remember?: boolean;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm(); 
  const [setData, { isLoading, isError, status, error, data }] =
    usePostLoginMutation();

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedPassword = localStorage.getItem("rememberedPassword");
    const savedRemember = !!(savedEmail && savedPassword);

    // Dynamically set form fields when localStorage values are loaded
    form.setFieldsValue({
      email: savedEmail || "",
      password: savedPassword || "",
      remember: savedRemember,
    });
  }, [form]);

  const onFinish = async (values: LoginFormValues) => {
    const { email, password, remember } = values;
    console.log("Sending payload:", { email, password });

    try {
      const response = await setData({ email, password });
      console.log("Response:", response);

      if (response?.error) {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: response.error.data?.message || "An error occurred.",
        });
      } else if (response?.data) {
        localStorage.setItem("token", response?.data.access_token);
        if (remember) {
          localStorage.setItem("rememberedEmail", email);
          localStorage.setItem("rememberedPassword", password);
        } else {
          localStorage.removeItem("rememberedEmail");
          localStorage.removeItem("rememberedPassword");
        }
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: response.data.message,
          showConfirmButton: false,
          timer: 1500,
        });
        if(response?.data?.access_token){
          navigate("/");
        }
       
      }
    } catch (error) {
      console.error("Network or unexpected error:", error);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Something went wrong, please try again.",
      });
    }
  };

  return (
    <AuthWrapper>
      <div className="text-center mb-12">
        <div className="flex py-8">
          <div className="flex items-center mx-auto gap-2">
            {/* <img src={logo} alt="Logo" className="w-20" /> */}
            <h1 className="font-bold text-3xl">PEACH</h1>
          </div>
        </div>
        <p>Please enter your email and password to continue</p>
      </div>
      <Form<LoginFormValues>
        form={form} // Bind the form instance
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please enter your email" }]}
        >
          <Input placeholder="Enter your email" style={{ height: "50px" }} />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password placeholder="Enter your password" style={{ height: "50px" }} />
        </Form.Item>
        <Form.Item>
          <div className="flex justify-between items-center">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <Link className="login-form-forgot" to="/auth/forget-password">
              Forgot password
            </Link>
          </div>
        </Form.Item>
        <Form.Item>
          <Button
            className="bg-[#4964C6] h-12 text-white text-lg w-full mt-6"
            htmlType="submit"
          >
            Sign In
          </Button>
        </Form.Item>
      </Form>
    </AuthWrapper>
  );
};

export default Login;
