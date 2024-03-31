/*eslint-disable*/
import WebWorker from "./WebWorker";
import worker from "./worker";

// Esitimates logical core on user's machine
const numberOfCores = navigator.hardwareConcurrency;

/**
 * Split the data into chunks based on number of available logical cores
 * @param {*} data data source
 * @param {*} setRecordsPerCore react state to hold the data in chunks
 * @returns Array of data chunks
 */
export const chunkifyRecordsPerCore = (data, setRecordsPerCore) => {
  let prevIdx = 0;
  const recordsPerCore = [];
  for (let core = 0; core < numberOfCores; core += 1) {
    recordsPerCore.push(
      data.slice(prevIdx, prevIdx + Math.ceil(data.length / numberOfCores))
    );
    prevIdx += Math.ceil(data.length / numberOfCores);
  }

  setRecordsPerCore([...recordsPerCore]);
};

/**
 * Search operation using web worker and return the filtered array
 * @param {*} value searched value which is being searched
 * @param {*} setFilteredData react state to store resultant array after the search is finished
 * @param {*} recordsPerCore chunkified records based on the number of logical cores in system
 * @param {*} setIsSearching react state for maintain a flag of search status
 * @param {*} setTotalTime react state for total performance of a search
 * @returns Array of searched data based on the value
 */

export const enhancedSearch = (
  value,
  setFilteredData,
  recordsPerCore,
  setIsSearching,
  setTotalTime
) => {
  const start = performance.now();
  let threadSyncFlag = 0;
  const workerBuffer = []; // buffer for storing active threads

  // Spawn worker threads
  for (let core = 0; core < numberOfCores; core += 1) {
    const workerThread = new WebWorker(worker);
    workerBuffer.push(workerThread);
  }

  // Initalize the threads
  for (const [idx, workerThread] of workerBuffer.entries()) {
    const startThread = performance.now();
    workerThread.postMessage({
      record: recordsPerCore[idx],
      searchText: `${value}`,
    });
    workerThread.addEventListener("message", (event) => {
      const searchedRecords = event.data;
      threadSyncFlag += 1; // increment when a thread returns

      if (threadSyncFlag === numberOfCores) setIsSearching(false);

      if (threadSyncFlag === 1) {
        // first thread returns
        setFilteredData([...searchedRecords]);
      } else {
        setFilteredData((prevState) => [...prevState, ...searchedRecords]);
      }
      const endThread = performance.now();
      console.log(`workerThread ${idx}`, endThread - startThread);
    });
  }

  const end = performance.now();

  setTotalTime([end - start]);

  console.log("Total time: ", end - start, " ms");
  // console.log("start: ", start);
  // console.log("end: ", end);
};
