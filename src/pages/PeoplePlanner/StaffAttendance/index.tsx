import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet
} from '@react-pdf/renderer';
import 'react-datepicker/dist/react-datepicker.css';

const StaffAttendancePage = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [downloadStartDate, setDownloadStartDate] = useState(new Date());
  const [downloadEndDate, setDownloadEndDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility

  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    setTimeout(() => {
      const mockData = generateMockAttendanceData();
      setAttendanceData(mockData);
      setFilteredData(mockData);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleFilter = () => {
    const filtered = attendanceData.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= endDate;
    });
    setFilteredData(filtered);
  };

  const handleReset = () => {
    setStartDate(new Date());
    setEndDate(new Date());
    setFilteredData(attendanceData);
  };

  const totalWorkingDays = attendanceData.length;
  const presentDays = attendanceData.filter(
    (item) => item.status === 'Present'
  ).length;
  const absentDays = attendanceData.filter(
    (item) => item.status === 'Absent'
  ).length;
  const lateDays = attendanceData.filter(
    (item) => item.status === 'Late'
  ).length;
  const averageHours = (
    attendanceData.reduce((sum, item) => sum + item.duration, 0) /
    (presentDays || 1)
  ).toFixed(2);

  // PDF Document
  const AttendancePDF = ({ data, from, to }) => (
    <Document>
      <Page style={pdfStyles.page}>
        <View style={pdfStyles.header}>
          <Text style={pdfStyles.title}>Attendance Report</Text>
          <Text style={pdfStyles.subtitle}>
            {from.toDateString()} to {to.toDateString()}
          </Text>
        </View>
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, pdfStyles.tableHeader]}>Date</Text>
            <Text style={[pdfStyles.tableCell, pdfStyles.tableHeader]}>Status</Text>
            <Text style={[pdfStyles.tableCell, pdfStyles.tableHeader]}>Start Time</Text>
            <Text style={[pdfStyles.tableCell, pdfStyles.tableHeader]}>End Time</Text>
            <Text style={[pdfStyles.tableCell, pdfStyles.tableHeader]}>Duration</Text>
          </View>
          {data.map((item, index) => (
            <View style={pdfStyles.tableRow} key={index}>
              <Text style={pdfStyles.tableCell}>{item.date}</Text>
              <Text style={pdfStyles.tableCell}>{item.status}</Text>
              <Text style={pdfStyles.tableCell}>{item.startTime}</Text>
              <Text style={pdfStyles.tableCell}>{item.endTime}</Text>
              <Text style={pdfStyles.tableCell}>{item.duration} hours</Text>
            </View>
          ))}
        </View>
        <View style={pdfStyles.footer}>
          <Text style={pdfStyles.footerText}>
            Generated on: {new Date().toLocaleString()}
          </Text>
        </View>
      </Page>
    </Document>
  );

  // Filter data based on modal date range
  const getFilteredDataForDownload = () => {
    return filteredData.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= downloadStartDate && itemDate <= downloadEndDate;
    });
  };

  return (
    <div className="">
      <div className="">
        {/* Header */}
        <h1 className="mb-4 text-3xl font-bold text-gray-800">My Attendance</h1>

        {/* Overview Section */}
        <section className="mb-8 rounded-lg bg-white p-6 shadow">
          <h2 className="mb-6 text-2xl font-semibold text-gray-700">
            {currentMonth} {currentYear} Overview
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-center">
              <h3 className="text-sm font-medium text-blue-600">Total Working Days</h3>
              <p className="text-2xl font-bold text-blue-800">{totalWorkingDays}</p>
            </div>
            <div className="rounded-lg border border-green-100 bg-green-50 p-4 text-center">
              <h3 className="text-sm font-medium text-green-600">Present Days</h3>
              <p className="text-2xl font-bold text-green-800">{presentDays}</p>
            </div>
            <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-center">
              <h3 className="text-sm font-medium text-red-600">Absent Days</h3>
              <p className="text-2xl font-bold text-red-800">{absentDays}</p>
            </div>
            <div className="rounded-lg border border-yellow-100 bg-yellow-50 p-4 text-center">
              <h3 className="text-sm font-medium text-yellow-600">Late Days</h3>
              <p className="text-2xl font-bold text-yellow-800">{lateDays}</p>
            </div>
          </div>
        </section>

   

        {/* Attendance List */}
        <section className="rounded-lg bg-white p-6 shadow">
          <div className="flex flex-row w-full items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-700">Attendance Records</h2>
             <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-md bg-supperagent px-5 py-2 font-medium text-white transition hover:bg-supperagent/90"
            >
              Download PDF
            </button>
          </div>

          <div className="flex flex-wrap items-end gap-4 pb-4">
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-600">From:</label>
              <DatePicker
                selected={startDate}
                onChange={setStartDate}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                maxDate={new Date()}
                className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-600">To:</label>
              <DatePicker
                selected={endDate}
                onChange={setEndDate}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                maxDate={new Date()}
                className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleFilter}
              className="rounded-md bg-supperagent px-5 py-2 font-medium text-white transition hover:bg-supperagent/90"
            >
              Apply Filter
            </button>
            <button
              onClick={handleReset}
              className="rounded-md bg-gray-500 px-5 py-2 font-medium text-white transition hover:bg-gray-600"
            >
              Reset
            </button>
          </div>

          {isLoading ? (
            <div className="py-10 text-center text-gray-500">Loading attendance data...</div>
          ) : filteredData.length === 0 ? (
            <div className="py-10 text-center text-gray-500">
              No records found for the selected period.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full rounded-lg border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Start Time
                    </th>
                    <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      End Time
                    </th>
                    <th className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Duration (hours)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b last:border-b-0 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 text-sm text-gray-800">{item.date}</td>
                      <td
                        className={`px-4 py-3 text-sm font-medium ${
                          item.status === 'Present'
                            ? 'text-green-700'
                            : item.status === 'Absent'
                              ? 'text-red-700'
                              : 'text-yellow-700'
                        }`}
                      >
                        {item.status}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">{item.startTime}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{item.endTime}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{item.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Download Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
              <h3 className="mb-4 text-xl font-semibold">Confirm Download Range</h3>
              <p className="mb-4 text-gray-600">
                Select the date range for your PDF report.
              </p>

              <div className="mb-4 flex flex-col gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">From:</label>
                  <DatePicker
                    selected={downloadStartDate}
                    onChange={setDownloadStartDate}
                    selectsStart
                    startDate={downloadStartDate}
                    endDate={downloadEndDate}
                    maxDate={new Date()}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">To:</label>
                  <DatePicker
                    selected={downloadEndDate}
                    onChange={setDownloadEndDate}
                    selectsEnd
                    startDate={downloadStartDate}
                    endDate={downloadEndDate}
                    minDate={downloadStartDate}
                    maxDate={new Date()}
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-md bg-gray-400 px-4 py-2 font-medium text-white hover:bg-gray-500"
                >
                  Cancel
                </button>
                <PDFDownloadLink
                  document={
                    <AttendancePDF
                      data={getFilteredDataForDownload()}
                      from={downloadStartDate}
                      to={downloadEndDate}
                    />
                  }
                  fileName={`attendance_${downloadStartDate.toISOString().split('T')[0]}_to_${downloadEndDate.toISOString().split('T')[0]}.pdf`}
                >
                  {({ loading }) => (
                    <button
                      type="button"
                      disabled={loading}
                      className={`rounded-md px-4 py-2 font-medium text-white ${
                        loading ? 'bg-supperagent/80' : 'bg-supperagent hover:bg-supperagent/90'
                      }`}
                    >
                      {loading ? 'Generating...' : 'Generate PDF'}
                    </button>
                  )}
                </PDFDownloadLink>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// PDF Styling
const pdfStyles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica'
  },
  header: {
    marginBottom: 20,
    textAlign: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5
  },
  subtitle: {
    fontSize: 14,
    color: '#666'
  },
  table: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    marginBottom: 20
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#bfbfbf'
  },
  tableCell: {
    padding: 5,
    fontSize: 10,
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#bfbfbf'
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold'
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 10,
    textAlign: 'center',
    color: '#666'
  }
});

// Mock Data Generator
const generateMockAttendanceData = () => {
  const data = [];
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    if (date.getDay() === 0 || date.getDay() === 6) continue; // Skip weekends

    const status =
      Math.random() > 0.1
        ? Math.random() > 0.2
          ? 'Present'
          : 'Late'
        : 'Absent';

    const startTime =
      status === 'Absent'
        ? '--'
        : `${8 + Math.floor(Math.random() * 2)}:${Math.random() > 0.5 ? '00' : '30'}`;
    const endTime =
      status === 'Absent'
        ? '--'
        : `${16 + Math.floor(Math.random() * 2)}:${Math.random() > 0.5 ? '00' : '30'}`;

    let duration = 0;
    if (status !== 'Absent') {
      const [startHour, startMin] = startTime.split(':').map(Number);
      const [endHour, endMin] = endTime.split(':').map(Number);
      const startDecimal = startHour + startMin / 60;
      const endDecimal = endHour + endMin / 60;
      duration = (endDecimal - startDecimal).toFixed(2);
    }

    data.push({
      date: date.toLocaleDateString(),
      status,
      startTime,
      endTime,
      duration
    });
  }

  return data;
};

export default StaffAttendancePage;