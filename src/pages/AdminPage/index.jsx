/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "./index.scss";
import { DatePicker } from "antd";
import moment from "moment";
import dayjs from "dayjs";
import { useData } from "../../context/DataContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLoading } from "../../context/LoadingContext";
import { useParams } from "react-router-dom";
import { AdminNavbar, DataTableAdmin } from "../../components";

const getTodayDate = () => {
  return moment().format("DD-MM-YYYY");
};

const AdminPage = () => {
  const { date: dateId } = useParams();
  const { getResultsByDate, createDayDoc, getSettingsById } = useData();
  const { showLoading, hideLoading } = useLoading();

  const [date, setDate] = useState(dateId ?? getTodayDate());
  const [ticketName1, setTicketName1] = useState("");
  const [ticketName2, setTicketName2] = useState("");
  const [ticketName3, setTicketName3] = useState("");
  const [results, setResults] = useState([]);
  const [newNeeded, setNewNeeded] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        showLoading();
        const settingsId = "masterSettings";
        const result = await getSettingsById(settingsId);

        if (result.success) {
          setTicketName1(result.data.ticketName1);
          setTicketName2(result.data.ticketName2);
          setTicketName3(result.data.ticketName3);
        } else {
          toast.error("Something Went Wrong !");
          console.error(result.error);
        }
        const data = await getResultsByDate(date);
        if (data?.data) {
          setResults(data?.data);
        } else if (data?.error === "Not Found!") {
          setNewNeeded(true);
        } else {
          toast.error("Something Went Wrong!");
        }
      } catch (error) {
        console.error("Error fetching results: ", error);
      } finally {
        hideLoading();
      }
    };
    fetchResults();
  }, [newNeeded, dateId]);

  const createDay = async () => {
    try {
      showLoading();
      const res = await createDayDoc(date);
      if (!res?.success) {
        toast.error(res.message);
        return;
      }
      setNewNeeded(false);
      toast.success("Data Created Successfully!");
    } catch (error) {
      toast.error("Unable to create data!");
    } finally {
      hideLoading();
    }
  };

  const handleDateChange = (_, dateString) => {
    setDate(() => dateString);
  };

  const submitSearch = async () => {
    try {
      showLoading();
      const data = await getResultsByDate(date);
      if (data?.data) {
        setResults(data?.data);
        setNewNeeded(false);
      } else if (data?.error === "Not Found!") {
        setNewNeeded(true);
      } else {
        toast.error("Something Went Wrong!");
      }
    } catch (error) {
      toast.error("Unable to fetch data!");
    } finally {
      hideLoading();
    }
  };

  return (
    <div className="admin-page">
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
          <div className="body-top-1">
            <DatePicker
              className="date-input"
              onChange={handleDateChange}
              format={"DD-MM-YYYY"}
              defaultValue={dayjs(date, "DD-MM-YYYY")}
              size="small"
            />
            <button
              type="button"
              className="search-btn"
              onClick={submitSearch}
            >
              Search
            </button>
          </div>
          <div className="body-main">
            {newNeeded ? (
              <div className="create-day">
                <span>No Data Found!</span>
                <button
                  className="create-btn"
                  onClick={createDay}
                >
                  Create Data
                </button>
              </div>
            ) : (
              <DataTableAdmin
                dataArr={results}
                date={date}
                ticketName1={ticketName1}
                ticketName2={ticketName2}
                ticketName3={ticketName3}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
