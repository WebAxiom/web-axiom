import _ from 'lodash'
import parsers from './parsers'

export class AxiomCommand {
  constructor (input) {
    this.input = input
    this.compilation = []
    this.compiledFunctions = []
    this.compileMessages = []
    this.functionDefs = []
    this.errors = []
    this.userErrors = []
    this.comments = []
    this.syntaxErrors = []
    this.setLatex('')
    this.cleanInput()
  }

  cleanInput () {
    this.cleanCmd = this.input.replace(/(\n|\r)/, '')
  }

  trim (obj) {
    if (_.isString(obj)) {
      return obj.trim()
    } else if (_.isArray(obj) && obj.length > 0 && _.isString(obj[0])) {
      return obj.map(s => s.replace(/^\s*$/gm, ''))
    }
  }

  parseOutput () {
    let source = [
      {replace: true, parseFun: parsers.syntaxErrors, setFun: this.setSyntaxErrors.bind(this)},
      {replace: true, parseFun: parsers.userErrors, setFun: this.setUserErrors.bind(this)},
      {replace: true, parseFun: parsers.compileMessages, setFun: this.setCompileMessages.bind(this)},
      {replace: true, parseFun: parsers.compiledFunctions, setFun: this.setCompiledFunctions.bind(this)},
      {replace: false, parseFun: parsers.functionDefs, setFun: this.setFunctionDefs.bind(this)},
      {replace: true, parseFun: parsers.latex, setFun: this.setLatex.bind(this)},
      {replace: true, parseFun: parsers.type, setFun: this.setVarType.bind(this)}, // TODO: probably worthless
      {replace: true, parseFun: parsers.comments, setFun: this.setComments.bind(this)},
      {replace: false, parseFun: (s, r) => ({rest: s, result: s}), setFun: this.setPlainText.bind(this)}
    ]
    source.reduce((output, s) => {
      try {
        let parse = s.parseFun(output, s.replace)
        s.setFun(this.trim(parse.result))
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
      this.userErrors.map(e => ({type: 'User code error', message: e}))
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
      ['\\sb', '_']
    ]

    let katex = latex

    mappings.forEach((el) => { katex = katex.replace(el[0], el[1]) })

    return katex
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
    this.detectErrors()
  }
}
