import _ from 'lodash'
import parsers from './parsers'

export class AxiomCommand {
  constructor (input) {
    this.input = input
    this.comments = []
    this.syntaxErrors = []
    this.functionDefs = []
    this.compileMessages = []
    this.setLatex('')
    this.cleanInput()
  }

  cleanInput () {
    this.cleanCmd = this.input.replace(/(\n|\r)/, '')
  }

  parseOutput () {
    let source = [
      {name: 'syntax errors', parseFun: parsers.syntaxErrors, setFun: this.setSyntaxErrors.bind(this)},
      {name: 'compile messages', parseFun: parsers.compileMessages, setFun: this.setCompileMessages.bind(this)},
      {name: 'function definitions', parseFun: parsers.functionDefs, setFun: this.setFunctionDefs.bind(this)},
      {name: 'latex', parseFun: parsers.latex, setFun: this.setLatex.bind(this)},
      {name: 'type', parseFun: parsers.type, setFun: this.setVarType.bind(this)}, // TODO: probably worthless
      {name: 'comments', parseFun: parsers.comments, setFun: this.setComments.bind(this)},
      {name: 'rest', parseFun: s => ({rest: s, result: s}), setFun: this.setPlainText.bind(this)}
    ]
    source.reduce((output, s) => {
      try {
        let parse = s.parseFun(output)
        s.setFun(_.isString(parse.result) ? parse.result.trim() : parse.result)
        return parse.rest
      } catch (err) {
        console.log(err)
        return output
      }
    }, this.output)
  }

  latexToKatex (latex) {
    // TODO: think of better solution to this, but will work for now
    let mappings = [
      ['\\sb', '_']
    ]

    let katex = latex

    mappings.forEach((el) => { katex = katex.replace(el[0], el[1]) })

    return katex
  }

  getCommand () {
    return this.cleanCmd
  }

  setSyntaxErrors (syntaxErrors) {
    if (_.isArray(syntaxErrors)) {
      this.syntaxErrors = syntaxErrors
    }
    // TODO: error
  }

  setFunctionDefs (functionDefs) {
    if (_.isArray(functionDefs)) {
      this.functionDefs = functionDefs
    }
    // TODO: error
  }

  setComments (comments) {
    if (_.isArray(comments)) {
      this.comments = comments
    }
    // TODO: error
  }

  setCompileMessages (compileMessages) {
    if (_.isArray(compileMessages)) {
      this.compileMessages = compileMessages
    }
    // TODO: error
  }

  setPlainText (plainText) {
    // TODO: error
    this.plainText = plainText || ''
  }

  setVarType (varType) {
    // TODO: error
    this.varType = varType || ''
  }

  setLatex (latex) {
    // TODO: error
    this.latex = latex ? this.latexToKatex(latex) : ''
  }

  setLineNo (lineno) {
    // TODO: error
    this.lineno = lineno || ''
  }

  setOutput (output) {
    this.output = output
    this.parseOutput()
  }
}
