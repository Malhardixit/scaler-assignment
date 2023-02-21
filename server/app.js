const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Interview = require("./models/interViewSchema");
const Participant = require("./models/participant");
const config = require("./config");
const moment = require("moment");
const cors = require("cors");

app.use(bodyParser.json());
app.use(cors());

Participant.insertMany([
  {
    participantName: ["Riddhiman", "Rahul", "Rajat", "Rajesh", "Rajiv", "Raj"],
    participantID: ["1", "2", "3", "4", "5", "6"],
  },
]);

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
        res.status(400).send("No interviews found");
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
      res.status(400).send("No participants found");
    } else {
      res.status(200).send(participant);
    }
  });
});

//Route for creating a new interview
app.post("/createInterview", async (req, res) => {
  const { participants, participantID, interviewID, date, startTime, endTime } =
    req.body;

  const startDateTime = moment(`${date} ${startTime}`, "DD-MM-YYYY HH:mm");
  const endDateTime = moment(`${date} ${endTime}`, "DD-MM-YYYY HH:mm");

  const participantConflicts = await Promise.all(
    participantID.map(async (id) => {
      const participantInterviews = await Interview.find({
        participantID: id,
        date: startDateTime.toDate(),
        startTime: { $lt: endDateTime.toDate() },
        endTime: { $gt: startDateTime.toDate() },
      });

      return participantInterviews.length > 0;
    })
  );

  if (participantConflicts.some((conflict) => conflict)) {
    res.status(404).send("Participant is busy");
    return;
  }

  const interview = new Interview({
    participants,
    participantID,
    interviewID,
    date: startDateTime.toDate(),
    startTime: startDateTime.toDate(),
    endTime: endDateTime.toDate(),
  });

  interview
    .save()
    .then((interview) => {
      console.log(interview);
      res.status(200).send(interview);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).send("Oops! Error creating interview");
    });
});

// Route for getting interview by interviewerID
app.post("/getInterviewByDate", async (req, res) => {
  const { interviewID } = req.body;

  const interviews = await Interview.find({
    interviewID: interviewID,
  });

  if (interviews.length === 0) {
    res.status(400).send("No interviews found");
  } else {
    res.status(200).send(interviews);
  }
});

app.listen(3001, () => console.log("Server started"));

// app.post("/createInterview", (req, res) => {
//   const { participants, participantID, interviewID, date, startTime, endTime } =
//     req.body;

//   //Configuring the date and time in the correct format
//   const startDateTimeString = `${date} ${startTime}`;
//   const endDateTimeString = `${date} ${endTime}`;

//   const startDateTime = moment(
//     startDateTimeString,
//     "DD-MM-YYYY HH:mm"
//   ).toDate();
//   const endDateTime = moment(endDateTimeString, "DD-MM-YYYY HH:mm").toDate();

//   const dateFormat = moment(date, "DD-MM-YYYY").toDate();

//   for (let i = 0; i < participantID.length; i++) {
//     Participant.find({ participantID: participantID[i] }).then(
//       (participant) => {
//         const flag = 0;
//         for (let j = 0; j < participant.interviewID.length; j++) {
//           Interview.find({ interviewID: participant.interviewID[j] }).then(
//             (interview) => {
//               if (
//                 (interview.data === date && interview.startTime >= endTime) ||
//                 interview.endTime <= startTime
//               ) {
//                 flag = 1;
//               }
//             }
//           );
//           if (flag === 1) {
//             res.status(404).send("Participant is busy");
//             break;
//           }
//         }
//       }
//     );
//   }

//   const interview = new Interview({
//     participants,
//     participantID,
//     interviewID,
//     date: dateFormat,
//     startTime: startDateTime,
//     endTime: endDateTime,
//   });
//   interview
//     .save()
//     .then((interview) => {
//       console.log(interview);
//       res.status(200).send(interview);
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(404).send("Oops! Error creating interview");
//     });
// });

// for (let i = 0; i < participantsID.length; i++) {
//   Participant.find({ participantsID: participantsID[i] }).then(
//     (participant) => {
//       const flag = 0;
//       for (let j = 0; j < participant.interviewID.length; j++) {
//         Interview.find({ interviewID: participant.interviewID[j] }).then(
//           (interview) => {
//             if (
//               (interview.data === date && interview.startTime >= endTime) ||
//               interview.endTime <= startTime
//             ) {
//               flag = 1;
//             }
//           }
//         );
//         if (flag === 1) {
//           res.status(404).send("Participant is busy");
//           break;
//         }
//       }
//     }
//   );
// }
