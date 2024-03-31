import React, { useState } from "react";
import { Select, Table } from "antd";
import { columns } from "./columns";
import data from "../data/data.json";
import Search from "./Search";

// import data_1 from "../data/data50k_1.json";
// import data_2 from "../data/data50k_2.json";
// import data_3 from "../data/data50k_3.json";
// import data_4 from "../data/data50k_4.json";

// 100k, 500k, 1 million, 10 million

const TableWrapper = () => {
  const newData = new Array(50).fill(data).flat(); // making 10 million rows
  const [dataSource, setDataSource] = useState(newData);
  const [totalTime, setTotalTime] = useState([]);

  console.log("dd: ", dataSource.length);

  const handleDataLength = (value) => {
    setDataSource(newData.slice(0, value));
  };

  return (
    <div className="container">
      <div className="actions">
        <Search
          data={dataSource}
          setDataSource={setDataSource}
          setTotalTime={setTotalTime}
        />
        Number of Records:
        <Select
          defaultValue={10000000}
          style={{ width: 150, marginLeft: 5 }}
          onChange={handleDataLength}
          options={[
            {
              value: 100000,
              label: "100 Thousand",
            },
            {
              value: 500000,
              label: "500 Thousand",
            },
            {
              value: 1000000,
              label: "1 Million",
            },
            {
              value: 10000000,
              label: "10 Million",
            },
          ]}
        />
        <span style={{ marginLeft: 10 }}>
          Performance:{" "}
          {totalTime.length > 0 ? Math.ceil(...totalTime) / 1000 : 0} seconds
        </span>
      </div>
      <Table
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={dataSource}
      />
    </div>
  );
};

export default TableWrapper;
