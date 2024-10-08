import React from "react";
import "./index.scss";

export const TableRow = ({ data }) => {
  return (
    <div className="table-body-1">
      <span className="draw-time">{data["time"]}</span>
      <span>{data["1_"]}</span>
      <span>{data["2_"]}</span>
      <span>{data["3_"]}</span>
    </div>
  );
};
