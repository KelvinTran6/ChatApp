const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

let messages = [];
let users = [];

io.on("connection", (socket) => {
  var ID;

  socket.on("disconnect", () => {
    console.log(ID);
    users = users.filter(function (obj) {
      return obj.user.socket !== ID
    });
    io.emit("newUser", users);
  });

  socket.on("changeName", ({nickname, newNickName, color}) => {
    var index = users.findIndex((current => current.user.nickname == nickname));
    users[index].user.nickname = newNickName
    console.log(users)
    io.emit("newUser", users);
    const date = new Date();
    let timeStamp = date.toLocaleTimeString();

    const message = "Time for a change, my new nickname is " + newNickName + "!!!"
    const user = {nickname, color}

    messages.unshift({ timeStamp: timeStamp, user, message: message });
    console.log(messages)
    io.emit("message", messages);
  })

  socket.on("message", ({ user, message }) => {
    if (message !== undefined) {
      const date = new Date();
      let timeStamp = date.toLocaleTimeString();
      messages.unshift({ timeStamp: timeStamp, user, message: message });
    }
    io.emit("message", messages);
  });

  socket.on("userInfo", ({ nickname, color, socketID }) => {
    ID = socketID;
    if (!users.some((user) => user.user.nickname === nickname)) {
      users.unshift({ user: { nickname, color: color, socket: ID } });
    }
    console.log(users);
    io.emit("newUser", users);
  });

  socket.on("uniqueName", () => {
    const {
      uniqueNamesGenerator,
      adjectives,
      colors,
      animals,
    } = require("unique-names-generator");
    let uniqueName = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
    });

    while (users.some((user) => user.user.nickname === uniqueName)) {
      console.log(uniqueName);
      uniqueName = uniqueNamesGenerator({
        dictionaries: [adjectives, colors, animals],
      });
    }
    io.emit("uniqueName", uniqueName);
  });

  socket.on("verify", ({ nickname, color }) => {
    let available = true;
    console.log("checking");
    if (users.some((user) => user.user.nickname === nickname)) {
      console.log("taken");
      available = false;
    }
    socket.emit("verify", available);
  });
});

http.listen(4000, function () {
  console.log("listening on port 4000");
});
