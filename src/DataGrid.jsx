import React, { useState } from "react";
import "./DataGrid.css";

const DataGrid = ({ csv, selectedHeaders }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 10;

  if (!csv) {
    return null;
  }

  const filteredHeaders = csv.headers.filter((header) => selectedHeaders.includes(header));
  const filteredData = csv.data.map((row) => row.filter((_, index) => selectedHeaders.includes(csv.headers[index])));

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages - 1));
  };

  const startIndex = currentPage * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  return (
    <div className="data-grid-container">
      <div className="table-wrapper">
        <table className="data-grid-table">
          <thead>
            <tr>
              {filteredHeaders.map((headerName) => (
                <th key={headerName}>{headerName}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((row, rowIndex) => (
              <tr key={startIndex + rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination-controls">
        <button onClick={handlePrevPage} disabled={currentPage === 0}>
          Previous
        </button>
        <span>
          Page {currentPage + 1} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages - 1}>
          Next
        </button>
      </div>
    </div>
  );
};

export default DataGrid;
