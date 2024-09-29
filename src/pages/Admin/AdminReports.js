// src/pages/Admin/AdminReports.js
import React, { useState, useEffect } from "react";

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  // Fetch available reports from the server
  useEffect(() => {
    async function fetchReports() {
      try {
        const response = await fetch("/api/reports"); // Replace with your backend reports endpoint
        const data = await response.json();
        setReports(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    }
    fetchReports();
  }, []);

  // Handle report selection
  const handleViewReport = async (reportId) => {
    try {
      const response = await fetch(`/api/reports/${reportId}`); // Fetch specific report by ID
      const data = await response.json();
      setSelectedReport(data);
    } catch (error) {
      console.error("Error fetching report:", error);
    }
  };

  // Print the report
  const handlePrintReport = () => {
    if (!selectedReport) return;
    window.print(); // Print functionality
  };

  if (loading) {
    return <div>Loading reports...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold my-4">Manage Reports</h1>

      <div className="flex">
        {/* Reports List */}
        <div className="w-1/3 border-r pr-4">
          <h2 className="text-xl mb-4">Available Reports</h2>
          <ul>
            {reports.map((report) => (
              <li key={report.id} className="mb-3">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => handleViewReport(report.id)}
                >
                  {report.title}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Selected Report View */}
        <div className="w-2/3 pl-4">
          {selectedReport ? (
            <div>
              <h2 className="text-xl mb-4">{selectedReport.title}</h2>
              <p>{selectedReport.description}</p>
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Report Data:</h3>
                <pre className="bg-gray-100 p-4 rounded">
                  {JSON.stringify(selectedReport.data, null, 2)}
                </pre>
              </div>
              <button
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
                onClick={handlePrintReport}
              >
                Print Report
              </button>
            </div>
          ) : (
            <p>Select a report to view</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReports;


