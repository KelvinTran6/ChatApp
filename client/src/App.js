import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router";
import "./App.css";
import { Box, TextField, Grid, Button } from "@mui/material";
import io from "socket.io-client";

const socket = io("localhost:4000", { transports: ["websocket"] });

function App() {
  const { state } = useLocation();
  const nickname = state.name;
  const color = state.color;

  const [loaded, setLoaded] = useState(false)

  const [userList, setUserList] = useState([]);
  const [currentText, setCurrentText] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if(!loaded) {
      const color = state.color
      const nickname = state.name
      const emptyString = ""
      
      socket.emit('userInfo', {nickname, color})
      socket.emit('message', {nickname, emptyString })

      setLoaded(true)
    }

    socket.on("newUser", (userList) => {
      setUserList(userList);
    });

    socket.on("message", (messages) => {
      setMessages(messages);
    });
  }, [messages]);

  const handleTextField = (e) => {
    setCurrentText(e.target.value);
  };

  const handleButton = (e) => {
    const user = nickname;
    const message = currentText;

    if (message === "") {
      return;
    }

    socket.emit("message", { user, message });
    e.preventDefault();
    setCurrentText("");
  };

  return (
    <Box sx={{ flexGrow: 1 }} className="container">
      <Grid container className="window">
        <Grid item container spacing={3} className="content">
          <Grid item xs={12} sm={12} md={9} className="chatWindow">
            <h1>Chat</h1>{" "}
            <div className="chatBox">
              {messages.map((message) => {
                return (
                  <span key = {message}>
                    <p>
                      {" "}
                      {message.timeStamp} <span style = {{color: color}}> {message.user} </span>: {message.message}
                    </p>
                  </span>
                );
              })}
            </div>
          </Grid>
          <Grid item xs={12} sm={12} md={3} className="usersWindow">
            <h1> Online Users </h1>{" "}
            <div className="userBox">{userList.map((user) => { return <p key = {user} style = {{color: user.color}}>  {user.user} </p> })}</div>
          </Grid>
        </Grid>
        <Grid item container className="textField">
          <Grid item xs={11} md={11} className="textField">
            <TextField
              value={currentText}
              onChange={(e) => handleTextField(e)}
              fullWidth
            />
          </Grid>
          <Grid item xs={1} md={1}>
            <Button fullWidth variant="outlined" onClick={handleButton}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
