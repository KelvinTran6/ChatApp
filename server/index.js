const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

let messages = []

io.on('connection', socket => {
  socket.on('message', ({ user, message }) => {
    const date = new Date()
    let timeStamp = date.toLocaleTimeString()
    
    messages.unshift({timeStamp:timeStamp, user:user,message:message })
    console.log(messages)

    io.emit('message', messages)
  })
})

http.listen(4000, function() {
  console.log('listening on port 4000')
})