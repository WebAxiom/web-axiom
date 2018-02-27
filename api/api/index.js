import express from 'express'
import socketio from 'socket.io'
import { AxiomSession } from './axiom-session'

const app = express()

const server = app.listen(process.env.API_PORT, process.env.HOST, () => {
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
  socket.emit('log', {message: 'Connected'})
  // TODO try/catch if axiom doesn't exist
  let AA = new AxiomSession()
  socket.emit('log', {message: 'Axiom session created'})

  socket.on('evalCmd', ({cmd}) => {
    socket.emit('log', {message: `Cmd received ${cmd}`})

    AA.sendCommand(cmd)
      .then((res) => {
        socket.emit('log', {message: `Cmd evaluated ${res}`})
        socket.emit('evaluatedCmd', res)
      })
      .catch((err) => {
        // TODO: LOG
        socket.emit('log', {message: `Error caught ${err}`})
        socket.emit('evaluatedCmd', {sysError: err})
      })
  })

  socket.on('disconnect', (data) => {
    socket.emit('log', {message: 'Disconnected'})
  })
})
