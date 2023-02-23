const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Interview = require("./models/interViewSchema");
const Participant = require("./models/participant");
const config = require("./config");
const cors = require("cors");
const moment = require("moment");

app.use(bodyParser.json());
app.use(cors());

mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});
mongoose.connection.on("err", (err) => {
  console.log("Connection to mongoDB failed", err);
});

// This is the route for viewing all the interviews
app.get("/interviews", (req, res) => {
  Interview.find()
    .then((interviews) => {
      if (interviews.length === 0) {
        res
          .status(500)
          .send(
            "Administrative talent on standby, waiting for the perfect match. No interviews found yet, but the right opportunity is just around the corner!"
          );
      } else {
        res.status(200).send(interviews);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(404).send("Oops! Something went wrong");
    });
});

app.get("/viewParticipants", async (req, res) => {
  await Participant.find().then((participant) => {
    if (participant.length === 0) {
      res.status(500).send("No participants found");
    } else {
      res.status(200).send(participant);
    }
  });
});

//Get the interview by date
app.get("/getInterviewsbyDate/:date", (req, res) => {
  const { date } = req.params;
  Interview.find({ date: new Date(date) })
    .then((interviews) => {
      if (interviews.length === 0) {
        res.status(500).send("No interviews found");
      } else {
        res.status(200).send(interviews);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(404).send("Oops! Something went wrong");
    });
});

//Route for creating a new interview
app.post("/createInterview", async (req, res) => {
  const { participantsName, participantID, date, startTime, endTime } =
    req.body;
  const participantConflicts = await Promise.all(
    participantID.map(async (id) => {
      const participantInterviews = await Interview.find({
        participantID: id,
        date: new Date(date),
        startTime: { $lt: endTime },
        endTime: { $gt: startTime },
      });

      return participantInterviews.length > 0;
    })
  );

  if (participantConflicts.some((conflict) => conflict)) {
    res.status(500).send("Participant is busy");
    return;
  }

  const interviewID = Math.floor(Math.random() * 1000000);

  const interview = new Interview({
    participantsName,
    participantID,
    date: new Date(date),
    startTime: startTime,
    endTime: endTime,
    interviewID,
  });

  interview
    .save()
    .then((interview) => {
      console.log(interview);
      res.status(200).send("Interview Scheduled Successfully");
    })
    .catch((err) => {
      console.log(err);
      res.status(404).send("Oops! Error creating interview");
    });
});

//Route for editing interview by id
app.post("/editInterview", async (req, res) => {
  const { date, startTime, endTime, interviewID, participantID } = req.body;

  const participantConflicts = await Promise.all(
    participantID.map(async (id) => {
      const participantInterviews = await Interview.find({
        date: new Date(date),
        startTime: { $lt: endTime },
        endTime: { $gt: startTime },
        interviewID: interviewID,
      });

      for (let i = 0; i < participantInterviews.length; i++) {
        if (participantInterviews[i].participantID.includes(id)) {
          return false;
        } else {
          return true;
        }
      }
    })
  );

  if (participantConflicts.some((conflict) => conflict)) {
    res.status(500).send("Participant is busy");
    return;
  }

  const updatedInterview = await Interview.findOneAndUpdate({
    date: date,
    startTime: startTime,
    endTime: endTime,
    interviewID: interviewID,
  });

  if (updatedInterview) {
    res.status(200).send("Interview updated successfully");
  } else {
    res.status(404).send("Interview not found");
  }
});

app.listen(3001, () => console.log("Server started"));
