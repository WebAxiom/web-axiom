import express from 'express'
import socketio from 'socket.io'

const API_PORT = 3001

const app = express()
const server = app.listen(API_PORT, () => {
  console.log(`Api started on ${API_PORT}`)
})
const io = socketio.listen(server)

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  res.header('Access-Control-Allow-Credentials', 'true')
  next()
});

io.on('connection', (socket) => {
  socket.emit('connection')
  socket.on('disconnect', (s2) => {
    socket.emit('disconnect')
  });
});


