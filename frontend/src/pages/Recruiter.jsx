import React, { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { TextField, Button, Box } from "@mui/material";
import dayjs from "dayjs";
import axios from "axios";

const InterviewScheduler = () => {
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [date, setDate] = useState(null);
  const [name, setName] = useState(localStorage.getItem("name") || "");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [companyName, setCompanyName] = useState(
    localStorage.getItem("companyName") || ""
  );
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = async () => {
    if (!startTime || !endTime || !date) {
      alert("Please select both start and end times.");
      return;
    }

    // Check if endTime is after startTime
    if (dayjs(endTime).isBefore(startTime)) {
      alert("End time must be after start time");
      return;
    }

    console.log(
      dayjs(startTime).format("hh:mm A"),
      dayjs(endTime).format("hh:mm A"),
      dayjs(date).format("YYYY-MM-DD")
    );

    const data = {
      userId: localStorage.getItem("userId"),
      name,
      email,
      companyName,
      date: dayjs(date).toDate(), // Send as Date object
      startTime: dayjs(startTime, "hh:mm:A").toDate(), // Convert to Date object
      endTime: dayjs(endTime, "hh:mm:A").toDate(), // Convert to Date object
    };

    try {
      const response = await axios.post(`${BACKEND_URL}/updateUser`, data, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        alert("Interview time scheduled successfully!");
      } else {
        alert("Failed to schedule interview time");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("An error occurred while scheduling the interview");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        display="flex"
        style={{ marginTop: "2rem" }}
        flexDirection="column"
        alignItems="center"
        gap={2}
      >
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
        <DatePicker
          label="Date"
          value={date}
          onChange={(newValue) => setDate(newValue)}
        />
        <TimePicker
          label="Start Time"
          value={startTime}
          onChange={(newValue) => setStartTime(newValue)}
        />
        <TimePicker
          label="End Time"
          value={endTime}
          onChange={(newValue) => setEndTime(newValue)}
        />
        <Button variant="contained" onClick={handleSubmit}>
          Schedule Interview
        </Button>
      </Box>
    </LocalizationProvider>
  );
};

export default InterviewScheduler;
