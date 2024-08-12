/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { BoxFooter, DataTable } from "../../components";
import "./index.scss";
import { DatePicker } from "antd";
import moment from "moment";
import dayjs from "dayjs";
import { DataContext } from "../../context/DataContext";
import { toast } from "react-toastify";

const getTodayDate = () => {
  return moment().format("DD-MM-YYYY");
};

const HomePage = () => {
  const [date, setDate] = useState(getTodayDate());
  const { getResultsByDate } = useContext(DataContext);
  const [results, setResults] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await getResultsByDate(date);
        if (data?.data) {
          setResults(data?.data);
        } else if (data?.error === "Not Found!") {
          setResults([]);
        } else {
          toast.error("Something Went Wrong!");
        }
      } catch (error) {
        console.error("Error fetching results: ", error);
      }
    };
    fetchResults();
  }, []);

  const handleDateChange = (_, dateString) => {
    setDate(() => dateString);
  };

  const submitSearch = async () => {
    try {
      const data = await getResultsByDate(date);
      if (data?.data) {
        setResults(data?.data);
      } else if (data?.error === "Not Found!") {
        setResults([]);
      } else {
        toast.error("Something Went Wrong!");
      }
    } catch (error) {
      console.error("Error fetching results: ", error);
    }
  };
  return (
    <div className="home-page">
      <div className="box-container">
        <div className="top-panel">
          <p className="main-heading">Play India Lottery</p>
          <p className="sub-heading">Daily Result Chart</p>
          <p className="info">
            CONTACT FOR RESULT SMS & CUSTOMER CARE: 9555999608
          </p>
          <label>
            Select Date
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
          </label>
        </div>
        <DataTable results={results} />
        <BoxFooter />
      </div>
    </div>
  );
};

export default HomePage;
