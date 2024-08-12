import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Card, Input } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.scss";
import { useLoading } from "../../context/LoadingContext";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const { showLoading, hideLoading } = useLoading();
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };
  const validateForm = () => {
    setEmailError(false);
    setPasswordError(false);
    let valid = true;
    if (!email || !validateEmail(email)) {
      setEmailError(true);
      valid = false;
    }
    if (!password) {
      setPasswordError(true);
      valid = false;
    }
    return valid;
  };

  const handleSignIn = async () => {
    if (!validateForm()) {
      console.log("Form Invalid");
      return;
    }
    try {
      showLoading();
      const res = await signIn(email, password);
      toast.success("Login Successful");
      navigate("/admin");
    } catch (error) {
      if (error?.code) {
        if (error.code === "auth/invalid-credential") {
          toast.error("Incorrect Credentials !!");
        } else if (
          error.code === "auth/wrong-password" ||
          error.code === "auth/user-not-found"
        ) {
          toast.error("Incorrect Credentials !!");
        } else {
          toast.error("Something Went Wrong! Please Try Again Later.");
        }
      } else {
        toast.error("Something Went Wrong!");
      }
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
        <p className="card-heading">Enter Credentials</p>
        <div className="field-container">
          <Input
            status={emailError ? "error" : ""}
            placeholder="Email"
            type="email"
            onChange={(e) => {
              setEmailError(false);
              setEmail(e.target.value);
            }}
          />
          {emailError ? (
            <span className="field-error-msg">Please Enter Valid Email</span>
          ) : null}
        </div>
        <div className="field-container">
          <Input.Password
            status={passwordError ? "error" : ""}
            placeholder="Password"
            onChange={(e) => {
              setPasswordError(false);
              setPassword(e.target.value);
            }}
          />
          {passwordError ? (
            <span className="field-error-msg">Please Enter Your Password</span>
          ) : null}
        </div>
        <button
          className="login-btn"
          onClick={handleSignIn}
        >
          Login
        </button>
        <Link
          className="blue-link-text"
          to="/forgot-password"
        >
          Forgot Password?
        </Link>
      </Card>
    </div>
  );
};

export default LoginPage;
