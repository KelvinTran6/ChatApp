import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Grid, TextField, Button, Container } from "@mui/material";
import io from "socket.io-client";
import validateColor from "validate-color";

const socket = io("localhost:4000", { transports: ["websocket"] });

function Login() {
  let navigate = useNavigate();
  const [currentText, setCurrentText] = useState("");
  const [currentColor, setCurrentColor] = useState("");

  const handleTextField = (e) => {
    setCurrentText(e.target.value);
  };
  const handleTextFieldColor = (e) => {
    setCurrentColor(e.target.value);
  };

  const handleButton = (e) => {
    let newNickName = currentText.trim();
    let color = currentColor.trim();

    if (color === "") {
      color = "#" + Math.floor(Math.random() * 16777215).toString(16); // Found this random color generator trick on stackoverflow
    }

    else if (!validateColor(color)) {
      alert(color + " is not a valid color");
      window.location.reload(false);
      return;
    }

    if (newNickName === "") {
      const {
        uniqueNamesGenerator,
        adjectives,
        colors,
        animals,
      } = require("unique-names-generator");
      newNickName = uniqueNamesGenerator({
        dictionaries: [adjectives, colors, animals],
      });
    }

    socket.emit("verify", { newNickName, color });
    socket.on("verify", (available) => {

      if (available) {
        navigate("/app", {
          state: { name: newNickName, color: color },
        });
        socket.disconnect();
      } else {
        alert(newNickName + " is already taken, please try another name");
        window.location.reload(false);
      }
    });
  };

  return (
    <div className="loginContainer">
      <div className="login"x>
        <p>Nickname</p>
        <TextField
          value={currentText}
          onChange={(e) => handleTextField(e)}
          fullWidth
        />
        <p>Color</p>
        <TextField
          value={currentColor}
          onChange={(e) => handleTextFieldColor(e)}
          fullWidth
        />
        <Button
          style={{ maxHeight: "50px", minHeight: "50px", marginTop: "25px" }}
          fullWidth
          variant="outlined"
          onClick={handleButton}
        >
          Go to Chat!
        </Button>
      </div>
    </div>
  );
}

export default Login;
