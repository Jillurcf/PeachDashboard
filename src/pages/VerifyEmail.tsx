import React, { useEffect, useState } from "react";
import AuthWrapper from "../component/share/AuthWrapper";
import { Button, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Images/LogoOkProPadel.png";
import { usePostOtpMutation } from "../redux/features/postOtpVerifyApi";
import { useResendOtpMutation } from "../redux/features/postResendOtp";

// Assuming `Input.OTP` is a custom input component
interface OTPInputProps {
  size?: "large" | "small" | "middle";
  className?: string;
  style?: React.CSSProperties;
  length: number;
  formatter?: (str: string) => string;
  onChange: (text: string) => void;
}

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(''); // State to store OTP input
  const [resendOtp] = useResendOtpMutation()
  useEffect(() => {
    const emailGet =   localStorage.getItem("ForgetPasswordEmail");
    setEmail(emailGet)
    }, [])
  // Call the mutation hook properly with parentheses
  const [postOtp, { isLoading }] = usePostOtpMutation();

  // Define the `onChange` handler with the correct type
  const onChange = (text: string) => {
    console.log("onChange:", text);
    setOtp(text);
  };

  const handleVerify = async () => {
    try {
      const response = await postOtp({ otp }).unwrap(); // Use the correct mutation function name here
      console.log("OTP verification response:", response);

      if (response?.error) {
        message.error(response.error.data?.message || "OTP verification failed.");
      } else if (response?.data) {
        message.success("OTP verified successfully!");
        navigate("/auth/set-new-password");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      message.error("Something went wrong, please try again.");
    }
  };
const handleResendOtp = async() => {
  
 const response = await resendOtp({email: email}).unwrap(); 
    
    console.log("Resend OTP verification response:", response);
}
  return (
    <AuthWrapper>
      <div className="text-center mb-12">
        <div className="flex py-8">
          <div className="flex items-center mx-auto gap-2">
            <img src={logo} alt="Logo" className="w-20" />
            <h1 className="font-bold text-3xl">Choozy</h1>
          </div>
        </div>
        <p>
          We sent a reset link to {"fahim"}, enter the 5-digit code mentioned in
          the email.
        </p>
      </div>

      {/* Assuming `Input.OTP` is a custom component */}
      <Input.OTP
        size="large"
        className="otp-input"
        style={{ width: "100%", height: "50px" }}
        length={6}
        formatter={(str: string) => str.toUpperCase()}
        onChange={onChange}
      />

      <Button
        className="bg-[#4964C6] h-12 text-white text-lg w-full mt-14"
        onClick={handleVerify}
        loading={isLoading}
      >
        Verify Code
      </Button>

      <p className="text-center mt-10">
        You have not received the email?
        <Button onClick={handleResendOtp} className="pl-0" type="link">
          Resend
        </Button>
      </p>
    </AuthWrapper>
  );
};

export default VerifyEmail;
