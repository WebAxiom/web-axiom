let extractLast = (source, regex) => {
  let result = null
  let match = regex.exec(source)
  while (match) {
    result = match
    match = regex.exec(source)
  }

  return result
}

let extract = (source, regex, remove) => {
  let result = source.match(regex)
  let rest = remove ? source.replace(regex, '') : source
  return {rest, result}
}

export default {
  comments: (source, remove = true) => {
    let regex = /(--)([\s\S]*?)$/gm
    return extract(source, regex, remove)

  },
  syntaxErrors: (source, remove = true) => {
    let regex = /^( {2}Line\s*(\d+):[\s\S]*?)*([\t ]*(\d+) error\(s\) parsing)/gm
    return extract(source, regex, remove)
  },
  userErrors: (source, remove = true) => {
    let regex = /^\s*Error signalled from user code[\S ]*?:\s*[ \t\S]*?\n?[ \t]*\n/gm
    return extract(source, regex, remove)
  },
  commandNotFoundErrors: (source ,remove = true) => {
    let regex = /^\s*There are (\d+) exposed and (\d+) unexposed library operations named (\S+)\s+having (\d+) argument\(s\) but none was determined to be applicable\.\s+Use HyperDoc Browse, or issue\s+\)display op \S+\s+to learn more about the available operations\. Perhaps\s+package-calling the operation or using coercions on the arguments\s+will allow you to apply the operation.\s+Cannot find a definition or applicable library operation named\s+\S+ with argument type\(s\)(\s+\S+)+?\s+Perhaps you should use "@" to indicate the required return type,\s+or "\$" to specify which version of the function you need\./gm
    return extract(source, regex, remove)
  },
  compiledFunctions: (source, remove = true) => {
    let regex = /^\s*Compiling function ([\S]+) with type ([\S\s]+?)\s+->\s+([\S\s]+?)\s/gm
    return extract(source, regex, remove)
  },
  functionDefs: (source, remove = true) => {
    let regex = /\s*Function declaration ([a-zA-Z][\w]*) : (.* -> .*)\s* has been added to workspace./g
    return extract(source, regex, remove)
  },
  compileMessages: (source, remove = true) => {
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
    let rest = remove ? source.replace(regex, '') : source
    return {rest, result}
  },
  type: (source, remove = true) => {
    let regex = /^\s*Type: (.*)\s*$/gm
    let result = extractLast(source, regex)
    let rest
    if (result) {
      rest = remove ? source.substr(0, result.index) + source.substr(result.index + result[0].length) : source
      result = result[1]
    } else {
      rest = source
      result = ''
    }
    return {rest, result}
  },
  latex: (source, remove = true) => {
    let regex = /\$\$([\s\S]*?)\$\$/g
    return extract(source, regex, remove)
  }
}
