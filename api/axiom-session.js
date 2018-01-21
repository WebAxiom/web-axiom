import nexpect from 'nexpect'
import { AxiomCommand } from './models'

export class AxiomSession {
  constructor () {
    // TODO: try/catch
    process.chdir('/input_files')
    this.history = []
  }

  sendCommand (cmd) {
    return new Promise((resolve, reject) => {
      // TODO: Prepare the cmd - remove spaces, etc.
      let axiomCommand = new AxiomCommand(cmd)
      this.history.push(axiomCommand)
      this.exec(this.history)
        .then(({output, lineno}) => {
          console.log(output)
          axiomCommand.setOutput(output)
          axiomCommand.setLineNo(lineno)
          // TODO: serialize to send smaller payload
          resolve(axiomCommand)
        })
        .catch((err) => reject(err))
    })
  }

  exec (aCommands) {
    let proc = nexpect.spawn('axiom -noht').wait('->').sendline(')set output tex on').wait('->')
    aCommands.forEach((aCmd) => { proc = proc.sendline(aCmd.getCommand()).wait('->') })
    proc = proc.sendline(')quit').sendline('y')
    return new Promise((resolve, reject) => {
      proc.run((err, stdout, exitcode) => {
        if (err) {
          reject(err)
        } else {
          let text = stdout.join('\n')
          let split = text.split(/\((\d+)\)\s+->/)
          if (split.length >= 4) {
            let output = split[split.length - 3]
            let lineno = parseInt(split[split.length - 4])
            resolve({output, lineno})
          }
          else {
            reject(new Error('Failed to split output'))
          }

        }
      })
    })
  }
}
