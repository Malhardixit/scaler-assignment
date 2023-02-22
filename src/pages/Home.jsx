import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Navbar from "../components/Navbar";
import "../styles/home.css";
import axios from "axios";
import group from "../assets/grpIcon.png";
import searchIcon from "../assets/search.png";
import moment from "moment";

function Home() {
  const [value, onChange] = useState(new Date());
  const [data, setData] = useState(null);
  const [search, setSearch] = useState("");
  const [interviews, setInterviews] = useState(null);
  const [editInfo, setEditInfo] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:3001/interviews").then((res) => {
      setData(res.data);
    });
  }, []);

  const colorArray = [
    ["#FFDC96", "#9E8655"],
    ["#FDC4C6", "#803538"],
    ["#CED6F3", "#3C4A82"],
  ];

  const randomColor = colorArray[Math.floor(Math.random() * colorArray.length)];

  const formatDate = moment(value).format("YYYY-MM-DD");

  const handleEditInfo = () => {
    setEditInfo(!editInfo);
  };

  useEffect(() => {
    axios
      .get(`http://localhost:3001/getInterviewsbyDate/2023-02-22`)
      .then((res) => {
        console.log(res.data);
        setInterviews(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [formatDate]);

  return (
    <>
      <Navbar />

      <div className="parent">
        <div className="master-card">
          <div className="cardTitle">Upcoming Interviews</div>
          <div>
            <div className="searchBar">
              <input
                className="inptField"
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                placeholder="Search by name"
                value={search}
                type="text"
              />
              <img className="searchIcon" src={searchIcon} alt="search" />
            </div>
          </div>
          {
            <div className="cardWrapper">
              {data
                ?.filter((item) => {
                  if (search === "") {
                    return item;
                  } else if (
                    item.participants
                      .toString()
                      .toLowerCase()
                      .includes(search.toLowerCase())
                  ) {
                    return item;
                  }
                })

                .map((item) => {
                  return (
                    <div className="inner-card">
                      <div
                        style={{
                          alignItems: "center",
                        }}
                      >
                        <img className="grpImg" src={group} alt="grp" />

                        <div className="name">
                          <span className="headings">Participants : </span>

                          <input
                            style={{
                              border: "none",
                              outline: "none",
                              backgroundColor: "transparent",
                            }}
                            defaultValue={item.participants}
                            disabled={editInfo}
                            onChange={(e) => {
                              item.participants = e.target.value;
                              console.log(item.participants);
                            }}
                          />

                          <br />
                          <span className="headings">Profile : </span>
                          <br />
                          <span className="headings">Date : </span>
                          <br />
                          <span className="headings">Time : </span>
                        </div>
                      </div>
                      <div className="btnWrapper">
                        <button onClick={handleEditInfo} className="Editbutton">
                          <span style={{ fontSize: "16px" }}>
                            {editInfo ? "Edit" : "Save"}
                          </span>
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          }
        </div>
        <div className="calendar">
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

          <Calendar onChange={onChange} value={value} />

          {interviews?.map((item) => {
            return (
              <div className="parentCard">
                <div className="nameDiv">
                  <div
                    className="circle"
                    style={{
                      backgroundColor: randomColor[0],
                      color: randomColor[1],
                    }}
                  ></div>
                  <p className="detail">
                    {item.participants.length === 1
                      ? item.participants
                      : "Group of " + item.participants.length + ""}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Home;
