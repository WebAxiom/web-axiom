import express from 'express'
import socketio from 'socket.io'
import { AxiomAdapter } from './axiom-adapter'

const API_PORT = 3001

const app = express()

const server = app.listen(API_PORT, () => {
  console.log(`Api started on ${API_PORT}`)
})

const io = socketio.listen(server)

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://0.0.0.0:3000')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  res.header('Access-Control-Allow-Credentials', 'true')
  next()
})

io.on('connection', (socket) => {
  socket.emit('connected', {message: 'Connected'})

  let AA = new AxiomAdapter()

  socket.on('evalCmd', ({cmd}) => {
    AA.sendCommand(cmd)
      .then((res) => {
        socket.emit('evaluatedCmd', JSON.stringify(res))
      })
      .catch((err) => {
        // TODO: LOG
        socket.emit('evaluatedCmd', {error: err})
      })
  })

  socket.on('disconnect', (data) => {
    socket.emit('disconnected', {message: 'Disconnected'})
  })
})


