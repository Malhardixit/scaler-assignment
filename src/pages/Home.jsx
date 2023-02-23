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
  const [todaySchedule, setTodaySchedule] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [editingInterviewID, setEditingInterviewID] = useState(null);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3001/interviews")
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
        setError(err.response.data);
      });
  }, []);

  const colorArray = [
    ["#FFDC96", "#9E8655"],
    ["#FDC4C6", "#803538"],
    ["#CED6F3", "#3C4A82"],
  ];

  const randomColor = colorArray[Math.floor(Math.random() * colorArray.length)];

  const formatDate = moment(value).format("YYYY-MM-DD");
  const formattedDate = (date) => {
    return moment(date).format("YYYY-MM-DD");
  };

  const handleEditInfo = (interviewID) => {
    const [{ date, startTime, endTime, participantID }] = data.filter(
      (interview) => interview.interviewID === interviewID
    );

    console.log(participantID);

    const convertStringToDate = moment(date).format("YYYY-MM-DD");

    const body = {
      date: convertStringToDate,
      startTime: startTime,
      endTime: endTime,
      interviewID: interviewID,
      participantID: participantID,
    };

    if (editingInterviewID === interviewID) {
      axios
        .post(`http://localhost:3001/editInterview`, body)
        .then((res) => {
          alert("Interview Updated Successfully!");
        })
        .catch((err) => {
          console.log(err);
        });

      setEditingInterviewID(null);
      setIsEditing(false);
    } else {
      setEditingInterviewID(interviewID);
      setIsEditing(true);
    }
  };

  useEffect(() => {
    axios
      .get(`http://localhost:3001/getInterviewsbyDate/${formatDate}`)
      .then((res) => {
        console.log(res.data);
        setTodaySchedule(res.data);
      })
      .catch((err) => {
        console.log(err);
        setScheduleError(err.response.data);
      });
  }, [formatDate]);

  return (
    <>
      <Navbar />

      {error ? (
        <div className="error">{error}</div>
      ) : (
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
                      item.participantsName
                        .toString()
                        .toLowerCase()
                        .includes(search.toLowerCase())
                    ) {
                      return item;
                    }
                  })

                  .map((item) => {
                    return (
                      <div
                        id={item.interviewID}
                        key={item.participantID}
                        className="inner-card"
                      >
                        <div
                          style={{
                            alignItems: "center",
                          }}
                        >
                          <img className="grpImg" src={group} alt="grp" />

                          <div className="name">
                            <div style={{ display: "flex" }}>
                              <span className="headings">Group id : </span>
                              <div>{item.interviewID}</div>
                            </div>
                            <div style={{ display: "flex" }}>
                              <span className="headings">Participants : </span>
                              <div>{item.participantsName.join(", ")}</div>
                            </div>

                            <span className="headings">
                              Date :
                              <input
                                style={{
                                  border: "none",
                                  outline: "none",
                                  backgroundColor: "transparent",
                                  marginLeft: "10px",
                                }}
                                defaultValue={formattedDate(item.date)}
                                disabled={!isEditing}
                                onChange={(e) => {
                                  item.date = e.target.value;
                                }}
                              />
                            </span>
                            <br />
                            <span className="headings">
                              Time :
                              <input
                                style={{
                                  border: "none",
                                  outline: "none",
                                  backgroundColor: "transparent",
                                  marginLeft: "7px",
                                }}
                                defaultValue={[item.startTime, item.endTime]}
                                disabled={!isEditing}
                                onChange={(e) => {
                                  item.startTime = e.target.value;
                                }}
                              />
                            </span>
                          </div>
                        </div>
                        <div className="btnWrapper">
                          <button
                            id={`edit-btn-${item.interviewID}`}
                            onClick={() => handleEditInfo(item.interviewID)}
                            className="Editbutton"
                          >
                            <span style={{ fontSize: "16px" }}>
                              {editingInterviewID === item.interviewID
                                ? "Save"
                                : "Edit"}
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

            {todaySchedule?.map((item) => {
              return (
                <>
                  <div key={item.participantID} className="parentCard">
                    <div
                      onClick={() => {
                        setModal(!modal);
                      }}
                      className="nameDiv"
                    >
                      <div
                        className="circle"
                        style={{
                          backgroundColor: randomColor[0],
                          color: randomColor[1],
                        }}
                      >
                        {item.participantsName.length}
                      </div>

                      <p className="detail">
                        {"Group of " + item.participantsName.length}
                      </p>
                    </div>
                  </div>
                  {modal === true ? (
                    <div style={{ margin: "8px auto" }}>
                      {item.participantsName.join(", ")}
                    </div>
                  ) : null}
                </>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
