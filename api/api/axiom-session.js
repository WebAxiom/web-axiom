import { spawn } from 'child_process'
import { AxiomCommand } from './models'

export class AxiomSession {
  constructor () {
    this.axiom = spawn('axiom', ['-noht', '-noclef', '-nox'])
    this.history = []
    this.buffer = []
    this.__nxtCmd__ = null
    this.stdout = ''
    this.axiom.stdout.on('data', this.processChunk.bind(this))
    this.axiom.stdin.setEncoding('utf-8')
    this.sendCommand(')set output tex on\n')
  }

  sendCommand (cmd) {
    return new Promise((resolve, reject) => {
      let axiomCommand = new AxiomCommand(cmd)
      this.history.push(axiomCommand)
      this.exec(axiomCommand)
        .then(
          ({output, lineno}) => {
            axiomCommand.setOutput(output)
            axiomCommand.setLineNo(lineno)
            axiomCommand.parseCommand()
            resolve(axiomCommand.getPayload())
          },
          (err) => reject(err)
        )
    })
  }

  processChunk (chunk) {
    this.stdout += chunk.toString()
    let match
    while ((match = /\((\d+)\)\s*->([\s\S]*?)(?=\(\d+\)\s*->)/g.exec(this.stdout)) !== null) {
      this.__nxtCmd__ = {lineno: match[1], output: match[2]}
      this.stdout = this.stdout.substr(match.index + match[0].length - 1)
    }
  }
  // TODO: For long commands this will essentially become an infinite loop
  // TODO: Look for better solutions
  __nextCommand__ (timeout = 100) {
    return new Promise((resolve, reject) => {
      if (this.__nxtCmd__ === null) {
        setTimeout(() => resolve(this.__nextCommand__()), timeout)
      } else {
        const cmd = this.__nxtCmd__
        this.__nxtCmd__ = null
        resolve(cmd)
      }
    })
  }

  nextCommand () {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(this.__nextCommand__()), 0)
    })
  }

  exec (cmd) {
    this.axiom.stdin.write(`${cmd.getCommand()}\n`)
    return this.nextCommand()
  }
}
