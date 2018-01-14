let extractLast = (source, regex) => {
  let result = null
  let match = regex.exec(source)
  while (match) {
    result = match
    match = regex.exec(source)
  }

  return result
}

export default {
  comments: (source, replace = true) => {
    let regex = /(--)([\s\S]*?)$/gm
    let result = source.match(regex)
    let rest = replace ? source.replace(regex, '') : source
    return {rest, result}
  },
  syntaxErrors: (source, replace = true) => {
    let regex = /^( {2}Line\s*(\d+):[\s\S]*?)*([\t ]*(\d+) error\(s\) parsing)/gm
    let result = source.match(regex)
    let rest = replace ? source.replace(regex, '') : source
    return {result, rest}
  },
  compileMessages: (source, replace = true) => {
    let regex = /(.*):(\d+):(\d+): (warning|note): ([\S\s]*?)(\n[\s^~]*\n)/g
    let result = []
    let match
    match = regex.exec(source)
    while (match && match.length >= 5) {
      result.push({
        path: match[0],
        lineno: match[1],
        charno: match[2],
        type: match[3],
        message: match[4]
      })
      match = regex.exec(source)
    }
    let rest = replace ? source.replace(regex, '') : source
    return {rest, result}
  },
  functionDefs: (source, replace = true) => {
    let regex = /\s*Function declaration ([a-zA-Z][\w]*) : (.* -> .*)\s* has been added to workspace./g
    let result = source.match(regex)
    let rest = replace ? source.replace(regex, '') : source
    return {result, rest}
  },
  type: (source, replace = true) => {
    let regex = /^\s*Type: (.*)\s*$/gm
    let result = extractLast(source, regex)
    let rest
    if (result) {
      rest = replace ? source.substr(0, result.index) + source.substr(result.index + result[0].length) : source
      result = result[1]
    } else {
      rest = source
      result = ''
    }
    return {rest, result}
  },
  latex: (source, replace = true) => {
    let regex = /(\$\$)([\s\S]*)(\$\$)/g
    let result = extractLast(source, regex)
    let rest
    if (result) {
      rest = replace ? source.substr(0, result.index) + source.substr(result.index + result[0].length) : source
      result = result[2].replace(/\\leqno\(\d+\)/, '')
    } else {
      rest = source
      result = ''
    }
    return {rest, result}
  }
}
