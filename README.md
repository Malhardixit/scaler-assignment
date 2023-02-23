# InterView-Portal

A simple and user-friendly interview portal where admins can create interviews by selecting participants,interview start time and end time

## 📖 Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [TechStack](#tech)

## 👉 Pre-requisites

Clone the repository:`https://github.com/Malhardixit/scaler-assignment.git`

Navigate to project directory:`cd scaler-assignment`

Install dependencies: `yarn`

## 🤹‍ Usage

To start the development server, run the following command:
`yarn dev`

To start the backend server, run the following command:
`cd server`
`node app`

## ✨ TechStack

# 👉 Glimpse of Website

### HomePage

![image](https://user-images.githubusercontent.com/25477443/220926056-9473755b-44b9-425a-8346-3f87c8d2011d.png)

### Schedule Interview

![image](https://user-images.githubusercontent.com/25477443/220926692-0208a027-0f26-439d-960c-b8254d5a6701.png)

## Interview Scheduler API

This is a REST API for creating and fetching interviews

# Routes

### - GET /interviews: Returns a list of all the interviews.

### - GET /viewParticipants: Returns a list of all the participants.

### - GET /getInterviewsbyDate/`:date`: Returns a list of all the interviews that occur on the specified date.

### - POST /createInterview: Creates a new interview.

### - POST /editInterview: Edits an existing interview.


### Check the Website hosted on :`https://scaler-assignment.netlify.app/`
### All APIs are hosted on:`https://scaler-assignment.onrender.com`


### Note:Haven't made it responsive,however can easily extend it further.
### Please check website in desktop


