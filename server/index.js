const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

let messages = []
let users = []

io.on('connection', socket => {
  socket.on('message', ({ user, message }) => {

    if(message !== undefined){
      const date = new Date()
      let timeStamp = date.toLocaleTimeString()
      messages.unshift({timeStamp:timeStamp, user,message:message })
    }
    io.emit('message', messages)
  })


  socket.on('userInfo', ({ nickname, color  }) => {
    users.unshift({user: {nickname, color: color}})
    console.log(users)
    io.emit('newUser', users)
  })

  socket.on('verify', ({nickname, color}) => {
    let available = true;
    console.log("checking")
    if(users.some(user => user.user.nickname === nickname )) {
      console.log("taken")
      available = false
    }
    socket.emit("verify", available)

  })


})

http.listen(4000, function() {
  console.log('listening on port 4000')
})