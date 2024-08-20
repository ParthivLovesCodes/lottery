/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { BoxFooter, DataTable } from "../../components";
import "./index.scss";
import { DatePicker } from "antd";
import moment from "moment";
import dayjs from "dayjs";
import { DataContext } from "../../context/DataContext";
import { toast } from "react-toastify";
import { useLoading } from "../../context/LoadingContext";
import { Helmet } from "react-helmet";

const getTodayDate = () => {
  return moment().format("DD-MM-YYYY");
};

const HomePage = () => {
  const [phNumber, setPhNumber] = useState("XXXXXXXXXX");
  const [date, setDate] = useState(getTodayDate());
  const { getResultsByDate, getSettingsById } = useContext(DataContext);
  const { showLoading, hideLoading } = useLoading();
  const [results, setResults] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        showLoading();
        const data = await getResultsByDate(date);
        const settings = await getSettingsById("masterSettings");
        setPhNumber(settings?.data?.phoneNumber);
        if (data?.data) {
          setResults(data?.data);
        } else if (data?.error === "Not Found!") {
          setResults([]);
        } else {
          toast.error("Something Went Wrong!");
        }
      } catch (error) {
        console.error("Error fetching Data: ", error);
      } finally {
        hideLoading();
      }
    };
    fetchResults();
  }, []);

  const handleDateChange = (_, dateString) => {
    setDate(() => dateString);
  };

  const submitSearch = async () => {
    try {
      showLoading();
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
    } finally {
      hideLoading();
    }
  };
  return (
    <div className="home-page">
      <Helmet>
        <title>Play India Lottery Deluxe | Best Online Lottery in India</title>
        <meta
          name="description"
          content="Play India Lottery and win big with Play India Lottery Deluxe. The best online lottery platform in India. Join now!"
        />
        <meta
          name="keywords"
          content="Play India Lottery, Play India Lottery Deluxe, India lottery, online lottery, win big"
        />
      </Helmet>
      <div className="box-container">
        <div className="top-panel">
          <h1 className="main-heading">Play India Lottery Deluxe</h1>
          <p className="sub-heading">Daily Result Chart</p>
          <p className="info">
            CONTACT FOR RESULT SMS & CUSTOMER CARE: {phNumber}
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
