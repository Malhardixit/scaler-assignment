import "../styles/schedule.css";
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import Select from "react-select";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { Button, TextField } from "@mui/material";
import moment from "moment";
import api from "./api";

function Schedule() {
  const [users, setUsers] = useState(null);
  const [participants, setParticipants] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeError, setTimeError] = useState({
    startTimeError: null,
    endTimeError: null,
  });

  const formatStart = startTime && startTime.toLocaleTimeString();
  const formatEnd = endTime && endTime.toLocaleTimeString();

  const formatDate = moment(selectedDate).format("YYYY-MM-DD");

  const handleChange = (newValue) => {
    setParticipants(newValue);
  };

  const createInterview = (e) => {
    e.preventDefault();

    if (!participants || participants.length < 2) {
      alert("Please select at least 2 participants");
      return;
    }

    const participantID = participants.map((participant) => participant.value);
    const participantsName = participants.map(
      (participant) => participant.label
    );

    const data = {
      participantsName,
      participantID,
      startTime: formatStart,
      endTime: formatEnd,
      date: formatDate,
    };

    axios
      .post(`${api}/createInterview`, data)
      .then((res) => {
        if (res.data === "Interview Scheduled Successfully") {
          alert("Interview Scheduled");
          setParticipants("");
          setStartTime(null);
          setEndTime(null);
          setSelectedDate(null);
        }
      })
      .catch((err) => {
        alert(err.response.data);
        setParticipants("");
        setStartTime(null);
        setEndTime(null);
        setSelectedDate(null);
      });
  };

  const handleStartTimeChange = (time) => {
    const newStartTime = time;
    const newEndTime = endTime;

    if (
      newEndTime &&
      moment(newStartTime, "HH:mm").isAfter(moment(newEndTime, "HH:mm"))
    ) {
      setTimeError({
        ...timeError,
        startTimeError: "Start time should be less than end time",
      });
    } else {
      setTimeError({
        ...timeError,
        startTimeError: null,
      });
      setStartTime(time);
    }
  };

  const handleEndTimeChange = (time) => {
    const newStartTime = startTime;
    const newEndTime = time;

    if (
      newStartTime &&
      moment(newEndTime, "HH:mm").isBefore(moment(newStartTime, "HH:mm"))
    ) {
      setTimeError({
        ...timeError,
        endTimeError: "End time should be greater than start time",
      });
    } else {
      setTimeError({
        ...timeError,
        endTimeError: null,
      });
      setEndTime(time);
    }
  };

  useEffect(() => {
    axios.get(`${api}/viewParticipants`).then((res) => {
      setUsers(res.data);
    });
  }, []);

  return (
    <>
      <Navbar />
      <div className="parent-card">
        <div className="heading">Schedule Interview</div>
        <div className="innerContent">
          <div style={{ display: "flex" }}>
            Select Candidate Name:
            <Select
              styles={{
                // Fixes the overlapping problem of the component
                menu: (provided) => ({ ...provided, zIndex: 9999 }),
                valueContainer: (styles) => {
                  return {
                    ...styles,
                    flexWrap: "nowrap",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  };
                },
              }}
              className="selectUsers"
              value={participants}
              onChange={handleChange}
              isMulti={true}
              options={
                users &&
                users?.map((user) => {
                  return {
                    value: user.participantID,
                    label:
                      user.participantName + "(" + user.participantID + ")",
                  };
                })
              }
            />
          </div>
          <div
            style={{
              marginTop: "20px",
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              Start Time :
              <TimePicker
                label="Start Time"
                value={startTime}
                onChange={handleStartTimeChange}
                renderInput={(params) => (
                  <TextField
                    helperText={timeError.startTimeError}
                    error={timeError.startTimeError}
                    size="small"
                    {...params}
                    sx={{ marginTop: "15px", marginLeft: "120px" }}
                  />
                )}
              />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <span style={{ marginTop: "20px" }}>End Time:</span>
              <TimePicker
                label="End Time"
                value={endTime}
                onChange={handleEndTimeChange}
                renderInput={(params) => (
                  <TextField
                    helperText={timeError.endTimeError}
                    error={timeError.endTimeError}
                    size="small"
                    {...params}
                    sx={{ marginTop: "15px", marginLeft: "10px" }}
                  />
                )}
              />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div>Date:</div>
            <DatePicker
              label="Start Date"
              value={selectedDate}
              onChange={(newValue) => {
                setSelectedDate(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  size="small"
                  {...params}
                  sx={{ marginTop: "15px", marginLeft: "165px" }}
                />
              )}
            />
          </div>
          <Button
            onClick={createInterview}
            variant="contained"
            style={{ margin: "25px auto", display: "block" }}
          >
            Schedule Interview
          </Button>
        </div>
      </div>
    </>
  );
}

export default Schedule;
