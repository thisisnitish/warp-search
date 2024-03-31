import React, { useEffect, useState } from "react";
import { Input } from "antd";
import { chunkifyRecordsPerCore, enhancedSearch } from "../search/index";

const Search = ({ data, setDataSource, setTotalTime }) => {
  const [filteredData, setFilteredData] = useState(data);
  const [recordsPerCore, setRecordsPerCore] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (data.length <= 0) return;
    chunkifyRecordsPerCore(data, setRecordsPerCore);
  }, [data]);

  // useEffect(() => {
  //   setFilteredData(data);
  // }, [data]);

  useEffect(() => {
    setDataSource(filteredData);
  }, [filteredData]);

  const throttleSearchInput = (callback) => {
    let timeoutId;

    return function () {
      const args = arguments;
      const context = this;

      // Clear previous timeout
      clearTimeout(timeoutId);

      // Set new timeout
      timeoutId = setTimeout(function () {
        callback.apply(context, args);
      }, 500);
    };
  };

  const performSearch = (value) => {
    value = value.trim();

    // console.log("vv: ", value);
    setIsSearching(true);
    enhancedSearch(
      value,
      setFilteredData,
      recordsPerCore,
      setIsSearching,
      setTotalTime
    );
  };

  const handleSearch = throttleSearchInput(performSearch);

  return (
    <div>
      <Input
        placeholder="Search"
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
};

export default Search;
