import Vue from 'vue'
// import keywords from '~/assets/data/axiom-keywords.json'

if (process.browser) {
  require('codemirror/lib/codemirror.css')
  require('codemirror/addon/edit/matchbrackets.js')
  require('codemirror/mode/commonlisp/commonlisp.js')
  const VueCodemirror = require('vue-codemirror')
  const CodeMirror = require('codemirror')

  CodeMirror.defineMode('axiom', function () {
    let patterns = [
      // {regex: new RegExp(keywords['categories']), token: 'builtin'},
      // {regex: new RegExp(keywords['packages']), token: 'builtin'},
      // {regex: new RegExp(keywords['domains']), token: 'builtin'},
      // {regex: new RegExp(keywords['operations']), token: 'string-2'},
      {regex: /\d/, token: 'number'},
      {regex: /("[\s\S]*?"|'[\S]*)/, token: 'string'}
    ]
    return {
      token: function (stream, state) {
        for (let idx in patterns) {
          const pattern = patterns[idx]
          if (stream.match(pattern.regex)) {
            return pattern.token
          }
        }
        stream.next()
        return 'variable'
      }
    }
  })

  Vue.use(VueCodemirror)
}
