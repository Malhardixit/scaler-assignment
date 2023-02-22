import "../styles/schedule.css";
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

function Schedule() {
  const [users, setUsers] = useState(null);
  const [participants, setParticipants] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleChange = (e) => {
    console.log(e.target.value);
    setParticipants(e.target.value);
  };

  useEffect(() => {
    axios.get("http://localhost:3001/viewParticipants").then((res) => {
      console.log(res.data);
      setUsers(res.data);
    });
  }, []);

  return (
    <>
      <Navbar />
      <div className="heading">Schedule Interview</div>

      <div className="parent-card">
        <div className="innerContent">
          Select Candidate Name:
          <select className="selectUsers" onChange={handleChange}>
            {users
              ? users?.map((item) => {
                  return (
                    <option value={[item.participantName, item.participantID]}>
                      {item.participantName} [{item.participantID}]
                    </option>
                  );
                })
              : null}
          </select>
          <div
            style={{
              marginTop: "20px",
              width: "75%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              Start Time :{" "}
              <input
                value={startTime}
                onChange={(e) => {
                  if (startTime < endTime) {
                    alert("Start time cannot be greater than end time");
                  } else {
                    setStartTime(e.target.value);
                  }
                }}
                type="time"
                className="time"
              />
            </div>
            <div>
              End Time:
              <input
                value={endTime}
                onChange={(e) => {
                  setEndTime(e.target.value);
                }}
                type="time"
                className="time"
              />
            </div>
          </div>
          <div></div>
          <div style={{ marginTop: "20px" }}>Date:</div>
        </div>
      </div>
    </>
  );
}

export default Schedule;
