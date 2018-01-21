import express from 'express'
import socketio from 'socket.io'
import { AxiomSession } from './axiom-session'

const app = express()

const server = app.listen(process.env.API_PORT, () => {
  console.log(`Api started at http://${process.env.HOST}${process.env.API_PORT ? ':' + process.env.API_PORT : ''}`)
})

const io = socketio.listen(server)

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', `http://${process.env.HOST}${process.env.APP_PORT ? ':' + process.env.APP_PORT : ''}`)
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  res.header('Access-Control-Allow-Credentials', 'true')
  next()
})

io.on('connection', (socket) => {
  socket.emit('connected', {message: 'Connected'})

  let AA = new AxiomSession()

  socket.on('evalCmd', ({cmd}) => {
    AA.sendCommand(cmd)
      .then((res) => {
        socket.emit('evaluatedCmd', res)
      })
      .catch((err) => {
        // TODO: LOG
        socket.emit('evaluatedCmd', {sysError: err})
      })
  })

  socket.on('disconnect', (data) => {
    socket.emit('disconnected', {message: 'Disconnected'})
  })
})
