import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Paper, TextField, Button } from "@mui/material";
import io from "socket.io-client";
const socket = io("localhost:4000", { transports : ['websocket'] });



function Login() {
    let navigate = useNavigate()

  const [currentText, setCurrentText] = useState("");
  const handleTextField = (e) => {
    setCurrentText(e.target.value);
  };

  const handleButton = (e) => {

    navigate('/app', { state: {name: currentText, color: "red" }})
  };

  return (
    <Paper>
      <TextField
        value={currentText}
        onChange={(e) => handleTextField(e)}
        fullWidth
      />
      <Button fullWidth variant="outlined" onClick={handleButton}>
        Submit
      </Button>
    </Paper>
  );
}

export default Login;
