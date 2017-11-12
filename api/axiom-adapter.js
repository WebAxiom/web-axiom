import { exec } from './axiom-process'
import { AxiomCommand } from './models'

export class AxiomAdapter {

  constructor () {
    this.history = []
  }

  sendCommand(cmd) {
    return new Promise((resolve, reject) => {
      this.history.push(cmd)
      exec(this.history)
        .then((output) => {
          resolve(new AxiomCommand(cmd, output))
        })
        .catch((err) => reject(err))
    })
  }

}
