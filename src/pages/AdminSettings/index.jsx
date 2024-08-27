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
  const [ticketName1, setTicketName1] = useState("");
  const [ticketName2, setTicketName2] = useState("");
  const [ticketName3, setTicketName3] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        showLoading();
        const settingsId = "masterSettings";
        const result = await getSettingsById(settingsId);

        if (result.success) {
          setPhNumber(result.data.phoneNumber);
          setTicketName1(result.data.ticketName1);
          setTicketName2(result.data.ticketName2);
          setTicketName3(result.data.ticketName3);
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
    const tickName1 = ticketName1.trim();
    const tickName2 = ticketName2.trim();
    const tickName3 = ticketName3.trim();
    if (phNumber.length !== 10) {
      toast.error("Please Enter Valid Number!");
      return;
    }
    if (
      tickName1.length === 0 ||
      tickName2.length === 0 ||
      tickName3.length === 0
    ) {
      toast.error("Please Enter Ticket Types!");
      return;
    }
    try {
      showLoading();
      const data = await updateSettingsById("masterSettings", {
        phoneNumber: phNumber,
        ticketName1: tickName1,
        ticketName2: tickName2,
        ticketName3: tickName3,
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
            <div className="fields-group rm-md">
              <div className="field-container">
                <span className="field-title">Ticket Type 1</span>
                <Input
                  value={ticketName1}
                  onChange={(e) => setTicketName1(e.target.value)}
                />
              </div>
              <div className="field-container">
                <span className="field-title">Ticket Type 2</span>
                <Input
                  value={ticketName2}
                  onChange={(e) => setTicketName2(e.target.value)}
                />
              </div>
              <div className="field-container">
                <span className="field-title">Ticket Type 3</span>
                <Input
                  value={ticketName3}
                  onChange={(e) => setTicketName3(e.target.value)}
                />
              </div>
            </div>
            <div className="fields-group rm-mt">
              <div className="field-container">
                <span className="field-title">Phone Number</span>
                <Input
                  maxLength={10}
                  value={phNumber}
                  onChange={(e) => setPhNumber(e.target.value)}
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
