export class AxiomCommand {

  constructor (input, output) {
    // let re = /\(\d+\)(.*?)\$\$(.*)\$\$.*?Type:(.*?)\(.*?\)/
    // let result = re.exec(output)
    this.input = input
    this.output = output
    this.latex = ''
    let split = output.split('$$')
    let type_split = output.split('Type:')
    if (split.length === 3) {
      this.error = false
      this.extractLineNo(split[0])
      this.latex = split[1].trim().replace(/\\leqno\(\d+?\)/, '')
      this.varType = split[2].trim() // TODO: clean type
    }
    else if (split.length === 1 && type_split.length === 2) {
      this.error = false
      this.extractLineNo(type_split[0])
      this.varType = type_split[1].trim()
    }
    else {
      this.error = false
      this.raw = this.extractLineNo(output)
    }
    this.latex = this.latexToKatex(this.latex)
  }

  latexToKatex (latex) {
    // TODO: think of better solution to this, but will work for now
    let mappings = [
      ['\\sb', '_']
    ]

    let katex = latex

    mappings.forEach(el => katex = katex.split(el[0]).join(el[1]))

    return katex
  }

  extractLineNo (raw) {
    // TODO: check if raw is string
    let split = raw.split('\n')
    if (split.length > 0) {
      let mid = Math.floor(split.length / 2)
      let lineno_re = /^\s*?\((\d+)\)/g
      let match = lineno_re.exec(split[mid])
      if (match) {
        split[mid] = ' '.repeat(lineno_re.lastIndex) + split[mid].substr(lineno_re.lastIndex)
        this.lineno = match[1]
      } else {
        this.lineno = undefined
        // TODO: LOG line number not on this line
      }
    } else {
      this.lineno = undefined
      // TODO: Silly error, should not happen
    }

    // TODO: ignore instead of removing
    split = split.filter(el => el.trim().length !== 0)
    let cnts = split.map(el => {
      let match = /^\s*/.exec(el)
      return match ? match[0].length : 0
    }).sort()
    let mn = cnts.length > 0 ? cnts[0] : 0

    this.raw = split.map(el => el.substr(mn)).join('\n')

  }
}
