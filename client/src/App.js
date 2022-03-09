import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { Box, TextField, Grid, Button } from "@mui/material";
import io from "socket.io-client";

const socket = io("localhost:4000", { transports : ['websocket'] });

function App() {
  const[currentText, setCurrentText] = useState("");

  const [textMessage, setTextMessage] = useState({ user: "", message: "" });
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("message", (messages) => {
      setMessages(messages);
    });
  }, [messages]);

  const handleTextField = (e) => {
    console.log("testing")
    setCurrentText(e.target.value)
  };

  const handleButton = (e) => {
    const user = "kelvin"
    const message = currentText;

    if(message === "") {
      return;
    }

    socket.emit("message", { user, message });
    e.preventDefault();
    setCurrentText("")
  };

  return (
    <Box sx={{ flexGrow: 1 }} className="container">
      <Grid container className="window">
        <Grid item container spacing={3} className="content">
          <Grid item xs={12} md={9} className="chatWindow">
            <h1>Chat</h1>{" "}
            <div className="chatBox">
              {messages.map((message) => {
                return (
                  <span>
                    <p>
                      {" "}
                      {message.timeStamp} {message.user}: {message.message}
                    </p>
                  </span>
                );
              })}
            </div>
          </Grid>
          <Grid item xs={12} md={3} className="usersWindow">
            <h1> Online Users </h1> <div className="userBox">kelvin</div>
          </Grid>
        </Grid>
        <Grid item container className="textField">
          <Grid item xs={11} md={11} className="textField">
            <TextField
              value={currentText}
              onChange={ (e) => handleTextField(e)}
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
