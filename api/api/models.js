import {patterns, labels} from './parsers'

export class AxiomCommand {
  constructor (input) {
    this.input = input
    this.tokens = []
    this.compilation = []
    this.errors = []
    this.cleanInput()
  }

  cleanInput () {
    this.cleanCmd = this.input.replace(/(\n|\r)/, '')
  }

  parseCommand () {
    this.parseOutput({text: this.output, start: 0, end: this.output.length})
    this.serialize()
  }

  parseOutput (current) {
    let found = false
    let token = {}
    let a = ''
    let b = ''
    for (let pid in patterns) {
      if (!found) {
        let pattern = patterns[pid]
        for (let regid in pattern.regex) {
          if (found) break
          let regex = pattern.regex[regid]
          let match = regex.exec(current.text)
          if (match !== null) {
            found = true
            token = pattern.process(match)
            token.id = pattern.id
            if (!('text' in token)) {
              token.text = match[0]
            }
            token.start = current.start + match.index
            token.end = token.start + match[0].length
            a = current.text.substr(0, match.index)
            b = current.text.substr(match.index + match[0].length)
          }
        }
      }
    }
    if (!found) {
      token = {id: labels.PLAIN_TEXT, ...current}
    }
    if (a.length > 0) {
      this.parseOutput({text: a, start: current.start, end: token.start + 1})
    }
    token.plainText = [labels.PLAIN_TEXT, labels.COMMENT, labels.NOTE].indexOf(token.id) !== -1
    token.latex = token.id === labels.LATEX
    token.compilation = token.id === labels.COMPILATION
    token.error = token.id === labels.ERROR
    token.display = false
    this.tokens.push(token)
    if (b.length > 0) {
      this.parseOutput({text: b, start: token.end, end: current.end})
    }
  }

  serialize () {
    const errors = this.tokens
      .filter(token => token.id === labels.ERROR)
    const compilation = this.tokens
      .filter(token => token.id === labels.COMPILATION || token.id === labels.NOTE)
    const text = this.tokens
      .filter(token => token.id === labels.PLAIN_TEXT)
    this.containsText = text.length > 0
    this.containsErrors = errors.length > 0
    this.containsCompilation = compilation.length > 0
  }

  getPayload () {
    // TODO: Think of way to optimize
    return {
      // errors: this.errors,
      // compilation: this.compilation,
      input: this.input,
      lineno: this.lineno,
      tokens: this.tokens,
      containsText: this.containsText,
      containsErrors: this.containsErrors
    }
  }

  getCommand () {
    return this.cleanCmd
  }

  setLineNo (lineno) {
    // TODO: error
    this.lineno = lineno || ''
  }

  setOutput (output) {
    this.output = output
  }
}
