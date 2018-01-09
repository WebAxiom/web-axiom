import { spawn } from 'nexpect'

export let exec = (commands) => {
  let proc = spawn('axiom -noht').wait('->').sendline(')set output tex on').wait('->')
  commands.forEach((cmd) => proc = proc.sendline(cmd).wait('->'))
  proc = proc.sendline(')quit').sendline('y')
  return new Promise((resolve, reject) => {
    proc.run((err, stdout, exitcode) => {
      if (err) {
        reject(err)
      } else {
        let text = stdout.join('\n')
        let split = text.split('->')
        // TODO: length check
        let match = split[split.length - 2]
        resolve(match)
      }
    })
  })
}
