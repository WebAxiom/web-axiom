import { exec } from './axiom-process'
import { AxiomCommand } from './models'

export class AxiomAdapter {

  constructor () {
    // TODO: turn into session object
    this.history = []
  }

  sendCommand(cmd) {
    return new Promise((resolve, reject) => {
      // TODO: Prepare the cmd - remove spaces, etc.
      let cleanCmd = cmd.split('\n').join(' ')
      cleanCmd = cleanCmd.split('\r').join(' ')
      this.history.push(cleanCmd)
      exec(this.history)
        .then((output) => {
          resolve(new AxiomCommand(cmd, output))
        })
        .catch((err) => reject(err))
    })
  }

}
