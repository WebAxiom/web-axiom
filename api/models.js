export class AxiomCommand {
  constructor (input, output) {
    // let re = /\(\d+\)(.*?)\$\$(.*)\$\$.*?Type:(.*?)\(.*?\)/
    // let result = re.exec(output)
    this.input = input
    this.output = output
    let split = output.split('$$')
    if(split.length === 3) {
      this.error = false
      this.raw = split[0]
      this.latex = split[1].trim().replace(/\\leqno\(\d+?\)/, '')
      this.varType = split[2].trim()
    }
    else {
      this.error = true
    }
  }
}