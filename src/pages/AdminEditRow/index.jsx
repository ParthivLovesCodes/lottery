/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "./index.scss";
import { useNavigate, useParams } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { toast, ToastContainer } from "react-toastify";
import { Input, Select } from "antd";
import { useLoading } from "../../context/LoadingContext";
import { AdminNavbar } from "../../components";

const AdminEditRow = () => {
  const { date, timeId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [col1, setCol1] = useState("");
  const [col2, setCol2] = useState("");
  const [col3, setCol3] = useState("");
  const [declared, setDeclared] = useState(false);
  const [time, setTime] = useState(null);

  const navigate = useNavigate();
  const { getResultByDateTime, updateResultByDateTime } = useData();
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        showLoading();
        const { data, error } = await getResultByDateTime(date, timeId);

        if (error) {
          setError(error);
        } else {
          setCol1(data["1_"]);
          setCol2(data["2_"]);
          setCol3(data["3_"]);
          setDeclared(data["declared"]);
          setTime(data["time"]);
        }

        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error("Something Went Wrong !");
      } finally {
        hideLoading();
      }
    };

    fetchDocument();
    hideLoading();
  }, [date, timeId]);

  const handleSubmit = async () => {
    if (col1 === "" || col2 === "" || col3 === "") {
      toast.error("Please Enter Valid Numbers !");
      return;
    }
    try {
      showLoading();
      const res = await updateResultByDateTime(date, timeId, {
        "1_": col1,
        "2_": col2,
        "3_": col3,
        declared: declared,
      });
      toast.success("Updated SuccessFully !");
      navigate(`/admin/${date}`);
    } catch (error) {
      toast.error("Failed to Update Data !");
    } finally {
      hideLoading();
    }
  };

  if (loading) {
    return <div></div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

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
          <div className="body-top">
            <span>Date: {date}</span>
            <span>Time: {time ? time : "N/A"}</span>
          </div>
          <div className="body-main">
            <div className="fields-group">
              <div className="field-container">
                <span className="field-title">Sangam</span>
                <Input
                  maxLength={2}
                  value={col1}
                  onChange={(e) => setCol1(e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
              <div className="field-container">
                <span className="field-title">Chetak</span>
                <Input
                  maxLength={2}
                  value={col2}
                  onChange={(e) => setCol2(e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
              <div className="field-container">
                <span className="field-title">Super</span>
                <Input
                  maxLength={2}
                  value={col3}
                  onChange={(e) => setCol3(e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
            <div className="submit-container">
              <Select
                defaultValue={declared}
                style={{ width: 120 }}
                onChange={setDeclared}
                options={[
                  { value: true, label: "Declare" },
                  { value: false, label: "Undeclare" },
                ]}
              />
              <button
                className="submit-btn"
                onClick={handleSubmit}
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

export default AdminEditRow;
