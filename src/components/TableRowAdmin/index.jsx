import React from "react";
import "./index.scss";
import { useNavigate } from "react-router-dom";

export const TableRowAdmin = ({ data, date }) => {
  const navigate = useNavigate();
  return (
    <div className="table-body">
      <span className="draw-time">{data["time"]}</span>
      <span>{data["1_"]}</span>
      <span>{data["2_"]}</span>
      <span>{data["3_"]}</span>
      <span className={data["declared"] ? "green" : "red"}>
        {data["declared"] ? "✅" : "-"}
      </span>
      <span
        className="blue-link-text"
        onClick={() => navigate(`/admin/edit/${date}/${data["id"]}`)}
      >
        {"Edit"}
      </span>
    </div>
  );
};
