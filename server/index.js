const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

let messages = []
let users = []

io.on('connection', socket => {
  socket.on('message', ({ user, message }) => {

    if(message !== undefined || user.user !== undefined){
      const date = new Date()
      let timeStamp = date.toLocaleTimeString()
      messages.unshift({timeStamp:timeStamp, user,message:message })
      console.log(messages)
    }
    io.emit('message', messages)
  })


  socket.on('userInfo', ({ nickname, color  }) => {
    users.unshift({user: nickname, color: color})
    console.log(users)
    io.emit('newUser', users)
  })
})

http.listen(4000, function() {
  console.log('listening on port 4000')
})