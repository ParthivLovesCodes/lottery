import React, { useContext } from "react";
import "./index.scss";
import { TableRowAdmin } from "../TableRowAdmin";

export const DataTableAdmin = ({ dataArr, date }) => {
  return (
    <div className="table">
      <div className="table-header">
        <span className="draw-time">Time</span>
        <span>Super</span>
        <span>Deluxe</span>
        <span>Sky</span>
        <span>Status</span>
        <span>Action</span>
      </div>
      {dataArr?.map((data) => (
        <TableRowAdmin
          key={data["id"]}
          data={data}
          date={date}
        />
      ))}
    </div>
  );
};
