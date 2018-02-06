import _ from 'lodash'
import parsers from './parsers'
import utils from './utils'

export class AxiomCommand {
  constructor (input) {
    this.input = input
    this.compilation = []
    this.compiledFunctions = []
    this.compileMessages = []
    this.functionDefs = []
    this.errors = []
    this.userErrors = []
    this.commandNotFoundErrors = []
    this.comments = []
    this.syntaxErrors = []
    this.latex = []
    this.cleanInput()
  }

  cleanInput () {
    this.cleanCmd = this.input.replace(/(\n|\r)/, '')
  }

  parseOutput () {
    let source = [
      {remove: false, parseFun: parsers.syntaxErrors, setFun: this.setSyntaxErrors.bind(this)},
      {remove: false, parseFun: parsers.userErrors, setFun: this.setUserErrors.bind(this)},
      {remove: false, parseFun: parsers.commandNotFoundErrors, setFun: this.setCommandNotFoundErrors.bind(this)},
      {remove: false, parseFun: parsers.compileMessages, setFun: this.setCompileMessages.bind(this)},
      {remove: false, parseFun: parsers.compiledFunctions, setFun: this.setCompiledFunctions.bind(this)},
      {remove: false, parseFun: parsers.functionDefs, setFun: this.setFunctionDefs.bind(this)},
      {remove: false, parseFun: parsers.latex, setFun: this.setLatex.bind(this)},
      // {remove: true, parseFun: parsers.type, setFun: this.setVarType.bind(this)}, // TODO: probably worthless
      // {remove: true, parseFun: parsers.comments, setFun: this.setComments.bind(this)},
      {remove: false, parseFun: (s, r) => ({rest: s, result: s}), setFun: this.setPlainText.bind(this)}
    ]
    source.reduce((output, s) => {
      try {
        let parse = s.parseFun(output, s.remove)
        s.setFun(utils.trim(parse.result))
        return parse.rest
      } catch (err) {
        console.log(err)
        return output
      }
    }, this.output)
  }

  detectErrors () {
    this.errors = _.merge(
      this.syntaxErrors.map(e => ({type: 'Syntax error', message: e})),
      this.userErrors.map(e => ({type: 'User code error', message: e})),
      this.commandNotFoundErrors.map(e => ({type: 'Invalid command', message: e}))
    )
    this.compilation = _.merge(
      this.compileMessages,
      this.compiledFunctions.map(cf => ({type: 'Compiled function', message: cf}))
    )
    this.cmdError = this.errors.length > 0
    this.cmdCompile = this.compileMessages.length > 0
  }

  latexToKatex (latex) {
    // TODO: think of better solution to this, but will work for now
    let mappings = [
      ['\\sb', '_'],
      [/\\root {([\s\S]*?)} \\of {([\s\S]*?)}/g, '\\sqrt[$1]{$2}'],
      [/\s*\\leqno\(\d+\)/g, ''],
      [/\$\$/g, '']
    ]

    let katex = latex

    mappings.forEach((el) => { katex = katex.replace(el[0], el[1]) })

    return katex.trim()
  }

  getCommand () {
    return this.cleanCmd
  }

  setCompiledFunctions (compiledFunctions) {
    if (_.isArray(compiledFunctions)) {
      this.compiledFunctions = compiledFunctions
    }
    // TODO: error
  }

  setUserErrors (userErrors) {
    if (_.isArray(userErrors)) {
      this.userErrors = userErrors
    }
    // TODO: error
  }

  setSyntaxErrors (syntaxErrors) {
    if (_.isArray(syntaxErrors)) {
      this.syntaxErrors = syntaxErrors
    }
    // TODO: error
  }

  setCommandNotFoundErrors (commandNotFoundErrors) {
    if (_.isArray(commandNotFoundErrors)) {
      this.commandNotFoundErrors = commandNotFoundErrors
    }
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

  setLatex (latex) {
    if (_.isArray(latex)) {
      this.latex = latex.map(l => this.latexToKatex(l))
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

  setLineNo (lineno) {
    // TODO: error
    this.lineno = lineno || ''
  }

  setOutput (output) {
    this.output = output
    this.parseOutput()
    this.detectErrors()
  }
}
