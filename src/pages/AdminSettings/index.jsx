/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { AdminNavbar } from "../../components";
import { toast, ToastContainer } from "react-toastify";
import { useData } from "../../context/DataContext";
import { useLoading } from "../../context/LoadingContext";
import { Input } from "antd";
import "./index.scss";

const AdminSettings = () => {
  const { getSettingsById, updateSettingsById } = useData();
  const { showLoading, hideLoading } = useLoading();
  const [phNumber, setPhNumber] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        showLoading();
        const settingsId = "masterSettings";
        const result = await getSettingsById(settingsId);

        if (result.success) {
          setPhNumber(result.data.phoneNumber);
        } else {
          toast.error("Something Went Wrong !");
          console.error(result.error);
        }
      } catch (error) {
        console.error("Error fetching settings: ", error);
      } finally {
        hideLoading();
      }
    };

    fetchSettings();
  }, []);

  const updateHandler = async () => {
    if (phNumber.length !== 10) {
      toast.error("Please Enter Valid Number!");
      return;
    }
    try {
      showLoading();
      const data = await updateSettingsById("masterSettings", {
        phoneNumber: phNumber,
      });
      toast.success("Settings Updated Succesfully!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to the Settings!");
    } finally {
      hideLoading();
    }
  };
  return (
    <div className="admin-settings-page">
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
      <AdminNavbar />
      <div className="body-container">
        <div className="data-card">
          <div className="heading">Settings</div>
          <div className="body-main">
            <div className="fields-group">
              <div className="field-container">
                <span className="field-title">Phone Number</span>
                <Input
                  maxLength={10}
                  value={phNumber}
                  onChange={(e) => setPhNumber(e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="submit-container">
              <button
                className="submit-btn"
                onClick={updateHandler}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
