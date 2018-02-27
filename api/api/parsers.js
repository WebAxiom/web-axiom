const COMMENT = 'COMMENT'
const ERROR = 'ERROR'
const COMPILATION = 'COMPILATION'
const NOTE = 'NOTE'
const LATEX = 'LATEX'
const PLAIN_TEXT = 'PLAIN_TEXT'

const texToLatex = (latex) => {
  // TODO: think of better solution to this, but will work for now
  let mappings = [
    [/\\mbox{\\rm([\s\S]*?)}/g, '\\mbox{$1}'],
    [/\s*\\sp\s*/g, '^'],
    [/\s*\\sb\s*/g, '_'],
    [/\\root {([\s\S]*?)} \\of {([\s\S]*?)}/g, '\\sqrt[$1]{$2}'],
    [/\s*\\leqno\(\d+\)/g, '']
  ]

  let katex = latex

  mappings.forEach((el) => { katex = katex.replace(el[0], el[1]) })

  return katex.trim()
}

export const labels = {
  ERROR,
  COMMENT,
  COMPILATION,
  NOTE,
  LATEX,
  PLAIN_TEXT
}

export const patterns = [
  {
    id: ERROR,
    regex: [/^(\s*?Line\s*(\d+):[\s\S]*?)*([\t ]*(\d+) error\(s\) parsing)/m],
    process: (match) => {
      return {
        type: 'Syntax error'
      }
    }
  },
  {
    id: ERROR,
    regex: [/^\s*?Error signalled from user code[\S ]*?:\n[\s\S]+?\n?\n/m],
    process: (match) => {
      return {
        type: 'Error in user code'
      }
    }
  },
  {
    id: ERROR,
    regex: [/^\s*?>> Error detected within library code[\S ]*?:\n[\s\S]+?\n?\n/m],
    process: (match) => {
      return {
        type: 'Error in library code'
      }
    }
  },
  {
    id: ERROR,
    regex: [
      /^\s*?There are (\d+) exposed and (\d+) unexposed library operations named (\S+)\s+having (\d+) argument\(s\) but none was determined to be applicable\.\s+Use HyperDoc Browse, or issue\s+\)display op [\S\s]+?to learn more about the available operations\. Perhaps\s+package-calling the operation or using coercions on the arguments\s+will allow you to apply the operation.\s+Cannot find a definition or applicable library operation named[\s\S]+? with argument type\(s\)[\s\S]+?\s+Perhaps you should use "@" to indicate the required return type,\s+or "\$" to specify which version of the function you need\./m,
      /^\s*?There are (\d+) exposed and (\d+) unexposed library operations named (\S+)\s+having (\d+) argument\(s\) but none was determined to be applicable\.\s+Use HyperDoc Browse, or issue\s+\)display op [\S\s]+?to learn more about the available operations\. Perhaps\s+package-calling the operation or using coercions on the arguments\s+will allow you to apply the operation.\s+Cannot find application of object of type [\S]+? to argument\(s\)\s+of type\(s\)[\s\S]+?\n\s*\n/m,
      /^\s*?There are no library operations named (\S+)\s+Use HyperDoc Browse or issue\s+\)what op [\S\s]+?to learn if there is any operation containing "[\s\S]+?" in its\s+name\.\s+?(Cannot find a definition or applicable library operation named[\s\S]+? with\s+?argument type\(s\)(\s+\S+)+?\s+Perhaps you should use "@" to indicate the required return type,\s+or "\$" to specify which version of the function you need\.|Cannot find a no-argument definition or library operation named ([\S]+\s|[\s\S]+?\.))/m
    ],
    process: (match) => {
      return {
        type: 'Command not found'
      }
    }
  },
  {
    id: COMPILATION,
    regex: [/^\s*?Compiling function ([\S]+) with type ([\S\s]+?)\s+->\s+([\S\s]+?)\s/m],
    process: (match) => {
      return {
        type: 'Function compilation'
      }
    }
  },
  {
    id: COMPILATION,
    regex: [/^[\s\S]+?:(\d+):(\d+): (warning|note): ([\S\s]*?)(\n[\s^~]*\n)/m],
    process: (match) => {
      return {
        type: `Compiler ${match[4]}`
      }
    }
  },
  {
    id: NOTE,
    regex: [/^\s*?Function declaration (\S+?) : ([\s\S]+?) has been added to\s+?workspace\./m],
    process: (match) => {
      return {
        type: `Function declaration`
      }
    }
  },
  {
    id: LATEX,
    regex: [/\$\$([\s\S]*?)\$\$/],
    process: (match) => {
      return {
        text: texToLatex(match[0])
      }
    }
  }
  // {
  //   id: COMMENT,
  //   regex: /(--)([\s\S]*?)$/m,
  //   process: (match) => {
  //     return {
  //     }
  //   }
  // }
]
