import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router";
import "./App.css";
import { Box, TextField, Grid, Snackbar, Alert } from "@mui/material";
import io from "socket.io-client";

const socket = io("localhost:4000", { transports: ["websocket"] });

function App() {
  const { state } = useLocation();
  const [color, setColor] = useState(state.color);
  const [loaded, setLoaded] = useState(false);
  const [nickname, setnickname] = useState(state.name);
  const [userList, setUserList] = useState([]);
  const [currentText, setCurrentText] = useState("");
  const [messages, setMessages] = useState([]);
  const [alertInfo, setAlertInfo] = useState({message:"", severity: "", open: false})

  useEffect(() => {
    if (!loaded) {
      const color = state.color;
      const emptyString = undefined;
      const socketID = socket.id;
      console.log(socketID);
      socket.emit("userInfo", { nickname, color, socketID });
      socket.emit("message", { user: { nickname, color }, emptyString });
      setLoaded(true);
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

  const handleClose = (e) => {
    const alert = {message:"", severity:"", open: false}
    setAlertInfo(alert)
  }

  const handleKeypress = (e) => {
    if (e.charCode === 13) {
      const message = currentText;
      if (message === "") {
        return;
      }
      if (message.startsWith("/nick ")) {
        changeName(message);
      } else if (message.startsWith("/nickcolor")) {
        changeColor(message);
      } else {
        socket.emit("message", { user: { nickname, color }, message });
      }
      e.preventDefault();
      setCurrentText("");
    }
  };
  

  const changeColor = (message) => {
    const regExp = "<(.+?)>";
    const regAngleBracket = "(<|>)";
    const newColor = message.match(regExp)[1].replace(regAngleBracket, "");
    socket.emit("changeColor", { nickname, newColor });
    setColor(newColor);
    const alert = {message:"color changed", severity:"success", open: true}
    setAlertInfo(alert)
  };

  const changeName = (message) => {
    const regExp = "<(.+?)>";
    const regAngleBracket = "(<|>)";
    let newNickName = message.match(regExp)[1].replace(regAngleBracket, "");
    console.log("chanigng name "+ newNickName)

    socket.emit("verify", { newNickName, color });
    socket.once("verify", (available) => {
      if (available) {
        console.log("new name " + newNickName)
        socket.emit("changeName", { nickname, newNickName, color });
        setnickname(newNickName);
        const alert = {message:"name changed", severity:"success", open: true}
        setAlertInfo(alert)

      } else {
        const alert = {message:"name taken", severity:"error", open: true}
        setAlertInfo(alert)
      }
      return
  })
}


  if(socket.id == undefined) {
    return(
      <h1>connection failed try again...</h1>
    )
  }
  
  return (
    <Box sx={{ flexGrow: 1 }} className="container">
      <h1>
        Welcome <span style={{ color: color }}>{nickname}</span>!
      </h1>
      <Grid container className="window">
        <Grid item container spacing={3} className="content">
          <Grid item xs={12} sm={12} md={9} className="chatWindow">
            <h1>Chat</h1>{" "}
            <div className="chatBox">
              {messages.map((message) => {
                return (
                  <span key={message}>
                    <p>
                      {" "}
                      {message.timeStamp}{" "}
                      <span style={{ color: message.user.color }}>
                        {" "}
                        {message.user.nickname}{" "}
                      </span>
                      : <strong>{message.message}</strong>
                    </p>
                  </span>
                );
              })}
            </div>
          </Grid>
          <Grid item xs={12} sm={12} md={3} className="usersWindow">
            <h1> Online Users </h1>{" "}
            <div className="userBox">
              {userList.map((current) => {
                return (
                  <p key={current} style={{ color: current.user.color }}>
                    {" "}
                    {current.user.nickname}{" "}
                  </p>
                );
              })}
            </div>
          </Grid>
        </Grid>
        <Grid item container className="textField">
          <Grid item xs={12} md={12} className="textField">
            <TextField
              value={currentText}
              onKeyPress={(e) => handleKeypress(e)}
              onChange={(e) => handleTextField(e)}
              fullWidth
            />
          </Grid>
        </Grid>
      </Grid>
      <Snackbar
        open={alertInfo.open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Note archived"
      >
        <Alert onClose={handleClose} severity={alertInfo.severity} sx={{ width: "100%" }}>
              {alertInfo.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default App;
