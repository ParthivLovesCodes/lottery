import React, { useContext } from "react";
import "./index.scss";
import { TableRow } from "../TableRow";

export const DataTable = ({ results }) => {
  return (
    <div className="table">
      <div className="table-header-1">
        <span className="draw-time">DrawTime</span>
        <span>Sangam</span>
        <span>Chetak</span>
        <span>Super</span>
      </div>
      {results?.map((item) => {
        if (item["declared"])
          return (
            <TableRow
              key={item["time"]}
              data={item}
            />
          );
        return null;
      })}
    </div>
  );
};

export default DataTable;
