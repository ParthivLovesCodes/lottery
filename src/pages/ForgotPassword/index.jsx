import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Card, Input } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.scss";
import { useLoading } from "../../context/LoadingContext";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);

  const { showLoading, hideLoading } = useLoading();
  const { resetPassword, checkUserExists } = useAuth();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };
  const validateForm = () => {
    setEmailError(false);
    let valid = true;
    if (!email || !validateEmail(email)) {
      setEmailError(true);
      valid = false;
    }
    return valid;
  };

  const handlePasswordReset = async () => {
    if (!validateForm()) {
      console.log("Form Invalid");
      return;
    }
    try {
      showLoading();
      const res = await checkUserExists(email);
      if (!res) {
        toast.error("Account Does Not Exists !!");
        return;
      }
      await resetPassword(email);
      setEmail("");
      toast.success("Success: Please Check Your Email");
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong!");
    } finally {
      hideLoading();
    }
  };
  return (
    <div className="login">
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        pauseOnHover
        theme="light"
      />
      <Card className="card">
        <p className="card-heading">Enter Your Email</p>
        <div className="field-container">
          <Input
            status={emailError ? "error" : ""}
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmailError(false);
              setEmail(e.target.value);
            }}
          />
          {emailError ? (
            <span className="field-error-msg">Please Enter Valid Email</span>
          ) : null}
        </div>
        <button
          className="login-btn"
          onClick={handlePasswordReset}
        >
          Reset Password
        </button>
        <Link
          className="blue-link-text"
          to="/login"
        >
          Login
        </Link>
      </Card>
    </div>
  );
};

export default ForgotPassword;
