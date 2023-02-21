import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Navbar from "../components/Navbar";
import "../styles/home.css";
import axios from "axios";
import group from "../assets/Group.png";

function Home() {
  const [value, onChange] = useState(new Date());
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:3001/interviews").then((res) => {
      console.log(res.data);
      setData(res.data);
    });
  }, []);

  return (
    <>
      <Navbar />

      <div className="heading">Upcoming Interviews</div>
      <div className="parent">
        <div className="master-card">
          <div className="cardWrapper">
            {data?.map((item) => {
              return (
                <div className="inner-card">
                  <img src={group} alt="grp" />
                  <div className="name">
                    {item.participants.length > 1
                      ? item.participants + ""
                      : item.participants}
                  </div>
                  <div className="location">SRM Chennai</div>
                  <div className="role">Frontend Developer</div>

                  <div className="date">25 Feb 2023</div>
                  <div className="time">4PM-5PM</div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="calendar">
          <Calendar />
          <div
            style={{
              marginTop: "10px",
              fontSize: "18px",
              color: "black",
              fontWeight: "500",
            }}
          >
            Today's Schedule
          </div>
          <div className="scheduleCard">
            <div className="innerSchedulecontent">
              <div className="schedulePos">
                <img src={group} alt="grp" />
                <div style={{ marginRight: "15px" }}>
                  <div className="participant">John Doe</div>
                  <div className="text">Frontend Developer</div>
                </div>
                <div className="text">4:00PM - 5:00PM</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

//TODO Implement the calendar component

export default Home;
